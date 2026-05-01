import { Tag, Display, Lead, Divider } from "../../components/typography";

export function PluginsPage() {
  return (
    <section id="plugins" className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <Tag>Reference</Tag>
      <Display>Plugins</Display>
      <Lead>Extending the editor with powerful, lazy-loaded capabilities.</Lead>
      <Divider className="mb-10" />

      <div className="space-y-16 mt-6">
        <div>
          <h4 className="font-mono text-[13px] mb-2 uppercase">Performance First</h4>
          <p className="text-muted-foreground text-sm">
            Andi separates its core bundle from its heavy features. Large plugins like KaTeX and
            Excalidraw are only loaded when needed.
          </p>
        </div>

        <div>
          <h4 className="font-mono text-[13px] mb-3 uppercase">Core Plugins</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              { name: "Slash Commands", desc: "Trigger actions with /" },
              { name: "Floating Toolbar", desc: "Contextual formatting" },
              { name: "Equations", desc: "Katex mathematical notation" },
              { name: "Whiteboard", desc: "Excalidraw drawings" },
              { name: "Draggable Blocks", desc: "Reorder blocks easily" },
              { name: "Speech to Text", desc: "Voice dictation support" },
            ].map((p) => (
              <div key={p.name} className="p-4 border border-grid bg-card">
                <h5 className="font-medium text-sm mb-1">{p.name}</h5>
                <p className="text-xs text-muted-foreground">{p.desc}</p>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h4 className="font-mono text-[13px] mb-3 uppercase">Custom Plugins</h4>
          <p className="text-muted-foreground text-sm mb-4">
            Implement the <code>EditorPlugin</code> interface to add your own features.
          </p>
          <pre className="p-4 bg-muted/30 border border-grid text-[11px] font-mono text-muted-foreground overflow-x-auto rounded">
            {`export interface EditorPlugin {
  id: string;
  name: string;
  nodes?: LexicalNode[]; 
  load?: () => Promise<void>; 
  component?: React.ComponentType; 
}`}
          </pre>
        </div>
      </div>
    </section>
  );
}
