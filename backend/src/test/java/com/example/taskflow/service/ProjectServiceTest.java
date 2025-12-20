package com.example.taskflow.service;

// 1. DTOs and Models
import com.example.taskflow.dto.ProjectDTO;
import com.example.taskflow.dto.TaskDTO;
import com.example.taskflow.model.Project;
import com.example.taskflow.model.Task;
import com.example.taskflow.model.User;

// 2. Repositories
import com.example.taskflow.repository.ProjectRepository;
import com.example.taskflow.repository.UserRepository;

// 3. JUnit
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import static org.junit.jupiter.api.Assertions.*;

// 4. Mockito
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

// 5. Spring Security (To fake the login)
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;

// 6. Java Utilities
import java.util.Collections;
import java.util.List;
import java.util.Optional;

@ExtendWith(MockitoExtension.class)
class ProjectServiceTest {

    @Mock
    private ProjectRepository projectRepository;

    @Mock
    private UserRepository userRepository;

    // --- Mocks for Security (Login) ---
    @Mock
    private SecurityContext securityContext;
    @Mock
    private Authentication authentication;

    @InjectMocks
    private ProjectService projectService;

    // Reset security after every test to avoid bugs
    @AfterEach
    void tearDown() {
        SecurityContextHolder.clearContext();
    }

    // --- HELPER: Simulates a logged-in user ---
    private void mockLoggedInUser(User user) {
        // 1. Tell Spring Security: "Someone is logged in with this username"
        when(securityContext.getAuthentication()).thenReturn(authentication);
        when(authentication.getName()).thenReturn(user.getUsername());
        SecurityContextHolder.setContext(securityContext);

        // 2. Tell Database: "When looking for that username, return this User object"
        when(userRepository.findByUsername(user.getUsername())).thenReturn(Optional.of(user));
    }

    @Test
    void getAllProjects_shouldReturnDTOList() {
        // ARRANGE
        User user = new User();
        user.setId(1L);
        user.setUsername("testuser");

        mockLoggedInUser(user);

        Project p1 = new Project();
        p1.setId(10L);
        p1.setTitle("My Project");
        p1.setUser(user);
        // Important: Set an empty list so it doesn't crash when calculating progress
        p1.setTasks(Collections.emptyList());

        when(projectRepository.findByUserId(user.getId())).thenReturn(List.of(p1));

        // ACT
        List<ProjectDTO> result = projectService.getAllProjects();

        // ASSERT
        assertEquals(1, result.size());
        assertEquals("My Project", result.get(0).getTitle());
    }

    @Test
    void createProject_shouldSaveAndReturnProject() {
        // ARRANGE
        User user = new User();
        user.setUsername("creator");

        mockLoggedInUser(user);

        ProjectDTO inputDto = new ProjectDTO();
        inputDto.setTitle("New Idea");
        inputDto.setDescription("Description here");

        // Mock the save to return a project with ID 55
        when(projectRepository.save(any(Project.class))).thenAnswer(invocation -> {
            Project saved = invocation.getArgument(0);
            saved.setId(55L);
            return saved;
        });

        // ACT
        Project result = projectService.createProject(inputDto);

        // ASSERT
        assertNotNull(result);
        assertEquals(55L, result.getId());
        assertEquals("New Idea", result.getTitle());
        assertEquals(user, result.getUser()); // Verify it was linked to the logged-in user
    }

    @Test
    void getProjectById_shouldReturnDTO_andCalculateProgress() {
        // ARRANGE
        Long projectId = 1L;
        Project project = new Project();
        project.setId(projectId);
        project.setTitle("Math Test");

        // Add 2 tasks: 1 Done, 1 Not Done -> Should be 50% progress
        Task t1 = new Task(); t1.setId(100L); t1.setCompleted(true);
        Task t2 = new Task(); t2.setId(101L); t2.setCompleted(false);
        project.setTasks(List.of(t1, t2));

        when(projectRepository.findById(projectId)).thenReturn(Optional.of(project));

        // ACT
        ProjectDTO result = projectService.getProjectById(projectId);

        // ASSERT
        assertEquals("Math Test", result.getTitle());
        assertEquals(2, result.getTasks().size());
        assertEquals(50, result.getProgressPercentage()); // 1 out of 2 = 50%
    }

    @Test
    void deleteProject_shouldCallRepository() {
        // ARRANGE
        Long id = 99L;

        // ACT
        projectService.deleteProject(id);

        // ASSERT
        verify(projectRepository, times(1)).deleteById(id);
    }
}