package com.taskmanager.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class TaskRequest {

    @NotBlank(message = "Task name is required")
    @Size(max = 150, message = "Task name must be under 150 characters")
    private String name;

    @Size(max = 1000, message = "Description must be under 1000 characters")
    private String description;

    @NotNull(message = "Please select responsible user")
    private Long assignedUserId;
}
