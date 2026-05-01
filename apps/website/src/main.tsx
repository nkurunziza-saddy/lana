import React from "react";
import ReactDOM from "react-dom/client";
import "@fontsource/instrument-serif/index.css";
import "@fontsource/geist-mono/300.css";
import "@fontsource/geist-mono/400.css";
import "@fontsource/geist-mono/500.css";

import "./style.css";

import { ThemeProvider } from "next-themes";
import { Layout } from "./components/layout";
import {
  Outlet,
  RouterProvider,
  createRootRoute,
  createRoute,
  createRouter,
} from "@tanstack/react-router";

const rootRoute = createRootRoute({
  component: () => (
    <Layout>
      <Outlet />
    </Layout>
  ),
});

import { LandingView } from "./pages/landing";
import { DocsLayout } from "./components/docs-layout";
import { IntroductionPage } from "./pages/docs/introduction";
import { InstallationPage } from "./pages/docs/installation";
import { ComponentsPage } from "./pages/docs/components";
import { PluginsPage } from "./pages/docs/plugins";
import { ArchitecturePage } from "./pages/docs/architecture";

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  component: LandingView,
});

const docsLayoutRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/docs",
  component: DocsLayout,
});

const docsIndexRoute = createRoute({
  getParentRoute: () => docsLayoutRoute,
  path: "/",
  component: IntroductionPage,
});

const docsInstallationRoute = createRoute({
  getParentRoute: () => docsLayoutRoute,
  path: "/installation",
  component: InstallationPage,
});

const docsComponentsRoute = createRoute({
  getParentRoute: () => docsLayoutRoute,
  path: "/components",
  component: ComponentsPage,
});

const docsPluginsRoute = createRoute({
  getParentRoute: () => docsLayoutRoute,
  path: "/plugins",
  component: PluginsPage,
});

const docsArchitectureRoute = createRoute({
  getParentRoute: () => docsLayoutRoute,
  path: "/architecture",
  component: ArchitecturePage,
});

const routeTree = rootRoute.addChildren([
  indexRoute,
  docsLayoutRoute.addChildren([
    docsIndexRoute,
    docsInstallationRoute,
    docsComponentsRoute,
    docsPluginsRoute,
    docsArchitectureRoute,
  ]),
]);
const router = createRouter({ routeTree });

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ThemeProvider defaultTheme="light" attribute="class" enableSystem disableTransitionOnChange>
      <RouterProvider router={router} />
    </ThemeProvider>
  </React.StrictMode>,
);
