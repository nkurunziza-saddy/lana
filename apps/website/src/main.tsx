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
import { DocsView } from "./pages/docs";

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  component: LandingView,
});

const docsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/docs",
  component: DocsView,
});

const routeTree = rootRoute.addChildren([indexRoute, docsRoute]);
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
