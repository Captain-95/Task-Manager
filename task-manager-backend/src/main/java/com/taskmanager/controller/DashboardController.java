package com.taskmanager.controller;

import com.taskmanager.dto.DashboardSummary;
import com.taskmanager.service.TaskService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/dashboard")
@RequiredArgsConstructor
public class DashboardController {

    private final TaskService taskService;

    @GetMapping("/summary")
    public DashboardSummary getSummary() {
        return taskService.getSummary();
    }
}
