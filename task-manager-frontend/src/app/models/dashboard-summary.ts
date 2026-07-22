import { ChartItem } from "./chart-item";
import { RecentTask } from "./recent-task";

export interface DashboardSummary {

  totalTasks: number;

  pendingTasks: number;

  completedTasks: number;

  todayTasks: number;

  statusChart: ChartItem[];

  weeklyChart: ChartItem[];

  recentTasks: RecentTask[];

}