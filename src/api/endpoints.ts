import { api } from "./client";

export interface Affiliate {
  id: string;
  name: string;
  status: "active" | "at_risk" | "churned" | "high_growth";
  churn_risk_score: number;
  growth_potential_score: number;
  health_score: number;
  revenue_30d: number;
  ctr_trend_pct: number;
  days_since_contact: number;
  last_contact_at: string;
}

export interface Dashboard {
  total_affiliates: number;
  avg_health_score: number;
  avg_churn_risk: number;
  avg_growth_potential: number;
  high_risk_count: number;
  high_growth_count: number;
  score_history_entries: number;
}

export interface ChatMessage {
  role: "user" | "assistant";
  content: string;
  tools_used?: string[];
  timestamp: string;
}

export interface TaskResponse {
  status: string;
  task_id: string;
  message: string;
}

export interface TaskStatus {
  task_id: string;
  status: "pending" | "running" | "complete" | "failed";
  result: unknown;
  error: string | null;
}

export interface ShapFactor {
  feature: string;
  value: number;
  description?: string;
}

export interface ShapExplanation {
  affiliate_id: string;
  risk_factors: ShapFactor[];
  growth_factors: ShapFactor[];
}

export const getAffiliates    = ()          => api.get<Affiliate[]>("/affiliates");
export const getDashboard     = ()          => api.get<Dashboard>("/ml/dashboard");
export const getScores        = ()          => api.get<Affiliate[]>("/ml/scores");
export const getAffiliate     = (id: string) => api.get<Affiliate>(`/affiliates/${id}`);
export const getShapExplanation = (id: string) => api.get<ShapExplanation>(`/ml/explain/${id}`);

export const sendChatMessage  = (message: string, history: ChatMessage[]) =>
  api.post<{ message: string; tools_used?: string[] }>("/agent/chat", {
    message,
    conversation_history: history,
  });

export const runIngest        = ()          => api.post<TaskResponse>("/ingest/full");
export const runNLP           = ()          => api.post<TaskResponse>("/process/nlp");
export const runEmbeddings    = ()          => api.post<TaskResponse>("/process/embeddings");
export const trainModels      = ()          => api.post<TaskResponse>("/ml/train");
export const scoreAffiliates  = ()          => api.post<TaskResponse>("/ml/score");
export const getTaskStatus    = (taskId: string) => api.get<TaskStatus>(`/task/${taskId}`);
export const runMigrations    = ()          => api.post("/admin/migrate");