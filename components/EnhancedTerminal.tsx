"use client"

import { useEffect, useRef, useState } from "react"
import { Terminal } from "@xterm/xterm"
import { FitAddon } from "@xterm/addon-fit"
import { WebLinksAddon } from "@xterm/addon-web-links"
import { Console, type ConsoleOutput } from "@/components/ui/console"
import { Actions, Action } from "@/components/ui/actions"
import { Button } from "@/components/ui/button"
import { Square, RotateCcw } from "lucide-react"

interface EnhancedTerminalProps {
  theme?: "light" | "dark"
}

export function EnhancedTerminal({ theme = "dark" }: EnhancedTerminalProps) {
  const terminalRef = useRef<HTMLDivElement>(null)
  const terminal = useRef<Terminal | null>(null)
  const fitAddon = useRef<FitAddon | null>(null)
  const [consoleOutputs, setConsoleOutputs] = useState<ConsoleOutput[]>([])
  const [isRunning, setIsRunning] = useState(false)

  useEffect(() => {
    if (terminalRef.current && !terminal.current) {
      terminal.current = new Terminal({
        cursorBlink: true,
        fontSize: 14,
        fontFamily: "JetBrains Mono, Consolas, Monaco, monospace",
        theme: {
          background: theme === "dark" ? "#1a1a1a" : "#ffffff",
          foreground: theme === "dark" ? "#ffffff" : "#000000",
          cursor: theme === "dark" ? "#ffffff" : "#000000",
        },
        rows: 24,
        cols: 80,
      })

      fitAddon.current = new FitAddon()
      terminal.current.loadAddon(fitAddon.current)
      terminal.current.loadAddon(new WebLinksAddon())

      terminal.current.open(terminalRef.current)
      fitAddon.current.fit()

      let currentLine = ""
      terminal.current.write("$ ")

      terminal.current.onData((data) => {
        if (data === "\r") {
          terminal.current?.write("\r\n")
          if (currentLine.trim()) {
            executeCommand(currentLine.trim())
          }
          currentLine = ""
          terminal.current?.write("$ ")
        } else if (data === "\u007f") {
          if (currentLine.length > 0) {
            currentLine = currentLine.slice(0, -1)
            terminal.current?.write("\b \b")
          }
        } else {
          currentLine += data
          terminal.current?.write(data)
        }
      })
    }

    return () => {
      if (terminal.current) {
        terminal.current.dispose()
        terminal.current = null
      }
    }
  }, [theme])

  const executeCommand = (command: string) => {
    const outputId = Date.now().toString()

    setConsoleOutputs((prev) => [
      ...prev,
      {
        id: outputId,
        status: "in_progress",
        contents: [],
      },
    ])

    setIsRunning(true)

    // Simulate command execution
    setTimeout(() => {
      let output = ""
      let status: "completed" | "failed" = "completed"

      switch (command.toLowerCase()) {
        case "help":
          output =
            "Available commands:\n- help: Show this help\n- clear: Clear terminal\n- date: Show current date\n- echo <text>: Echo text\n- ls: List files\n- pwd: Show current directory\n- whoami: Show current user"
          break
        case "clear":
          terminal.current?.clear()
          output = "Terminal cleared"
          break
        case "date":
          output = new Date().toString()
          break
        case "ls":
          output = "Documents/\nDownloads/\nDesktop/\nPictures/\nVideos/"
          break
        case "pwd":
          output = "/home/user"
          break
        case "whoami":
          output = "user"
          break
        default:
          if (command.startsWith("echo ")) {
            output = command.substring(5)
          } else {
            output = `Command not found: ${command}`
            status = "failed"
          }
      }

      terminal.current?.write(output + "\r\n")

      setConsoleOutputs((prev) =>
        prev.map((item) =>
          item.id === outputId ? { ...item, status, contents: [{ type: "text", value: output }] } : item,
        ),
      )

      setIsRunning(false)
    }, 1000)
  }

  const handleClear = () => {
    terminal.current?.clear()
    terminal.current?.write("$ ")
    setConsoleOutputs([])
  }

  const handleReset = () => {
    terminal.current?.reset()
    terminal.current?.write("$ ")
    setConsoleOutputs([])
  }

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center justify-between border-b p-2">
        <h3 className="font-semibold">Enhanced Terminal</h3>
        <Actions>
          <Action onClick={handleClear} disabled={isRunning}>
            <Button variant="ghost">
              <Square className="mr-2 h-4 w-4" />
              Clear
            </Button>
          </Action>
          <Action onClick={handleReset} disabled={isRunning}>
            <Button variant="ghost">
              <RotateCcw className="mr-2 h-4 w-4" />
              Reset
            </Button>
          </Action>
        </Actions>
      </div>
      <div ref={terminalRef} className="flex-1" />
      <Console outputs={consoleOutputs} />
    </div>
  )
}
