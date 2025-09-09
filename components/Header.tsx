import type React from "react"

const Header: React.FC = () => {
  return (
    <div className="text-center mb-8">
      <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
        Gemini Chat
      </h1>
      <p className="text-gray-600 dark:text-gray-400 text-lg">
        Your intelligent AI assistant powered by Google's Gemini
      </p>
    </div>
  )
}

export default Header
