export interface DashboardCard {
  title: string;
  description: string;
  accent: string;
}

export interface DashboardSummary {
  title: string;
  subtitle: string;
  cards: DashboardCard[];
}
