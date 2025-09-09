"use client"

import type React from "react"

interface ExamplePromptsProps {
  onPromptClick: (prompt: string) => void
}

const ExamplePrompts: React.FC<ExamplePromptsProps> = ({ onPromptClick }) => {
  const prompts = [
    "Help me debug this React component",
    "Explain async/await in JavaScript",
    "Create a responsive CSS layout",
    "Write a Python function to process data",
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full max-w-2xl">
      {prompts.map((prompt, index) => (
        <button
          key={index}
          onClick={() => onPromptClick(prompt)}
          className="p-4 text-left bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-600 transition-colors shadow-sm hover:shadow-md"
        >
          <span className="text-gray-900 dark:text-gray-100">{prompt}</span>
        </button>
      ))}
    </div>
  )
}

export default ExamplePrompts
