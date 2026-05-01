import { Tag, Display, Lead, Divider } from "../../components/typography";

export function ComponentsPage() {
  return (
    <section id="components" className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <Tag>Reference</Tag>
      <Display>Components</Display>
      <Lead>Detailed breakdown of the core editor components and their properties.</Lead>
      <Divider className="mb-10" />

      <div className="space-y-16 mt-6">
        <div>
          <h4 className="font-mono text-[14px] mb-3 uppercase tracking-wider">&lt;Editor /&gt;</h4>
          <p className="text-muted-foreground text-sm mb-4">
            The high-level "plug-and-play" component.
          </p>
          <table className="w-full text-left text-sm border-collapse">
            <thead>
              <tr className="border-b border-grid">
                <th className="py-2 font-mono text-[11px] uppercase tracking-wider">Prop</th>
                <th className="py-2 font-mono text-[11px] uppercase tracking-wider">Type</th>
                <th className="py-2 font-mono text-[11px] uppercase tracking-wider">Description</th>
              </tr>
            </thead>
            <tbody className="text-muted-foreground">
              <tr className="border-b border-grid/50">
                <td className="py-3 font-mono text-foreground">initialValue</td>
                <td className="py-3">string</td>
                <td className="py-3">JSON string of editor state</td>
              </tr>
              <tr className="border-b border-grid/50">
                <td className="py-3 font-mono text-foreground">showToolbar</td>
                <td className="py-3">boolean</td>
                <td className="py-3">Show/hide the top toolbar</td>
              </tr>
              <tr className="border-b border-grid/50">
                <td className="py-3 font-mono text-foreground">placeholder</td>
                <td className="py-3">string</td>
                <td className="py-3">Text displayed when empty</td>
              </tr>
              <tr className="border-b border-grid/50">
                <td className="py-3 font-mono text-foreground">onSave</td>
                <td className="py-3">function</td>
                <td className="py-3">Callback for saving state</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div>
          <h4 className="font-mono text-[14px] mb-3 uppercase tracking-wider">
            &lt;EditorContent /&gt;
          </h4>
          <p className="text-muted-foreground text-sm mb-4">The main writing surface.</p>
          <ul className="text-sm text-muted-foreground list-disc pl-5 space-y-2">
            <li>
              <code className="text-foreground">minHeight</code>: Controls the minimum height of the
              canvas (e.g., <code>500px</code>).
            </li>
            <li>
              <code className="text-foreground">className</code>: Standard Tailwind classes for
              styling.
            </li>
          </ul>
        </div>

        <div>
          <h4 className="font-mono text-[14px] mb-3 uppercase tracking-wider">
            &lt;EditorPlugins /&gt;
          </h4>
          <p className="text-muted-foreground text-sm mb-4">The brains behind the features.</p>
          <div className="bg-muted/30 p-4 border border-grid rounded">
            <p className="text-xs">
              This component handles Slash Commands, Floating Toolbars, Drag & Drop, and all
              registered plugins.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
