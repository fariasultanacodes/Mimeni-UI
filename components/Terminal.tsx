"use client"

import type React from "react"
import { useEffect, useRef, useState } from "react"
import { Terminal as XTerm } from "@xterm/xterm"
import { FitAddon } from "@xterm/addon-fit"
import { WebLinksAddon } from "@xterm/addon-web-links"
import "@xterm/xterm/css/xterm.css"

interface TerminalProps {
  theme?: "light" | "dark"
}

const Terminal: React.FC<TerminalProps> = ({ theme = "dark" }) => {
  const terminalRef = useRef<HTMLDivElement>(null)
  const xtermRef = useRef<XTerm | null>(null)
  const fitAddonRef = useRef<FitAddon | null>(null)
  const [isReady, setIsReady] = useState(false)

  useEffect(() => {
    if (!terminalRef.current) return

    // Create terminal instance
    const terminal = new XTerm({
      cursorBlink: true,
      fontSize: 14,
      fontFamily: 'Monaco, Menlo, "Ubuntu Mono", monospace',
      theme:
        theme === "dark"
          ? {
              background: "#1a1a1a",
              foreground: "#ffffff",
              cursor: "#ffffff",
              selection: "#3e4451",
              black: "#000000",
              red: "#e06c75",
              green: "#98c379",
              yellow: "#d19a66",
              blue: "#61afef",
              magenta: "#c678dd",
              cyan: "#56b6c2",
              white: "#abb2bf",
              brightBlack: "#5c6370",
              brightRed: "#e06c75",
              brightGreen: "#98c379",
              brightYellow: "#d19a66",
              brightBlue: "#61afef",
              brightMagenta: "#c678dd",
              brightCyan: "#56b6c2",
              brightWhite: "#ffffff",
            }
          : {
              background: "#ffffff",
              foreground: "#000000",
              cursor: "#000000",
              selection: "#d4d4d4",
              black: "#000000",
              red: "#cd3131",
              green: "#00bc00",
              yellow: "#949800",
              blue: "#0451a5",
              magenta: "#bc05bc",
              cyan: "#0598bc",
              white: "#555555",
              brightBlack: "#666666",
              brightRed: "#cd3131",
              brightGreen: "#14ce14",
              brightYellow: "#b5ba00",
              brightBlue: "#0451a5",
              brightMagenta: "#bc05bc",
              brightCyan: "#0598bc",
              brightWhite: "#a5a5a5",
            },
      cols: 80,
      rows: 24,
      scrollback: 1000,
      tabStopWidth: 4,
    })

    // Create addons
    const fitAddon = new FitAddon()
    const webLinksAddon = new WebLinksAddon()

    // Load addons
    terminal.loadAddon(fitAddon)
    terminal.loadAddon(webLinksAddon)

    // Open terminal
    terminal.open(terminalRef.current)

    // Store references
    xtermRef.current = terminal
    fitAddonRef.current = fitAddon

    // Welcome message
    terminal.writeln("\x1b[1;32m╭─────────────────────────────────────────╮\x1b[0m")
    terminal.writeln("\x1b[1;32m│  Welcome to Browser Terminal v1.0      │\x1b[0m")
    terminal.writeln("\x1b[1;32m│  Built with XTerm.js                    │\x1b[0m")
    terminal.writeln("\x1b[1;32m╰─────────────────────────────────────────╯\x1b[0m")
    terminal.writeln("")
    terminal.writeln("\x1b[1;36mAvailable commands:\x1b[0m")
    terminal.writeln("  \x1b[33mhelp\x1b[0m     - Show available commands")
    terminal.writeln("  \x1b[33mclear\x1b[0m    - Clear the terminal")
    terminal.writeln("  \x1b[33mecho\x1b[0m     - Echo text back")
    terminal.writeln("  \x1b[33mdate\x1b[0m     - Show current date and time")
    terminal.writeln("  \x1b[33mwhoami\x1b[0m   - Show current user")
    terminal.writeln("  \x1b[33muname\x1b[0m    - Show system information")
    terminal.writeln("")

    let currentLine = ""
    const prompt = "\x1b[1;32m$\x1b[0m "

    const writePrompt = () => {
      terminal.write(prompt)
    }

    const executeCommand = (command: string) => {
      const cmd = command.trim().toLowerCase()
      const args = command.trim().split(" ").slice(1)

      switch (cmd.split(" ")[0]) {
        case "help":
          terminal.writeln("")
          terminal.writeln("\x1b[1;36mAvailable commands:\x1b[0m")
          terminal.writeln("  \x1b[33mhelp\x1b[0m     - Show this help message")
          terminal.writeln("  \x1b[33mclear\x1b[0m    - Clear the terminal screen")
          terminal.writeln("  \x1b[33mecho\x1b[0m     - Echo text back to terminal")
          terminal.writeln("  \x1b[33mdate\x1b[0m     - Display current date and time")
          terminal.writeln("  \x1b[33mwhoami\x1b[0m   - Display current user (guest)")
          terminal.writeln("  \x1b[33muname\x1b[0m    - Display system information")
          terminal.writeln("  \x1b[33mls\x1b[0m       - List directory contents (simulated)")
          terminal.writeln("  \x1b[33mpwd\x1b[0m      - Print working directory")
          break
        case "clear":
          terminal.clear()
          break
        case "echo":
          terminal.writeln(args.join(" "))
          break
        case "date":
          terminal.writeln(new Date().toString())
          break
        case "whoami":
          terminal.writeln("guest")
          break
        case "uname":
          terminal.writeln("Browser Terminal 1.0 (Web)")
          break
        case "ls":
          terminal.writeln("Documents/  Downloads/  Pictures/  Desktop/")
          break
        case "pwd":
          terminal.writeln("/home/guest")
          break
        case "":
          break
        default:
          terminal.writeln(`\x1b[31mCommand not found: ${cmd.split(" ")[0]}\x1b[0m`)
          terminal.writeln("Type \x1b[33mhelp\x1b[0m for available commands.")
      }
      terminal.writeln("")
    }

    writePrompt()

    // Handle input
    terminal.onData((data) => {
      const code = data.charCodeAt(0)

      if (code === 13) {
        // Enter
        terminal.writeln("")
        executeCommand(currentLine)
        currentLine = ""
        writePrompt()
      } else if (code === 127) {
        // Backspace
        if (currentLine.length > 0) {
          currentLine = currentLine.slice(0, -1)
          terminal.write("\b \b")
        }
      } else if (code >= 32) {
        // Printable characters
        currentLine += data
        terminal.write(data)
      }
    })

    // Fit terminal to container
    setTimeout(() => {
      fitAddon.fit()
      setIsReady(true)
    }, 100)

    // Handle resize
    const handleResize = () => {
      if (fitAddon) {
        fitAddon.fit()
      }
    }

    window.addEventListener("resize", handleResize)

    return () => {
      window.removeEventListener("resize", handleResize)
      terminal.dispose()
    }
  }, [theme])

  // Update theme when it changes
  useEffect(() => {
    if (xtermRef.current && isReady) {
      const newTheme =
        theme === "dark"
          ? {
              background: "#1a1a1a",
              foreground: "#ffffff",
              cursor: "#ffffff",
              selection: "#3e4451",
            }
          : {
              background: "#ffffff",
              foreground: "#000000",
              cursor: "#000000",
              selection: "#d4d4d4",
            }

      xtermRef.current.options.theme = newTheme
    }
  }, [theme, isReady])

  return (
    <div className="h-full w-full bg-gray-900 dark:bg-gray-900 p-4">
      <div className="h-full w-full rounded-lg overflow-hidden border border-gray-700 dark:border-gray-600">
        <div ref={terminalRef} className="h-full w-full" style={{ minHeight: "400px" }} />
      </div>
    </div>
  )
}

export default Terminal
