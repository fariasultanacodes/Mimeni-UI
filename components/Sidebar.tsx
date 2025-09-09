"use client"

import type React from "react"
import { Moon, Sun, MessageSquare, Info, Terminal, Globe, Monitor } from "lucide-react"
import { Theme } from "../types"

type View =
  | "chat"
  | "about"
  | "terminal"
  | "webpreview"
  | "console"
  | "pipeline"
  | "landing"
  | "developer"
  | "explorer"
  | "platform"
  | "kibo"
  | "geist"
  | "godot"
  | "creativeFramework"
  | "dotLoader"
  | "wasm"
  | "multiAgent"
  | "async"
  | "chatuidocs"

interface SidebarProps {
  theme: Theme
  toggleTheme: () => void
  onNewChat: () => void
  onShowAbout: () => void
  onShowTerminal: () => void
  onShowWebPreview: () => void
  onShowConsole: () => void
  onShowPipelineInfo: () => void
  onShowLandingPage: () => void
  onShowDeveloperGuide: () => void
  onShowFileExplorer: () => void
  onShowPlatformFeatures: () => void
  onShowKiboUI: () => void
  onShowGeistDesign: () => void
  onShowGodotInfo: () => void
  onShowCreativeFramework: () => void
  onShowDotLoader: () => void
  onShowWasmInfo: () => void
  onShowMultiAgentSystems: () => void
  onShowAsyncInfo: () => void
  onShowChatUIDocs: () => void
  currentView: View
}

const Sidebar: React.FC<SidebarProps> = ({
  theme,
  toggleTheme,
  onNewChat,
  onShowAbout,
  onShowTerminal,
  onShowWebPreview,
  onShowConsole,
  currentView,
}) => {
  const menuItems = [
    { id: "chat", label: "New Chat", icon: MessageSquare, onClick: onNewChat },
    { id: "terminal", label: "Terminal", icon: Terminal, onClick: onShowTerminal },
    { id: "console", label: "Console", icon: Monitor, onClick: onShowConsole },
    { id: "webpreview", label: "Web Preview", icon: Globe, onClick: onShowWebPreview },
    { id: "about", label: "About", icon: Info, onClick: onShowAbout },
  ]

  return (
    <div className="w-64 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-700 flex flex-col">
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Gemini Chat</h2>
      </div>

      <nav className="flex-1 p-4 space-y-2">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={item.onClick}
            className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-colors ${
              currentView === item.id
                ? "bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300"
                : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
            }`}
          >
            <item.icon className="w-5 h-5" />
            <span>{item.label}</span>
          </button>
        ))}
      </nav>

      <div className="p-4 border-t border-gray-200 dark:border-gray-700">
        <button
          onClick={toggleTheme}
          className="w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
        >
          {theme === Theme.DARK ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          <span>{theme === Theme.DARK ? "Light Mode" : "Dark Mode"}</span>
        </button>
      </div>
    </div>
  )
}

export default Sidebar
