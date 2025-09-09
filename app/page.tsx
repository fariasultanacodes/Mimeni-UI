"use client"

import type React from "react"
import { useState, useEffect, useCallback, useRef } from "react"
import { getChatResponse } from "../lib/gemini-service"
import { type ChatMessage, MessageRole, Theme } from "../types"
import Header from "../components/Header"
import ModelInfo from "../components/ModelInfo"
import ExamplePrompts from "../components/ExamplePrompts"
import { EnhancedChatHistory } from "../components/EnhancedChatHistory"
import { EnhancedChatInput } from "../components/EnhancedChatInput"
import Sidebar from "../components/Sidebar"
import AboutContent from "../components/AboutContent"
import { EnhancedTerminal } from "../components/EnhancedTerminal"
import {
  WebPreview,
  WebPreviewNavigation,
  WebPreviewNavigationButton,
  WebPreviewUrl,
  WebPreviewBody,
  WebPreviewConsole,
} from "../components/WebPreview"
import { Context } from "../components/ui/context"
import { Console, type ConsoleOutput } from "../components/ui/console"
import { ArrowLeft, ArrowRight, RotateCcw, Home } from "lucide-react"
import { Toolbar, type ToolbarItem } from "../components/ui/tools"
import { FileText, Download, Share2, Copy } from "lucide-react"

type View = "chat" | "about" | "terminal" | "webpreview" | "console"

interface EnhancedChatMessage extends ChatMessage {
  id: string
  reasoning?: string
  sources?: Array<{ title: string; url: string }>
  isStreaming?: boolean
  usage?: {
    input: number
    output: number
    total: number
  }
}

