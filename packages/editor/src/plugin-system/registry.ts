import type { Klass, LexicalNode } from "lexical";
import type { EditorPlugin, ToolbarContribution } from "./types";

export class PluginRegistry {
  private plugins = new Map<string, EditorPlugin>();
  private loaded = new Set<string>();

  register(plugin: EditorPlugin): void {
    if (this.plugins.has(plugin.id)) {
      console.warn(`Plugin with id ${plugin.id} is already registered.`);
      return;
    }
    this.plugins.set(plugin.id, plugin);
  }

  async activate(id: string): Promise<void> {
    if (this.loaded.has(id)) {
      return;
    }

    const plugin = this.plugins.get(id);
    if (!plugin) {
      throw new Error(`Plugin with id ${id} not found.`);
    }

    if (plugin.load) {
      await plugin.load();
    }

    this.loaded.add(id);
  }

  getNodes(): Klass<LexicalNode>[] {
    const nodes: Klass<LexicalNode>[] = [];
    for (const plugin of this.plugins.values()) {
      if (plugin.nodes) {
        nodes.push(...plugin.nodes);
      }
    }
    return nodes;
  }

  getToolbarItems(): ToolbarContribution[] {
    const items: ToolbarContribution[] = [];
    for (const plugin of this.plugins.values()) {
      if (plugin.toolbarItems) {
        items.push(...plugin.toolbarItems);
      }
    }
    return items;
  }

  getPlugins(): EditorPlugin[] {
    return Array.from(this.plugins.values());
  }

  destroy(): void {
    for (const id of this.loaded) {
      const plugin = this.plugins.get(id);
      if (plugin?.destroy) {
        plugin.destroy();
      }
    }
    this.plugins.clear();
    this.loaded.clear();
  }
}
