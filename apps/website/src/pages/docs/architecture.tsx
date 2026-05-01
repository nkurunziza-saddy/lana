import { Tag, Display, Lead, Divider } from "../../components/typography";

export function ArchitecturePage() {
  return (
    <section id="architecture" className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <Tag>Advanced</Tag>
      <Display>Architecture</Display>
      <Lead>Understanding the compound component pattern and editor lifecycle.</Lead>
      <Divider className="mb-8" />

      <div className="max-w-2xl space-y-16">
        <div className="space-y-4">
          <p className="text-[15px] leading-[1.6] text-foreground font-normal">
            Andi uses a <span className="font-medium">Compound Component</span> pattern. This allows
            you to compose the editor layout in your JSX, rather than passing a massive object of
            props.
          </p>
        </div>

        <div className="space-y-4">
          <h4 className="text-[11px] uppercase tracking-wider font-mono text-foreground">
            01 / The Pattern
          </h4>
          <pre className="p-4 bg-muted/30 border border-grid text-[12px] font-mono text-muted-foreground overflow-x-auto rounded leading-[1.6]">
            {`<Editor>
  <EditorToolbar>
    <EditorToolbar.TextFormat />
    <EditorToolbar.Insert />
  </EditorToolbar>
  
  <EditorContent />
  
  <EditorPlugins />
</Editor>`}
          </pre>
        </div>

        <div className="space-y-6">
          <h4 className="text-[11px] uppercase tracking-wider font-mono text-foreground">
            02 / Why this works
          </h4>
          <div className="grid grid-cols-1 gap-6">
            {[
              {
                title: "Selective Feature Sets",
                desc: "Don't need the toolbar? Just don't render it. You have total control over the UI components.",
              },
              {
                title: "Custom Layouts",
                desc: "Place the toolbar at the bottom for mobile, or in a persistent sidebar. The editor logic remains decoupled from the layout.",
              },
              {
                title: "Tree Shaking",
                desc: "If you don't import EditorToolbar, its code won't be included in your final production bundle.",
              },
            ].map((item) => (
              <div key={item.title} className="space-y-1">
                <h5 className="text-[14px] font-medium text-foreground">{item.title}</h5>
                <p className="text-[13px] leading-[1.6] text-muted-foreground">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-4 border-t border-grid pt-12">
          <p
            className="text-[22px] italic leading-[1.4] text-foreground"
            style={{ fontFamily: "var(--ff-display)" }}
          >
            "Flexibility shouldn't come at the cost of complexity. Composition is the answer."
          </p>
        </div>
      </div>
    </section>
  );
}
