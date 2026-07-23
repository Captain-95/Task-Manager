package com.taskmanager.repository;

import com.taskmanager.model.Task;
import jakarta.annotation.PostConstruct;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.util.*;
import java.util.concurrent.ConcurrentHashMap;

/**
 * In-memory "database" for tasks, exactly as the assignment asks for:
 * a simple in-memory collection (no relational DB, no setup).
 * A ConcurrentHashMap is used instead of a plain List so lookups/updates/
 * deletes by id are O(1) and thread-safe, while findAll() still returns
 * a List. Data is seeded with a few sample tasks on startup and resets
 * whenever the app restarts.
 */
@Component
public class TaskStore {

    private final Map<String, Task> tasks = new ConcurrentHashMap<>();

    @PostConstruct
    public void seed() {
//        save(Task.builder()
//                .name("Set up project repository")
//                .description("Initialize backend and frontend repos with base structure")
//                .status(TaskStatus.COMPLETED)
//                .createdDate(LocalDateTime.now().minusDays(2))
//                .build());
//
//        save(Task.builder()
//                .name("Design REST API contracts")
//                .description("Define endpoints for tasks CRUD and dashboard summary")
//                .status(TaskStatus.COMPLETED)
//                .createdDate(LocalDateTime.now().minusDays(1))
//                .build());
//
//        save(Task.builder()
//                .name("Implement JWT authentication")
//                .description("Add login, role-based access and token validation")
//                .status(TaskStatus.PENDING)
//                .createdDate(LocalDateTime.now())
//                .build());
    }

    public List<Task> findAll() {
        return new ArrayList<>(tasks.values());
    }

    public Optional<Task> findById(String id) {
        return Optional.ofNullable(tasks.get(id));
    }

    public Task save(Task task) {
        if (task.getId() == null) {
            task.setId(UUID.randomUUID().toString());
        }
        if (task.getCreatedDate() == null) {
            task.setCreatedDate(LocalDateTime.now());
        }
        tasks.put(task.getId(), task);
        return task;
    }

    public boolean existsById(String id) {
        return tasks.containsKey(id);
    }

    public void deleteById(String id) {
        tasks.remove(id);
    }
}
