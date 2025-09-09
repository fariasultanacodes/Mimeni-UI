import type React from "react"

const AboutContent: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="bg-white dark:bg-gray-800 rounded-lg p-8 border border-gray-200 dark:border-gray-700">
        <h1 className="text-3xl font-bold mb-6 text-gray-900 dark:text-gray-100">About Gemini Chat</h1>

        <div className="space-y-6 text-gray-700 dark:text-gray-300">
          <p className="text-lg leading-relaxed">
            Welcome to Gemini Chat, your intelligent AI assistant powered by Google's advanced Gemini 2.5 Flash model.
          </p>

          <div>
            <h2 className="text-xl font-semibold mb-3 text-gray-900 dark:text-gray-100">Features</h2>
            <ul className="list-disc list-inside space-y-2">
              <li>Fast, intelligent responses with advanced reasoning</li>
              <li>Code assistance and debugging support</li>
              <li>Creative writing and content generation</li>
              <li>Data analysis and problem-solving</li>
              <li>Dark and light theme support</li>
            </ul>
          </div>

          <div>
            <h2 className="text-xl font-semibold mb-3 text-gray-900 dark:text-gray-100">Technology</h2>
            <p>
              Built with React, TypeScript, and Tailwind CSS, this application provides a modern, responsive interface
              for interacting with Google's Gemini AI model.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AboutContent
