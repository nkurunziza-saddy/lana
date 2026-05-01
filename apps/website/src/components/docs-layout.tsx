import { Link, Outlet } from "@tanstack/react-router";
import { Row, Cell } from "./grid";
import { MonoLabel } from "./typography";

const DOCS_NAV = [
  {
    group: "Getting Started",
    items: [
      { title: "Introduction", path: "/docs" },
      { title: "Installation", path: "/docs/installation" },
    ],
  },
  {
    group: "Reference",
    items: [
      { title: "Components", path: "/docs/components" },
      { title: "Plugins", path: "/docs/plugins" },
    ],
  },
  {
    group: "Advanced",
    items: [{ title: "Architecture", path: "/docs/architecture" }],
  },
];

export function DocsLayout() {
  return (
    <Row cols="1-3">
      <Cell className="py-16">
        <MonoLabel>Docs / Guide</MonoLabel>
        <nav className="sticky top-10 flex flex-col gap-8 mt-8">
          {DOCS_NAV.map((group) => (
            <div key={group.group}>
              <h5 className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground/60 mb-3 font-mono">
                {group.group}
              </h5>
              <div className="flex flex-col gap-3">
                {group.items.map((item) => (
                  <Link
                    key={item.path}
                    to={item.path}
                    activeProps={{ className: "text-foreground font-medium" }}
                    inactiveProps={{ className: "text-muted-foreground hover:text-foreground" }}
                    className="text-[12px] transition-colors"
                  >
                    {item.title}
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </nav>
      </Cell>
      <Cell noBorderRight className="py-16 px-6 md:px-12 max-w-4xl">
        <Outlet />
      </Cell>
    </Row>
  );
}
