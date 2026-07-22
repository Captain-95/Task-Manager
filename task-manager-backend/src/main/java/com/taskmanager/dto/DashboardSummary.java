package com.taskmanager.dto;

import lombok.*;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DashboardSummary {

    private long totalTasks;
    private long pendingTasks;
    private long completedTasks;
    private long todayTasks;

    private List<ChartItemDTO> statusChart;
    private List<ChartItemDTO> weeklyChart;
    private List<TaskResponse> recentTasks;

}