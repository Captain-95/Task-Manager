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

    public static TaskResponse fromTask(Task task) {
        return TaskResponse.builder()
                .id(task.getId())
                .name(task.getName())
                .description(task.getDescription())
                .status(task.getStatus())
                .createdDate(task.getCreatedDate())
                .build();
    }
}
