"use client"

import type React from "react"
import { useState, type KeyboardEvent } from "react"
import { Send } from "lucide-react"

interface ChatInputProps {
  onSendMessage: (message: string) => void
  isLoading: boolean
}

const ChatInput: React.FC<ChatInputProps> = ({ onSendMessage, isLoading }) => {
  const [input, setInput] = useState("")

  const handleSubmit = () => {
    if (input.trim() && !isLoading) {
      onSendMessage(input.trim())
      setInput("")
    }
  }

  const handleKeyPress = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSubmit()
    }
  }

  return (
    <div className="flex items-end space-x-3">
      <div className="flex-1 relative">
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Ask me anything..."
          className="w-full p-4 pr-12 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          rows={1}
          style={{ minHeight: "52px", maxHeight: "120px" }}
          disabled={isLoading}
        />
      </div>
      <button
        onClick={handleSubmit}
        disabled={!input.trim() || isLoading}
        className="p-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white rounded-lg transition-colors"
      >
        <Send className="w-5 h-5" />
      </button>
    </div>
  )
}

export default ChatInput
