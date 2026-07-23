package com.taskmanager.service;

import com.taskmanager.dto.*;
import com.taskmanager.entity.User;
import com.taskmanager.exception.TaskNotFoundException;
import com.taskmanager.exception.UnauthorizedTaskAccessException;
import com.taskmanager.model.Task;
import com.taskmanager.model.TaskStatus;
import com.taskmanager.repository.TaskStore;
import com.taskmanager.repository.UserRepository;
import com.taskmanager.security.SecurityUtils;
import com.taskmanager.security.UserPrincipal;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.Comparator;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class TaskService {

    private final TaskStore taskStore;
    private final UserRepository userRepository;

    public List<TaskResponse> getAllTasks() {

        UserPrincipal currentUser = getCurrentUser();
        List<Task> tasks;

        if (isAdmin(currentUser)) {
            tasks = taskStore.findAll();

        } else {
            tasks = taskStore.findAll()
                    .stream()
                    .filter(task -> task.getAssignedUserId().equals(currentUser.getId()))
                    .collect(Collectors.toList());
        }

        return tasks.stream()
                .sorted(Comparator.comparing(Task::getCreatedDate).reversed())
                .map(TaskResponse::fromTask)
                .collect(Collectors.toList());

    }

    public TaskResponse createTask(TaskRequest request) {

        UserPrincipal currentUser = getCurrentUser();

        Long assignedUserId;

        if (isAdmin(currentUser)) {

            assignedUserId = request.getAssignedUserId();

        } else {

            // User cannot assign task to anyone else
            assignedUserId = currentUser.getId();

        }

        User assignedUser = userRepository.findById(assignedUserId)
                .orElseThrow(() -> new RuntimeException("Assigned user not found."));

        Task task = Task.builder()
                .name(request.getName())
                .description(request.getDescription())
                .status(TaskStatus.PENDING)
                .assignedUserId(assignedUser.getId())
                .assignedUsername(assignedUser.getUsername())
                .createdByUserId(currentUser.getId())
                .createdByUsername(currentUser.getUsername())
                .build();

        return TaskResponse.fromTask(taskStore.save(task));

    }

    public List<TaskResponse> searchTasks(TaskFilterRequest filter) {

        UserPrincipal currentUser = getCurrentUser();

        List<Task> tasks;

        if (isAdmin(currentUser)) {

            tasks = taskStore.findAll();

        } else {

            tasks = taskStore.findAll()
                    .stream()
                    .filter(task -> task.getAssignedUserId().equals(currentUser.getId()))
                    .collect(Collectors.toList());

        }

        // Search by task name
        if (filter.getSearch() != null && !filter.getSearch().isBlank()) {

            String keyword = filter.getSearch().toLowerCase();
            tasks = tasks.stream().filter(task -> task.getName().toLowerCase().contains(keyword))
                    .collect(Collectors.toList());

        }

        // Assigned To
        if (filter.getAssignedUserId() != null) {

            tasks = tasks.stream()
                    .filter(task -> task.getAssignedUserId().equals(filter.getAssignedUserId()))
                    .collect(Collectors.toList());

        }

        // Created By
        if (filter.getCreatedByUserId() != null) {

            tasks = tasks.stream()
                    .filter(task -> task.getCreatedByUserId().equals(filter.getCreatedByUserId()))
                    .collect(Collectors.toList());

        }

        // Status
        if (filter.getStatus() != null && !filter.getStatus().isBlank()) {

            TaskStatus status = TaskStatus.valueOf(filter.getStatus());
            tasks = tasks.stream().filter(task -> task.getStatus() == status)
                    .collect(Collectors.toList());

        }

        return tasks.stream()
                .sorted(Comparator.comparing(Task::getCreatedDate).reversed())
                .map(TaskResponse::fromTask)
                .collect(Collectors.toList());

    }

    public TaskResponse updateStatus(String id, TaskStatus status) {

        Task task = getTaskOrThrow(id);
        validateOwnership(task);
        task.setStatus(status);
        taskStore.save(task);

        return TaskResponse.fromTask(task);

    }

    public void deleteTask(String id) {

        Task task = getTaskOrThrow(id);
        validateOwnership(task);
        taskStore.deleteById(id);

    }

    public DashboardSummary getSummary() {

        UserPrincipal currentUser = getCurrentUser();

        List<Task> all;

        if (isAdmin(currentUser)) {
            all = taskStore.findAll();
        } else {
            all = taskStore.findAll().stream().filter(task -> task.getAssignedUserId().equals(currentUser.getId()))
                    .collect(Collectors.toList());
        }

        long total = all.size();

        long completed = all.stream()
                .filter(task -> task.getStatus() == TaskStatus.COMPLETED)
                .count();

        long pending = total - completed;

        long today = all.stream()
                .filter(task -> task.getCreatedDate().toLocalDate()
                        .equals(java.time.LocalDate.now()))
                .count();

        List<ChartItemDTO> statusChart = List.of(

                ChartItemDTO.builder()
                        .label("Pending")
                        .value(pending)
                        .build(),

                ChartItemDTO.builder()
                        .label("Completed")
                        .value(completed)
                        .build()

        );

        List<ChartItemDTO> weeklyChart = java.util.stream.Stream.of(
                        java.time.DayOfWeek.MONDAY,
                        java.time.DayOfWeek.TUESDAY,
                        java.time.DayOfWeek.WEDNESDAY,
                        java.time.DayOfWeek.THURSDAY,
                        java.time.DayOfWeek.FRIDAY,
                        java.time.DayOfWeek.SATURDAY,
                        java.time.DayOfWeek.SUNDAY
                )
                .map(day -> ChartItemDTO.builder()
                        .label(day.name().substring(0,3))
                        .value(

                                all.stream()

                                        .filter(task -> task.getCreatedDate()
                                                .getDayOfWeek() == day)

                                        .count()

                        )
                        .build())
                .collect(Collectors.toList());

        List<TaskResponse> recentTasks = all.stream()

                .sorted(Comparator.comparing(Task::getCreatedDate).reversed())

                .limit(5)

                .map(TaskResponse::fromTask)

                .collect(Collectors.toList());

        return DashboardSummary.builder()

                .totalTasks(total)
                .pendingTasks(pending)
                .completedTasks(completed)
                .todayTasks(today)
                .statusChart(statusChart)
                .weeklyChart(weeklyChart)
                .recentTasks(recentTasks)
                .build();

    }


    public TaskResponse updateTask(String id, TaskUpdateRequest request) {

        Task task = getTaskOrThrow(id);
        validateOwnership(task);
        task.setName(request.getName());
        task.setDescription(request.getDescription());
        taskStore.save(task);

        return TaskResponse.fromTask(task);

    }


    private UserPrincipal getCurrentUser() {

        return SecurityUtils.getCurrentUser();

    }

    private boolean isAdmin(UserPrincipal user) {

        return user.getAuthorities().stream()
                .anyMatch(role -> role.getAuthority().equals("ROLE_ADMIN"));

    }

    private Task getTaskOrThrow(String id) {
        return taskStore.findById(id).orElseThrow(() -> new TaskNotFoundException(id));

    }

    private void validateOwnership(Task task) {

        UserPrincipal currentUser = getCurrentUser();

        if (isAdmin(currentUser)) {
            return;
        }

        if (!currentUser.getId().equals(task.getAssignedUserId())) {
            throw new UnauthorizedTaskAccessException();
        }

    }

}
