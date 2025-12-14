package com.example.taskflow.controller;

import com.example.taskflow.dto.TaskDTO;
import com.example.taskflow.model.Task;
import com.example.taskflow.service.TaskService;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/tasks")
@CrossOrigin(origins = "http://localhost:5173")
public class TaskController {

    private final TaskService taskService;

    public TaskController(TaskService taskService) {
        this.taskService = taskService;
    }

    @PostMapping("/project/{projectId}")
    public Task createTask(@PathVariable Long projectId, @RequestBody TaskDTO taskDTO) {
        return taskService.createTask(projectId, taskDTO);
    }

    @PutMapping("/{taskId}/toggle")
    public Task toggleTask(@PathVariable Long taskId) {
        return taskService.toggleTaskStatus(taskId);
    }

    @DeleteMapping("/{taskId}")
    public void deleteTask(@PathVariable Long taskId) {
        taskService.deleteTask(taskId);
    }
}