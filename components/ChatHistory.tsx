import type React from "react"
import { type ChatMessage, MessageRole } from "../types"

interface ChatHistoryProps {
  messages: ChatMessage[]
}

const ChatHistory: React.FC<ChatHistoryProps> = ({ messages }) => {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
      {messages.map((message, index) => (
        <div key={index} className={`flex ${message.role === MessageRole.USER ? "justify-end" : "justify-start"}`}>
          <div
            className={`max-w-3xl p-4 rounded-lg ${
              message.role === MessageRole.USER
                ? "bg-blue-600 text-white ml-12"
                : "bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 mr-12"
            }`}
          >
            <div className="flex items-start space-x-3">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  message.role === MessageRole.USER
                    ? "bg-blue-700 text-white"
                    : "bg-gradient-to-r from-purple-500 to-blue-500 text-white"
                }`}
              >
                {message.role === MessageRole.USER ? "U" : "G"}
              </div>
              <div className="flex-1 min-w-0">
                <pre className="whitespace-pre-wrap font-sans text-sm leading-relaxed">{message.content}</pre>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

export default ChatHistory
