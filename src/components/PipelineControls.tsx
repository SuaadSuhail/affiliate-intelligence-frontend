import { useState, useCallback } from "react";
import {
  Download, Tag, Layers, Brain, BarChart2, Database, CheckCircle, XCircle,
} from "lucide-react";
import type { TaskResponse } from "../api/endpoints";
import {
  runIngest, runNLP, runEmbeddings, trainModels,
  scoreAffiliates, runMigrations, getTaskStatus,
} from "../api/endpoints";
import { LoadingSpinner } from "./ui/LoadingSpinner";

interface Toast {
  id: number;
  message: string;
  type: "success" | "error";
}

interface PipelineOp {
  key: string;
  label: string;
  description: string;
  icon: React.ReactNode;
  action: () => Promise<{ data: TaskResponse } | { data: unknown }>;
  hasTask: boolean;
}

const OPS: PipelineOp[] = [
  {
    key: "ingest",
    label: "Ingest Data",
    description: "Pull latest affiliate data from all sources",
    icon: <Download className="h-4 w-4" />,
    action: runIngest,
    hasTask: true,
  },
  {
    key: "nlp",
    label: "Process NLP",
    description: "Tag communications with sentiment and topics",
    icon: <Tag className="h-4 w-4" />,
    action: runNLP,
    hasTask: true,
  },
  {
    key: "embeddings",
    label: "Generate Embeddings",
    description: "Create vector embeddings for semantic search",
    icon: <Layers className="h-4 w-4" />,
    action: runEmbeddings,
    hasTask: true,
  },
  {
    key: "train",
    label: "Train Models",
    description: "Retrain churn and growth prediction models",
    icon: <Brain className="h-4 w-4" />,
    action: trainModels,
    hasTask: true,
  },
  {
    key: "score",
    label: "Score Affiliates",
    description: "Recalculate health scores for all affiliates",
    icon: <BarChart2 className="h-4 w-4" />,
    action: scoreAffiliates,
    hasTask: true,
  },
  {
    key: "migrate",
    label: "Run Migrations",
    description: "Apply pending database schema migrations",
    icon: <Database className="h-4 w-4" />,
    action: runMigrations,
    hasTask: false,
  },
];

async function pollUntilDone(taskId: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const interval = setInterval(async () => {
      try {
        const { data } = await getTaskStatus(taskId);
        if (data.status === "complete") {
          clearInterval(interval);
          resolve();
        } else if (data.status === "failed") {
          clearInterval(interval);
          reject(new Error(data.error ?? "Task failed"));
        }
      } catch (e) {
        clearInterval(interval);
        reject(e);
      }
    }, 2000);
  });
}

export function PipelineControls() {
  const [running, setRunning] = useState<Record<string, boolean>>({});
  const [toasts, setToasts]   = useState<Toast[]>([]);

  const addToast = useCallback((message: string, type: "success" | "error") => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), 4000);
  }, []);

  async function run(op: PipelineOp) {
    if (running[op.key]) return;
    setRunning((prev) => ({ ...prev, [op.key]: true }));
    try {
      const res = await op.action();
      if (op.hasTask) {
        const taskRes = res as { data: TaskResponse };
        if (taskRes.data?.task_id) {
          await pollUntilDone(taskRes.data.task_id);
        }
      }
      addToast(`${op.label} completed successfully`, "success");
    } catch (e) {
      const msg = e instanceof Error ? e.message : "An error occurred";
      addToast(`${op.label} failed: ${msg}`, "error");
    } finally {
      setRunning((prev) => ({ ...prev, [op.key]: false }));
    }
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <h2 className="text-lg font-semibold text-gray-900">Pipeline Controls</h2>
        <p className="text-sm text-gray-500 mt-1">
          Run data pipeline operations. Background tasks are polled automatically.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {OPS.map((op) => {
          const isRunning = running[op.key];
          return (
            <button
              key={op.key}
              onClick={() => run(op)}
              disabled={isRunning}
              className="flex items-start gap-3 p-4 bg-white rounded-xl border border-gray-200 shadow-sm text-left hover:border-primary-300 hover:bg-primary-50 disabled:opacity-60 disabled:cursor-not-allowed transition-all"
            >
              <div className={`mt-0.5 flex-shrink-0 p-2 rounded-lg ${isRunning ? "bg-primary-100 text-primary-600" : "bg-gray-100 text-gray-600"}`}>
                {isRunning ? <LoadingSpinner size="sm" /> : op.icon}
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-900">{op.label}</p>
                <p className="text-xs text-gray-500 mt-0.5 leading-relaxed">{op.description}</p>
                {isRunning && (
                  <p className="text-xs text-primary-600 mt-1 font-medium">Running…</p>
                )}
              </div>
            </button>
          );
        })}
      </div>

      {/* Toasts */}
      <div className="fixed bottom-4 right-4 space-y-2 z-50">
        {toasts.map((t) => (
          <div
            key={t.id}
            className={`flex items-center gap-2 px-4 py-3 rounded-xl shadow-lg text-sm font-medium transition-all ${
              t.type === "success"
                ? "bg-green-50 border border-green-200 text-green-800"
                : "bg-red-50 border border-red-200 text-red-800"
            }`}
          >
            {t.type === "success"
              ? <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
              : <XCircle    className="h-4 w-4 text-red-500 flex-shrink-0" />}
            {t.message}
          </div>
        ))}
      </div>
    </div>
  );
}