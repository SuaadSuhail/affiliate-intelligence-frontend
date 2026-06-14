import { useEffect, useRef, useState } from "react";
import { Send } from "lucide-react";
import type { ChatMessage } from "../api/endpoints";
import { sendChatMessage } from "../api/endpoints";
import { LoadingSpinner } from "./ui/LoadingSpinner";

const SUGGESTIONS = [
  "Which affiliates need urgent attention?",
  "Give me a portfolio health summary",
  "Draft an email for the most at-risk affiliate",
  "What growth opportunities exist right now?",
];

function Dots() {
  return (
    <span className="flex gap-1 items-center">
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          className="h-1.5 w-1.5 bg-gray-400 rounded-full animate-bounce"
          style={{ animationDelay: `${i * 150}ms` }}
        />
      ))}
    </span>
  );
}

export function ChatInterface() {
  const [messages, setMessages]   = useState<ChatMessage[]>([]);
  const [input, setInput]         = useState("");
  const [thinking, setThinking]   = useState(false);
  const bottomRef                 = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, thinking]);

  async function send(text: string) {
    if (!text.trim() || thinking) return;
    const userMsg: ChatMessage = {
      role: "user",
      content: text.trim(),
      timestamp: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setThinking(true);

    try {
      const history = [...messages, userMsg];
      const { data } = await sendChatMessage(text.trim(), history);
      const assistantMsg: ChatMessage = {
        role: "assistant",
        content: data.message,
        tools_used: data.tools_used,
        timestamp: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, assistantMsg]);
    } catch {
      const errMsg: ChatMessage = {
        role: "assistant",
        content: "Sorry, I couldn't reach the agent. Please check that the backend is running.",
        timestamp: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, errMsg]);
    } finally {
      setThinking(false);
    }
  }

  function onKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      send(input);
    }
  }

  return (
    <div className="flex flex-col h-full">
      {/* Suggested chips */}
      {messages.length === 0 && (
        <div className="px-4 pt-4 pb-2">
          <p className="text-xs text-gray-400 mb-2 font-medium">Suggested questions</p>
          <div className="flex flex-wrap gap-2">
            {SUGGESTIONS.map((s) => (
              <button
                key={s}
                onClick={() => send(s)}
                className="text-xs bg-white border border-gray-200 text-gray-600 rounded-full px-3 py-1.5 hover:bg-primary-50 hover:border-primary-300 hover:text-primary-700 transition-colors shadow-sm"
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Message thread */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
        {messages.map((m, i) => (
          <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
            {m.role === "user" ? (
              <div className="max-w-[78%] bg-primary-500 text-white rounded-2xl rounded-tr-sm px-4 py-2.5">
                <p className="text-sm leading-relaxed whitespace-pre-wrap">{m.content}</p>
              </div>
            ) : (
              <div className="max-w-[82%]">
                <div className="bg-white border border-gray-200 rounded-2xl rounded-tl-sm px-4 py-3 shadow-sm">
                  <p className="text-sm leading-relaxed text-gray-800 whitespace-pre-wrap">{m.content}</p>
                </div>
                {m.tools_used && m.tools_used.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-1.5 ml-1">
                    {m.tools_used.map((t) => (
                      <span key={t} className="text-xs bg-gray-100 text-gray-500 rounded px-1.5 py-0.5">
                        {t}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        ))}

        {thinking && (
          <div className="flex justify-start">
            <div className="bg-white border border-gray-200 rounded-2xl rounded-tl-sm px-4 py-3 shadow-sm">
              <Dots />
            </div>
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* Input bar */}
      <div className="border-t border-gray-200 bg-white px-4 py-3">
        <div className="flex items-end gap-2">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={onKeyDown}
            placeholder="Ask about your affiliates…"
            rows={1}
            className="flex-1 resize-none rounded-xl border border-gray-200 px-3 py-2 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            style={{ maxHeight: "120px", overflowY: "auto" }}
          />
          <button
            onClick={() => send(input)}
            disabled={!input.trim() || thinking}
            className="flex-shrink-0 h-9 w-9 flex items-center justify-center rounded-xl bg-primary-500 text-white hover:bg-primary-600 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            {thinking ? <LoadingSpinner size="sm" className="border-white border-t-white/40" /> : <Send className="h-4 w-4" />}
          </button>
        </div>
        <p className="text-xs text-gray-400 mt-1.5">Enter to send · Shift+Enter for new line</p>
      </div>
    </div>
  );
}