import type { LinksFunction, MetaFunction } from "@remix-run/node";
import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "@remix-run/react";
import styles from "./tailwind.css";
import { useEffect } from "react";

export const meta: MetaFunction = () => [{ title: "New Remix App" }];

export const links: LinksFunction = () => [{ rel: "stylesheet", href: styles }];

export default function App() {
  let theme = "";

  return (
    <html lang="en" className={`h-screen bg-transparent ${theme}`}>
      <head>
        <meta charSet="utf8" />
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body className="h-screen bg-transparent">
        <Outlet />
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  );
}
