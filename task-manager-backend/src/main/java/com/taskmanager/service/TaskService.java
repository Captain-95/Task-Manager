package com.taskmanager.service;

import com.taskmanager.dto.*;
import com.taskmanager.exception.TaskNotFoundException;
import com.taskmanager.model.Task;
import com.taskmanager.model.TaskStatus;
import com.taskmanager.repository.TaskStore;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.Comparator;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class TaskService {

    private final TaskStore taskStore;

    public List<TaskResponse> getAllTasks() {
        return taskStore.findAll().stream()
                .sorted(Comparator.comparing(Task::getCreatedDate).reversed())
                .map(TaskResponse::fromTask)
                .collect(Collectors.toList());
    }

    public TaskResponse createTask(TaskRequest request) {
        Task task = Task.builder()
                .name(request.getName())
                .description(request.getDescription())
                .status(TaskStatus.PENDING)
                .build();
        return TaskResponse.fromTask(taskStore.save(task));
    }

    public TaskResponse updateStatus(String id, TaskStatus status) {
        Task task = taskStore.findById(id)
                .orElseThrow(() -> new TaskNotFoundException(id));
        task.setStatus(status);
        return TaskResponse.fromTask(taskStore.save(task));
    }

    public void deleteTask(String id) {
        if (!taskStore.existsById(id)) {
            throw new TaskNotFoundException(id);
        }
        taskStore.deleteById(id);
    }

    public DashboardSummary getSummary() {

        List<Task> all = taskStore.findAll();

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

        Task task = taskStore.findById(id)
                .orElseThrow(() -> new RuntimeException("Task not found"));

        task.setName(request.getName());
        task.setDescription(request.getDescription());

        taskStore.save(task);

        return TaskResponse.fromTask(task);

    }

}