const App: React.FC = () => {
  const [theme, setTheme] = useState<Theme>(Theme.DARK)
  const [messages, setMessages] = useState<EnhancedChatMessage[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [view, setView] = useState<View>("chat")
  const [consoleOutputs, setConsoleOutputs] = useState<ConsoleOutput[]>([])
  const [isToolbarVisible, setIsToolbarVisible] = useState(false)

  const mainContentRef = useRef<HTMLElement>(null)

  useEffect(() => {
    if (theme === Theme.DARK) {
      document.documentElement.classList.add("dark")
    } else {
      document.documentElement.classList.remove("dark")
    }
  }, [theme])

  useEffect(() => {
    if (mainContentRef.current) {
      mainContentRef.current.scrollTop = mainContentRef.current.scrollHeight
    }
  }, [messages, view])

  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === Theme.LIGHT ? Theme.DARK : Theme.LIGHT))
  }

  const handleNewChat = useCallback(() => {
    setMessages([])
    setError(null)
    setView("chat")
  }, [])

  const handleShowAbout = useCallback(() => {
    setView("about")
  }, [])

  const handleShowTerminal = useCallback(() => {
    setView("terminal")
  }, [])

  const handleShowWebPreview = useCallback(() => {
    setView("webpreview")
  }, [])

  const handleShowConsole = useCallback(() => {
    setView("console")
  }, [])

  const handleSendMessage = useCallback(
    async (input: string) => {
      if (!input.trim() || isLoading) return

      setError(null)
      const newUserMessage: EnhancedChatMessage = {
        id: Date.now().toString(),
        role: MessageRole.USER,
        content: input,
      }
      setMessages((prev) => [...prev, newUserMessage])
      setIsLoading(true)

      const assistantMessageId = (Date.now() + 1).toString()
      setMessages((prev) => [
        ...prev,
        {
          id: assistantMessageId,
          role: MessageRole.MODEL,
          content: "",
          isStreaming: true,
          reasoning: "Analyzing your request and generating a comprehensive response...",
        },
      ])

      try {
        const stream = await getChatResponse(input)
        let fullResponse = ""
        const tokenUsage = { input: 0, output: 0, total: 0 }

        for await (const chunk of stream) {
          fullResponse += chunk.text
          tokenUsage.output = Math.floor(fullResponse.length / 4)
          tokenUsage.input = Math.floor(input.length / 4)
          tokenUsage.total = tokenUsage.input + tokenUsage.output

          setMessages((prev) => {
            const newMessages = [...prev]
            const lastMessage = newMessages[newMessages.length - 1]
            if (lastMessage.id === assistantMessageId) {
              lastMessage.content = fullResponse
              lastMessage.isStreaming = true
              lastMessage.usage = tokenUsage
            }
            return newMessages
          })
        }

        setMessages((prev) => {
          const newMessages = [...prev]
          const lastMessage = newMessages[newMessages.length - 1]
          if (lastMessage.id === assistantMessageId) {
            lastMessage.isStreaming = false
            lastMessage.sources = [
              { title: "Gemini AI Documentation", url: "https://ai.google.dev/gemini-api" },
              { title: "AI Development Best Practices", url: "https://developers.google.com/ai" },
            ]
          }
          return newMessages
        })
      } catch (err) {
        console.error(err)
        const errorMessage = "Sorry, I encountered an error. Please try again."
        setError(errorMessage)
        setMessages((prev) => {
          const newMessages = [...prev]
          const lastMessage = newMessages[newMessages.length - 1]
          if (lastMessage.id === assistantMessageId) {
            lastMessage.content = errorMessage
            lastMessage.isStreaming = false
            lastMessage.reasoning = undefined
          }
          return newMessages
        })
      } finally {
        setIsLoading(false)
      }
    },
    [isLoading],
  )

  const chatToolbarItems: ToolbarItem[] = [
    {
      description: "Export Chat",
      icon: <Download size={16} />,
      onClick: () => {
        const chatData = JSON.stringify(messages, null, 2)
        const blob = new Blob([chatData], { type: "application/json" })
        const url = URL.createObjectURL(blob)
        const a = document.createElement("a")
        a.href = url
        a.download = "chat-export.json"
        a.click()
        URL.revokeObjectURL(url)
      },
    },
    {
      description: "Share Chat",
      icon: <Share2 size={16} />,
      onClick: () => {
        if (navigator.share) {
          navigator.share({
            title: "Chat Conversation",
            text: messages.map((m) => `${m.role}: ${m.content}`).join("\n\n"),
          })
        }
      },
    },
    {
      description: "Copy Last Response",
      icon: <Copy size={16} />,
      onClick: () => {
        const lastMessage = messages[messages.length - 1]
        if (lastMessage && lastMessage.role === MessageRole.MODEL) {
          navigator.clipboard.writeText(lastMessage.content)
        }
      },
    },
    {
      description: "Summarize",
      icon: <FileText size={16} />,
      onClick: () => {
        handleSendMessage("Please provide a summary of our conversation so far.")
      },
    },
  ]

  const renderMainContent = () => {
    switch (view) {
      case "chat":
        if (messages.length === 0) {
          return (
            <div className="flex flex-col items-center justify-center min-h-full max-w-3xl mx-auto px-4 py-8">
              <Header />
              <ModelInfo />
              <ExamplePrompts onPromptClick={handleSendMessage} />
            </div>
          )
        }
        return (
          <div className="relative h-full">
            <EnhancedChatHistory messages={messages} isLoading={isLoading} />
            <Toolbar
              isToolbarVisible={isToolbarVisible}
              setIsToolbarVisible={setIsToolbarVisible}
              isLoading={isLoading}
              onStop={() => setIsLoading(false)}
              tools={chatToolbarItems}
            />
          </div>
        )
      case "about":
        return <AboutContent />
      case "terminal":
        return <EnhancedTerminal theme={theme === Theme.DARK ? "dark" : "light"} />
      case "console":
        return (
          <div className="h-full">
            <Console consoleOutputs={consoleOutputs} setConsoleOutputs={setConsoleOutputs} />
          </div>
        )
      case "webpreview":
        return (
          <div className="h-full p-4">
            <WebPreview defaultUrl="https://example.com" className="h-full">
              <WebPreviewNavigation>
                <WebPreviewNavigationButton tooltip="Back">
                  <ArrowLeft className="h-4 w-4" />
                </WebPreviewNavigationButton>
                <WebPreviewNavigationButton tooltip="Forward">
                  <ArrowRight className="h-4 w-4" />
                </WebPreviewNavigationButton>
                <WebPreviewNavigationButton tooltip="Refresh">
                  <RotateCcw className="h-4 w-4" />
                </WebPreviewNavigationButton>
                <WebPreviewNavigationButton tooltip="Home">
                  <Home className="h-4 w-4" />
                </WebPreviewNavigationButton>
                <WebPreviewUrl />
              </WebPreviewNavigation>
              <WebPreviewBody />
              <WebPreviewConsole />
            </WebPreview>
          </div>
        )
      default:
        return null
    }
  }

  return (
    <div className="flex flex-row h-screen bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-200 font-sans">
      <Sidebar
        theme={theme}
        toggleTheme={toggleTheme}
        onNewChat={handleNewChat}
        onShowAbout={handleShowAbout}
        onShowTerminal={handleShowTerminal}
        onShowWebPreview={handleShowWebPreview}
        onShowConsole={handleShowConsole}
        onShowPipelineInfo={() => {}}
        onShowLandingPage={() => {}}
        onShowDeveloperGuide={() => {}}
        onShowFileExplorer={() => {}}
        onShowPlatformFeatures={() => {}}
        onShowKiboUI={() => {}}
        onShowGeistDesign={() => {}}
        onShowGodotInfo={() => {}}
        onShowCreativeFramework={() => {}}
        onShowDotLoader={() => {}}
        onShowWasmInfo={() => {}}
        onShowMultiAgentSystems={() => {}}
        onShowAsyncInfo={() => {}}
        onShowChatUIDocs={() => {}}
        currentView={view}
      />

      <div className="flex-1 flex flex-col h-screen">
        <main ref={mainContentRef} className="flex-1 overflow-y-auto scrollbar-custom">
          {renderMainContent()}
        </main>

        {view === "chat" && (
          <footer className="w-full bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700">
            <div className="max-w-4xl mx-auto px-4 py-4">
              {error && <p className="text-center text-red-500 mb-2">{error}</p>}
              <EnhancedChatInput onSendMessage={handleSendMessage} isLoading={isLoading} />
              <div className="flex items-center justify-between mt-2">
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Model: gemini-2.5-flash - Generated content may be inaccurate or false.
                </p>
                {messages.length > 0 && messages[messages.length - 1]?.usage && (
                  <Context
                    maxTokens={32000}
                    usedTokens={messages[messages.length - 1].usage?.total || 0}
                    modelId="gemini-2.5-flash"
                  />
                )}
              </div>
            </div>
          </footer>
        )}
      </div>
    </div>
  )
}

export default App
