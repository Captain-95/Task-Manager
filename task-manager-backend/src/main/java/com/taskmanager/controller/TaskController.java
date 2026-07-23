package com.taskmanager.controller;

import com.taskmanager.dto.*;
import com.taskmanager.service.TaskService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/tasks")
@RequiredArgsConstructor
public class TaskController {

    private final TaskService taskService;

    @PostMapping("/search")
    public ResponseEntity<List<TaskResponse>> searchTasks(@RequestBody TaskFilterRequest filter) {

        return ResponseEntity.ok(taskService.searchTasks(filter));

    }

    @PostMapping
    public ResponseEntity<TaskResponse> createTask(@Valid @RequestBody TaskRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(taskService.createTask(request));
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<TaskResponse> updateStatus(@PathVariable String id,
                                                      @Valid @RequestBody TaskStatusRequest request) {
        return ResponseEntity.ok(taskService.updateStatus(id, request.getStatus()));
    }

    @DeleteMapping("/{id}")
//    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deleteTask(@PathVariable String id) {
        taskService.deleteTask(id);
        return ResponseEntity.noContent().build();
    }

    @PutMapping("/{id}")
    public ResponseEntity<TaskResponse> updateTask(
            @PathVariable String id,
            @Valid @RequestBody TaskUpdateRequest request) {

        return ResponseEntity.ok(taskService.updateTask(id, request));

    }

}
