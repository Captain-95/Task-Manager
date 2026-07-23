package com.taskmanager.model;

import lombok.*;

import java.time.LocalDateTime;

/**
 * Plain in-memory model - deliberately NOT a JPA @Entity.
 * The assignment asks for an in-memory List on the backend for tasks
 * (no database setup), so this is held in a TaskStore, not persisted.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Task {
    private String id;
    private String name;
    private String description;
    private TaskStatus status;
    private LocalDateTime createdDate;
    private Long assignedUserId;
    private String assignedUsername;
    private Long createdByUserId;
    private String createdByUsername;
}
