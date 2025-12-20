package com.example.taskflow.service;

import com.example.taskflow.dto.TaskDTO;
import com.example.taskflow.model.Project;
import com.example.taskflow.model.Task;
import com.example.taskflow.repository.ProjectRepository;
import com.example.taskflow.repository.TaskRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDate;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class TaskServiceTest {

    @Mock
    private TaskRepository taskRepository;

    @Mock
    private ProjectRepository projectRepository;

    @InjectMocks
    private TaskService taskService;

    @Test
    void createTask_shouldSaveTask_whenProjectExists() {
        // --- 1. ARRANGE ---
        Long projectId = 1L;
        Project mockProject = new Project();
        mockProject.setId(projectId);

        TaskDTO taskDTO = new TaskDTO();
        taskDTO.setTitle("Test Task");
        taskDTO.setDescription("Testing logic");
        taskDTO.setDueDate(LocalDate.now());

        // Tell ProjectRepository: "If someone asks for Project ID 1, return this mockProject"
        when(projectRepository.findById(projectId)).thenReturn(Optional.of(mockProject));

        // Tell TaskRepository: "If someone saves a task, just return it back"
        when(taskRepository.save(any(Task.class))).thenAnswer(invocation -> invocation.getArgument(0));

        // --- 2. ACT ---
        Task savedTask = taskService.createTask(projectId, taskDTO);

        // --- 3. ASSERT ---
        assertNotNull(savedTask);
        assertEquals("Test Task", savedTask.getTitle());
        assertEquals(mockProject, savedTask.getProject());

        // Verify that save was actually called once
        verify(taskRepository, times(1)).save(any(Task.class));
    }

    @Test
    void toggleTaskStatus_shouldSwitchStatus() {
        // --- 1. ARRANGE ---
        Long taskId = 10L;
        Task existingTask = new Task();
        existingTask.setId(taskId);
        existingTask.setCompleted(false);

        // Mock finding the task
        when(taskRepository.findById(taskId)).thenReturn(Optional.of(existingTask));
        // Mock saving (return the task that was passed in)
        when(taskRepository.save(any(Task.class))).thenAnswer(invocation -> invocation.getArgument(0));

        // --- 2. ACT ---
        Task updatedTask = taskService.toggleTaskStatus(taskId);

        // --- 3. ASSERT ---
        assertTrue(updatedTask.isCompleted()); // It should now be TRUE
    }

    @Test
    void deleteTask_shouldCallDelete() {
        // --- 1. ARRANGE ---
        Long taskId = 5L;

        // --- 2. ACT ---
        taskService.deleteTask(taskId);

        // --- 3. ASSERT ---
        // Verify that the deleteById method was called exactly once with ID 5
        verify(taskRepository, times(1)).deleteById(taskId);
    }

    @Test
    void toggleTaskStatus_shouldThrowError_whenTaskNotFound() {
        // --- 1. ARRANGE ---
        Long nonExistentId = 999L;

        // Tell the fake DB: "If they ask for ID 999, return NOTHING (Empty)"
        when(taskRepository.findById(nonExistentId)).thenReturn(Optional.empty());

        // --- 2. ACT & ASSERT ---
        // We expect the service to say "NoSuchElementException"
        assertThrows(java.util.NoSuchElementException.class, () -> {
            taskService.toggleTaskStatus(nonExistentId);
        });

        // Verify we never tried to save anything (because it crashed first)
        verify(taskRepository, never()).save(any(Task.class));
    }
}