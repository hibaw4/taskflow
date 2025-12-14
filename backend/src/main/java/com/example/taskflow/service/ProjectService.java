package com.example.taskflow.service;

import com.example.taskflow.dto.ProjectDTO;
import com.example.taskflow.dto.TaskDTO;
import com.example.taskflow.model.Project;
import com.example.taskflow.model.User;
import com.example.taskflow.repository.ProjectRepository;
import com.example.taskflow.repository.UserRepository;
import org.springframework.security.core.context.SecurityContextHolder; // <--- Import this!
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

    // 1. GET ALL (For the Logged-in User only)
    public List<ProjectDTO> getAllProjects() {
        User currentUser = getCurrentUser(); // <--- Dynamic
        List<Project> projects = projectRepository.findByUserId(currentUser.getId());

        return projects.stream().map(this::convertToDTO).collect(Collectors.toList());
    }

    // 2. CREATE (Assign to Logged-in User)
    public Project createProject(ProjectDTO dto) {
        User currentUser = getCurrentUser(); // <--- Dynamic

        Project project = new Project();
        project.setTitle(dto.getTitle());
        project.setDescription(dto.getDescription());
        project.setUser(currentUser); // Assign to the actual user

        return projectRepository.save(project);
    }

    // DELETE
    public void deleteProject(Long id) {
        projectRepository.deleteById(id);
    }

    // GET ONE
    public ProjectDTO getProjectById(Long id) {
        Project project = projectRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Project not found with id: " + id));
        return convertToDTO(project);
    }

    // --- HELPER METHODS ---

    // Extract the user from the Security Token (JWT)
    private User getCurrentUser() {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        return userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found: " + username));
    }

    private ProjectDTO convertToDTO(Project project) {
        ProjectDTO dto = new ProjectDTO();
        dto.setId(project.getId());
        dto.setTitle(project.getTitle());
        dto.setDescription(project.getDescription());

        List<TaskDTO> taskDTOs = project.getTasks().stream().map(task -> {
            TaskDTO tDto = new TaskDTO();
            tDto.setId(task.getId());
            tDto.setTitle(task.getTitle());
            tDto.setDescription(task.getDescription());
            tDto.setDueDate(task.getDueDate());
            tDto.setCompleted(task.isCompleted());
            return tDto;
        }).collect(Collectors.toList());
        dto.setTasks(taskDTOs);

        if (taskDTOs.isEmpty()) {
            dto.setProgressPercentage(0);
        } else {
            long completedCount = taskDTOs.stream().filter(TaskDTO::isCompleted).count();
            int progress = (int) ((completedCount * 100) / taskDTOs.size());
            dto.setProgressPercentage(progress);
        }

        return dto;
    }
}