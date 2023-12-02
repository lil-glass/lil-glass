import { useLoaderData } from "@remix-run/react";
import electron from "@/electron.server";
import { PanelGroup, Panel, PanelResizeHandle } from "react-resizable-panels";
import { CommandMenu } from "@/components/command-menu";
import { HomeIcon } from "@radix-ui/react-icons";
import { useCallback, useEffect, useRef, useState } from "react";
// import { ipcRenderer } from "electron";

export function loader() {
  return {
    userDataPath: electron.app.getPath("userData"),
  };
}

export default function Index() {
  const data = useLoaderData<typeof loader>();
  const [open, setOpen] = useState(false);
  const [url, setUrl] = useState("https://lil.media");
  const webviewRef = useRef<null | HTMLWebViewElement>(null);

  const down = (e: KeyboardEvent) => {
    if (e.key === "l" && (e.metaKey || e.ctrlKey)) {
      e.preventDefault();
      setOpen((open) => !open);
    }
  };

  useEffect(() => {
    // ipcRenderer.on("open-menu", () => {
    //   setOpen((open) => !open);
    // });
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);
  const remoteOpen = useCallback(
    (event) => {
      console.log({ event });
      console.log(open);
      setOpen((open) => !open);
    },
    [setOpen]
  );
  useEffect(() => {
    if (window.electron) {
      window.electron.test(remoteOpen);
    }
  }, [setOpen]);

  useEffect(() => {
    if (webviewRef.current) {
      console.dir(webviewRef.current);
    }
  }, [webviewRef]);

  return (
    <main className="h-screen flex">
      {/* <aside className="bg-cyan-300 w-10 py-3 flex justify-centder app-drag-handle">
        <HomeIcon />
      </aside> */}
      <div className="flex-1">
        <PanelGroup direction="horizontal">
          <Panel className="relative">
            <div
              tabIndex={0}
              className="absolute bottom-4 left-4 right-4 z-10 rounded-md app-drag-handle"
            >
              <CommandMenu open={open} setOpen={setOpen} changeUrl={setUrl} />
            </div>
            <webview
              autoFocus
              ref={webviewRef}
              src={url}
              className="w-full h-full shadow-inner"
              useragent="Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36"
            ></webview>
          </Panel>
          {/* <PanelResizeHandle className="bg-cyan-300 w-1" />
          <Panel>
            <webview
              src="https://electronjs.org"
              className="w-full h-full"
            ></webview>
          </Panel> */}
        </PanelGroup>
      </div>
    </main>
  );
}
