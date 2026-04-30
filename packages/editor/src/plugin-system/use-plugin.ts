import { useState, useEffect } from "react";
import type { PluginRegistry } from "./registry";

export function usePlugin(registry: PluginRegistry, pluginId: string) {
  const [ready, setReady] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let mounted = true;

    async function loadPlugin() {
      try {
        await registry.activate(pluginId);
        if (mounted) {
          setReady(true);
        }
      } catch (err) {
        if (mounted) {
          setError(err instanceof Error ? err : new Error(String(err)));
        }
      }
    }

    void loadPlugin();

    return () => {
      mounted = false;
    };
  }, [registry, pluginId]);

  return { ready, error };
}
