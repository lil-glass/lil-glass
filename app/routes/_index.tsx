import { useLoaderData } from "@remix-run/react";
import electron from "@/electron.server";

import {
  CalendarIcon,
  EnvelopeClosedIcon,
  FaceIcon,
  GearIcon,
  HomeIcon,
  PersonIcon,
  RocketIcon,
} from "@radix-ui/react-icons";

import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from "@/components/ui/command";
import { PanelGroup, Panel, PanelResizeHandle } from "react-resizable-panels";

export function loader() {
  return {
    userDataPath: electron.app.getPath("userData"),
  };
}

export default function Index() {
  const data = useLoaderData<typeof loader>();
  return (
    <main className="h-screen flex bg-white">
      <aside className="bg-cyan-300 w-10 py-3 flex justify-center app-drag-handle">
        <HomeIcon />
      </aside>
      <div className="flex-1">
        <PanelGroup direction="horizontal">
          <Panel>
            <webview
              src="https://github.com"
              className="w-full h-full shadow-inner"
            ></webview>
          </Panel>
          <PanelResizeHandle className="bg-cyan-300 w-1" />
          <Panel defaultSizePercentage={30} minSizePercentage={20}>
            <webview
              src="https://electronjs.org"
              className="w-full h-full"
            ></webview>
          </Panel>
        </PanelGroup>
      </div>
    </main>
  );
}

export function CommandMenu() {
  return (
    <Command className="rounded-lg border shadow-md" loop>
      <CommandInput placeholder="Type a command or search..." />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
        <CommandGroup heading="Suggestions">
          <CommandItem>
            <CalendarIcon className="mr-2 h-4 w-4" />
            <span>Calendar</span>
          </CommandItem>
          <CommandItem>
            <FaceIcon className="mr-2 h-4 w-4" />
            <span>Search Emoji</span>
          </CommandItem>
          <CommandItem>
            <RocketIcon className="mr-2 h-4 w-4" />
            <span>Launch</span>
          </CommandItem>
        </CommandGroup>
        <CommandSeparator />
        <CommandGroup heading="Settings">
          <CommandItem>
            <PersonIcon className="mr-2 h-4 w-4" />
            <span>Profile</span>
            <CommandShortcut>⌘P</CommandShortcut>
          </CommandItem>
          <CommandItem>
            <EnvelopeClosedIcon className="mr-2 h-4 w-4" />
            <span>Mail</span>
            <CommandShortcut>⌘B</CommandShortcut>
          </CommandItem>
          <CommandItem>
            <GearIcon className="mr-2 h-4 w-4" />
            <span>Settings</span>
            <CommandShortcut>⌘S</CommandShortcut>
          </CommandItem>
        </CommandGroup>
      </CommandList>
    </Command>
  );
}
