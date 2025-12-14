package com.example.taskflow.service;

import com.example.taskflow.dto.TaskDTO;
import com.example.taskflow.model.Project;
import com.example.taskflow.model.Task;
import com.example.taskflow.repository.ProjectRepository;
import com.example.taskflow.repository.TaskRepository;
import org.springframework.stereotype.Service;

@Service
public class TaskService {

    private final TaskRepository taskRepository;
    private final ProjectRepository projectRepository;

    public TaskService(TaskRepository taskRepository, ProjectRepository projectRepository) {
        this.taskRepository = taskRepository;
        this.projectRepository = projectRepository;
    }

    public Task createTask(Long projectId, TaskDTO dto) {
        Project project = projectRepository.findById(projectId).orElseThrow();

        Task task = new Task();
        task.setTitle(dto.getTitle());
        task.setDescription(dto.getDescription());
        task.setDueDate(dto.getDueDate());
        task.setProject(project); // Link to project

        return taskRepository.save(task);
    }

    public Task toggleTaskStatus(Long taskId) {
        Task task = taskRepository.findById(taskId).orElseThrow();
        task.setCompleted(!task.isCompleted()); // Switch True/False
        return taskRepository.save(task);
    }

    public void deleteTask(Long taskId) {
        taskRepository.deleteById(taskId);
    }
}