import { useActor } from "@caffeineai/core-infrastructure";
import {
  QueryClient,
  QueryClientProvider,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { useState } from "react";
import { createActor } from "./backend";

interface Todo {
  id: bigint;
  text: string;
  completed: boolean;
}

const queryClient = new QueryClient();

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TodoApp />
    </QueryClientProvider>
  );
}

function TodoApp() {
  const { actor, isFetching } = useActor(createActor);
  const qc = useQueryClient();
  const [input, setInput] = useState("");

  const { data: todos = [], isLoading: loading } = useQuery<Todo[]>({
    queryKey: ["todos"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getTodos();
    },
    enabled: !!actor && !isFetching,
  });

  const addMutation = useMutation({
    mutationFn: async (text: string) => {
      if (!actor) throw new Error("no actor");
      await actor.addTodo(text);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["todos"] }),
  });

  const toggleMutation = useMutation({
    mutationFn: async (id: bigint) => {
      if (!actor) throw new Error("no actor");
      await actor.toggleTodo(id);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["todos"] }),
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: bigint) => {
      if (!actor) throw new Error("no actor");
      await actor.deleteTodo(id);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["todos"] }),
  });

  function addTodo() {
    const text = input.trim();
    if (!text) return;
    setInput("");
    addMutation.mutate(text);
  }

  return (
    <div
      className="min-h-screen bg-background text-foreground"
      data-component="todo-app"
    >
      <header className="bg-card border-b border-border px-6 py-4">
        <h1 className="text-xl font-semibold">Todo</h1>
      </header>
      <main className="max-w-lg mx-auto px-4 py-8">
        <div className="flex gap-2 mb-6">
          <input
            data-ocid="todo.input"
            className="flex-1 border border-input bg-background rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            placeholder="Add a task…"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && addTodo()}
          />
          <button
            type="button"
            data-ocid="todo.add_button"
            className="bg-primary text-primary-foreground rounded-md px-4 py-2 text-sm font-medium hover:opacity-90 transition-opacity"
            onClick={addTodo}
          >
            Add
          </button>
        </div>
        {loading ? (
          <p
            data-ocid="todo.loading_state"
            className="text-muted-foreground text-sm text-center py-12"
          >
            Loading…
          </p>
        ) : todos.length === 0 ? (
          <p
            data-ocid="todo.empty_state"
            className="text-muted-foreground text-sm text-center py-12"
          >
            No tasks yet. Add one above.
          </p>
        ) : (
          <ul className="space-y-2">
            {todos.map((todo, i) => (
              <li
                key={String(todo.id)}
                data-ocid={`todo.item.${i + 1}`}
                className="flex items-center gap-3 bg-card border border-border rounded-md px-4 py-3"
              >
                <input
                  type="checkbox"
                  data-ocid={`todo.checkbox.${i + 1}`}
                  checked={todo.completed}
                  onChange={() => toggleMutation.mutate(todo.id)}
                  className="h-4 w-4 accent-primary cursor-pointer"
                />
                <span
                  className={`flex-1 text-sm min-w-0 break-words ${
                    todo.completed ? "line-through text-muted-foreground" : ""
                  }`}
                >
                  {todo.text}
                </span>
                <button
                  type="button"
                  data-ocid={`todo.delete_button.${i + 1}`}
                  className="text-muted-foreground hover:text-destructive transition-colors text-xs"
                  onClick={() => deleteMutation.mutate(todo.id)}
                  aria-label="Delete task"
                >
                  ✕
                </button>
              </li>
            ))}
          </ul>
        )}
      </main>
      <footer className="fixed bottom-0 w-full bg-muted/40 border-t border-border py-3 text-center text-xs text-muted-foreground">
        © {new Date().getFullYear()}. Built with love using{" "}
        <a
          href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
          className="underline hover:text-foreground transition-colors"
          target="_blank"
          rel="noopener noreferrer"
        >
          caffeine.ai
        </a>
      </footer>
    </div>
  );
}
