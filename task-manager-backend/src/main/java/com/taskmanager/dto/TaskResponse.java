package com.taskmanager.dto;

import com.taskmanager.model.Task;
import com.taskmanager.model.TaskStatus;
import lombok.*;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TaskResponse {
    private String id;
    private String name;
    private String description;
    private TaskStatus status;
    private LocalDateTime createdDate;
    private Long assignedUserId;
    private String assignedUsername;
    private Long createdByUserId;
    private String createdByUsername;

    public static TaskResponse fromTask(Task task) {
        return TaskResponse.builder()
                .id(task.getId())
                .name(task.getName())
                .description(task.getDescription())
                .status(task.getStatus())
                .createdDate(task.getCreatedDate())
                .assignedUserId(task.getAssignedUserId())
                .assignedUsername(task.getAssignedUsername())
                .createdByUserId(task.getCreatedByUserId())
                .createdByUsername(task.getCreatedByUsername())
                .build();
    }
}
