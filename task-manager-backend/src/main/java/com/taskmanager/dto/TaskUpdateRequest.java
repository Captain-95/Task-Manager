package com.taskmanager.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class TaskUpdateRequest {

    @NotBlank(message = "Task name is required")
    @Size(max = 150)
    private String name;

    @Size(max = 500)
    private String description;

}