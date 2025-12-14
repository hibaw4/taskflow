package com.example.taskflow.dto;
import lombok.Data;
import java.util.List;

@Data
public class ProjectDTO {
    private Long id;
    private String title;
    private String description;
    private int progressPercentage; // The calculated math
    private List<TaskDTO> tasks;    // The list of tasks
}