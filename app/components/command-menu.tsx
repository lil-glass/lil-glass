"use client";

import * as React from "react";
import {
  CalendarIcon,
  EnvelopeClosedIcon,
  FaceIcon,
  GearIcon,
  PersonIcon,
  RocketIcon,
} from "@radix-ui/react-icons";

import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from "@/components/ui/command";

export function CommandMenu({
  open,
  setOpen,
  changeUrl,
}: {
  open: boolean;
  setOpen: (open: boolean) => void;
  changeUrl: (url: string) => void;
}) {
  const formRef = React.useRef<HTMLFormElement>(null);
  const inputRef = React.useRef<HTMLInputElement>(null);
  function changeOpen(open: boolean) {
    const formData = new FormData(formRef.current);
    console.log(
      formData.get("command"),
      formRef.current.command,
      formRef.current
    );
    if (!open && typeof formData.get("command") === "string") {
      const command = formData.get("command") as string;
      if (command.startsWith("http")) {
        changeUrl(command);
      }
    }
    setOpen(open);
  }

  React.useEffect(() => {
    function monitorEnterKeypress(e: KeyboardEvent) {
      console.log(e, e.key);
      if (e.key === "Enter") {
        changeOpen(false);
      }
    }
    if (inputRef.current) {
      inputRef.current.addEventListener("keydown", monitorEnterKeypress);
    }
    return () => {
      if (inputRef.current) {
        inputRef.current.removeEventListener("keydown", monitorEnterKeypress);
      }
    };
  }, [inputRef]);

  return (
    <form id="menu" ref={formRef} onSubmit={() => changeOpen(false)}>
      <CommandDialog open={open} onOpenChange={changeOpen}>
        <CommandInput
          ref={inputRef}
          form="menu"
          name="command"
          placeholder="Type a command or search..."
        />
        <input type="text" name="foo" />
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
      </CommandDialog>
      <button type="submit" className="hidden"></button>
    </form>
  );
}
