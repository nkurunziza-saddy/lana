import { Tag, Display, Lead, Divider } from "../../components/typography";

export function IntroductionPage() {
  return (
    <section id="introduction" className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <Tag>Introduction</Tag>
      <Display>Andi Editor</Display>
      <Lead>
        A calm, precise writing UI built on top of Lexical. Smaller radii, whisper borders, and
        perfect theme coherence.
      </Lead>
      <Divider className="mb-8" />

      <div className="max-w-2xl space-y-12">
        <div className="space-y-4">
          <p className="text-[15px] leading-[1.6] text-foreground font-normal">
            Andi is not just a rich-text editor; it's a design system for writing. It combines the
            power of <span className="font-medium">Lexical</span> with the elegance of{" "}
            <span className="font-medium">Andi Design</span>.
          </p>
          <p className="text-[14px] leading-[1.6] text-muted-foreground">
            It supports two primary modes of operation:
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-2">
            <h4 className="text-[11px] uppercase tracking-wider font-mono text-foreground">
              01 / Registry-first
            </h4>
            <p className="text-[13px] leading-[1.6] text-muted-foreground">
              Install the source code directly into your project to own every pixel and customize
              the internal logic.
            </p>
          </div>
          <div className="space-y-2">
            <h4 className="text-[11px] uppercase tracking-wider font-mono text-foreground">
              02 / Package-first
            </h4>
            <p className="text-[13px] leading-[1.6] text-muted-foreground">
              Use the <code>andi-editor</code> package for a plug-and-play experience with zero
              configuration.
            </p>
          </div>
        </div>

        <div className="space-y-8 border-t border-grid pt-12">
          <h3 className="text-xl font-normal font-display">Core Principles</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="space-y-2">
              <h5 className="text-[12px] font-medium text-foreground">Performance</h5>
              <p className="text-[13px] leading-[1.6] text-muted-foreground">
                Built for speed. Heavy features are lazy-loaded to keep the initial bundle light.
              </p>
            </div>
            <div className="space-y-2">
              <h5 className="text-[12px] font-medium text-foreground">Precision</h5>
              <p className="text-[13px] leading-[1.6] text-muted-foreground">
                Fine-tuned typography and "whisper borders" for a calm, professional writing
                surface.
              </p>
            </div>
            <div className="space-y-2">
              <h5 className="text-[12px] font-medium text-foreground">Modularity</h5>
              <p className="text-[13px] leading-[1.6] text-muted-foreground">
                A plug-and-play component or a fully customizable registry source. Your choice.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
