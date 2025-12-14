package com.example.taskflow.service;

import com.example.taskflow.dto.ProjectDTO;
import com.example.taskflow.dto.TaskDTO;
import com.example.taskflow.model.Project;
import com.example.taskflow.model.Task;
import com.example.taskflow.model.User;
import com.example.taskflow.repository.ProjectRepository;
import com.example.taskflow.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class ProjectService {

    private final ProjectRepository projectRepository;
    private final UserRepository userRepository;

    public ProjectService(ProjectRepository projectRepository, UserRepository userRepository) {
        this.projectRepository = projectRepository;
        this.userRepository = userRepository;
    }

    // GET ALL (For User 1)
    public List<ProjectDTO> getAllProjects() {
        Long tempUserId = 1L; // HARDCODED for now
        List<Project> projects = projectRepository.findByUserId(tempUserId);

        // Convert Entity -> DTO
        return projects.stream().map(this::convertToDTO).collect(Collectors.toList());
    }

    // CREATE
    public Project createProject(ProjectDTO dto) {
        Long tempUserId = 1L; // HARDCODED
        User user = userRepository.findById(tempUserId).orElseThrow();

        Project project = new Project();
        project.setTitle(dto.getTitle());
        project.setDescription(dto.getDescription());
        project.setUser(user);

        return projectRepository.save(project);
    }

    // DELETE
    public void deleteProject(Long id) {
        projectRepository.deleteById(id);
    }

    // Helper: Converts Project Entity to ProjectDTO and calculates progress
    private ProjectDTO convertToDTO(Project project) {
        ProjectDTO dto = new ProjectDTO();
        dto.setId(project.getId());
        dto.setTitle(project.getTitle());
        dto.setDescription(project.getDescription());

        // Map Tasks
        List<TaskDTO> taskDTOs = project.getTasks().stream().map(task -> {
            TaskDTO tDto = new TaskDTO();
            tDto.setId(task.getId());
            tDto.setTitle(task.getTitle());
            tDto.setDescription(task.getDescription()); // <--- Add Description too
            tDto.setDueDate(task.getDueDate());         // <--- ADD THIS LINE
            tDto.setCompleted(task.isCompleted());
            return tDto;
        }).collect(Collectors.toList());
        dto.setTasks(taskDTOs);

        // CALCULATE PROGRESS
        if (taskDTOs.isEmpty()) {
            dto.setProgressPercentage(0);
        } else {
            long completedCount = taskDTOs.stream().filter(TaskDTO::isCompleted).count();
            int progress = (int) ((completedCount * 100) / taskDTOs.size());
            dto.setProgressPercentage(progress);
        }

        return dto;
    }

    // Get ONE Project by ID (and convert to DTO)
    public ProjectDTO getProjectById(Long id) {
        Project project = projectRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Project not found with id: " + id));

        return convertToDTO(project);
    }
}