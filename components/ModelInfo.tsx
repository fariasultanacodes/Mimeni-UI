import type React from "react"

const ModelInfo: React.FC = () => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg p-6 mb-8 border border-gray-200 dark:border-gray-700 shadow-sm">
      <div className="flex items-center mb-4">
        <div className="w-3 h-3 bg-green-500 rounded-full mr-3"></div>
        <h2 className="text-lg font-semibold">Gemini 2.5 Flash</h2>
      </div>
      <p className="text-gray-600 dark:text-gray-400 text-sm">
        Fast, intelligent responses with advanced reasoning capabilities. Perfect for coding, analysis, and creative
        tasks.
      </p>
    </div>
  )
}

export default ModelInfo
