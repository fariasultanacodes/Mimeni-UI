"use client"

import type React from "react"

import { useState } from "react"
import {
  PromptInput,
  PromptInputTextarea,
  PromptInputToolbar,
  PromptInputTools,
  PromptInputButton,
  PromptInputSubmit,
} from "@/components/ui/prompt-input"
import { Suggestions, Suggestion } from "@/components/ui/suggestions"
import { PaperclipIcon, MicIcon } from "lucide-react"

interface EnhancedChatInputProps {
  onSendMessage: (message: string) => void
  isLoading?: boolean
  className?: string
}

const EXAMPLE_SUGGESTIONS = [
  "Explain quantum computing",
  "Write a Python function",
  "Help me debug this code",
  "Create a React component",
  "Explain machine learning",
]

export function EnhancedChatInput({ onSendMessage, isLoading, className }: EnhancedChatInputProps) {
  const [message, setMessage] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (message.trim() && !isLoading) {
      onSendMessage(message.trim())
      setMessage("")
    }
  }

  const handleSuggestionClick = (suggestion: string) => {
    setMessage(suggestion)
  }

  return (
    <div className={className}>
      {message === "" && (
        <div className="mb-4">
          <Suggestions>
            {EXAMPLE_SUGGESTIONS.map((suggestion, index) => (
              <Suggestion key={index} suggestion={suggestion} onClick={handleSuggestionClick} />
            ))}
          </Suggestions>
        </div>
      )}

      <PromptInput onSubmit={handleSubmit}>
        <PromptInputTextarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Ask me anything..."
          disabled={isLoading}
        />
        <PromptInputToolbar>
          <PromptInputTools>
            <PromptInputButton>
              <PaperclipIcon className="size-4" />
              Attach
            </PromptInputButton>
            <PromptInputButton>
              <MicIcon className="size-4" />
            </PromptInputButton>
          </PromptInputTools>
          <PromptInputSubmit disabled={!message.trim() || isLoading} status={isLoading ? "streaming" : undefined} />
        </PromptInputToolbar>
      </PromptInput>
    </div>
  )
}
