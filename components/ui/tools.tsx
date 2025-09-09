"use client"
import cx from "classnames"
import { AnimatePresence, motion } from "framer-motion"
import { type Dispatch, memo, type ReactNode, type SetStateAction, useEffect, useRef, useState } from "react"
import { useOnClickOutside } from "usehooks-ts"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

import { ArrowUp, Square } from "lucide-react"

type ToolProps = {
  description: string
  icon: ReactNode
  selectedTool: string | null
  setSelectedTool: Dispatch<SetStateAction<string | null>>
  isToolbarVisible?: boolean
  setIsToolbarVisible?: Dispatch<SetStateAction<boolean>>
  isAnimating: boolean
  onClick: () => void
}

const Tool = ({
  description,
  icon,
  selectedTool,
  setSelectedTool,
  isToolbarVisible,
  setIsToolbarVisible,
  isAnimating,
  onClick,
}: ToolProps) => {
  const [isHovered, setIsHovered] = useState(false)

  useEffect(() => {
    if (selectedTool !== description) {
      setIsHovered(false)
    }
  }, [selectedTool, description])

  const handleSelect = () => {
    if (!isToolbarVisible && setIsToolbarVisible) {
      setIsToolbarVisible(true)
      return
    }

    if (!selectedTool) {
      setIsHovered(true)
      setSelectedTool(description)
      return
    }

    if (selectedTool !== description) {
      setSelectedTool(description)
    } else {
      setSelectedTool(null)
      onClick()
    }
  }

  return (
    <Tooltip open={isHovered && !isAnimating}>
      <TooltipTrigger asChild>
        <motion.div
          className={cx("rounded-full p-3 cursor-pointer", {
            "bg-primary text-primary-foreground": selectedTool === description,
            "hover:bg-muted": selectedTool !== description,
          })}
          onHoverStart={() => {
            setIsHovered(true)
          }}
          onHoverEnd={() => {
            if (selectedTool !== description) setIsHovered(false)
          }}
          onKeyDown={(event) => {
            if (event.key === "Enter") {
              handleSelect()
            }
          }}
          initial={{ scale: 1, opacity: 0 }}
          animate={{ opacity: 1, transition: { delay: 0.1 } }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          exit={{
            scale: 0.9,
            opacity: 0,
            transition: { duration: 0.1 },
          }}
          onClick={() => {
            handleSelect()
          }}
        >
          {selectedTool === description ? <ArrowUp size={16} /> : icon}
        </motion.div>
      </TooltipTrigger>
      <TooltipContent side="left" sideOffset={16} className="rounded-2xl bg-foreground p-3 px-4 text-background">
        {description}
      </TooltipContent>
    </Tooltip>
  )
}

export interface ToolbarItem {
  description: string
  icon: ReactNode
  onClick: () => void
}

export const Tools = ({
  isToolbarVisible,
  selectedTool,
  setSelectedTool,
  isAnimating,
  setIsToolbarVisible,
  tools,
}: {
  isToolbarVisible: boolean
  selectedTool: string | null
  setSelectedTool: Dispatch<SetStateAction<string | null>>
  isAnimating: boolean
  setIsToolbarVisible: Dispatch<SetStateAction<boolean>>
  tools: Array<ToolbarItem>
}) => {
  const [primaryTool, ...secondaryTools] = tools

  return (
    <motion.div
      className="flex flex-col gap-1.5"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
    >
      <AnimatePresence>
        {isToolbarVisible &&
          secondaryTools.map((secondaryTool) => (
            <Tool
              key={secondaryTool.description}
              description={secondaryTool.description}
              icon={secondaryTool.icon}
              selectedTool={selectedTool}
              setSelectedTool={setSelectedTool}
              isAnimating={isAnimating}
              onClick={secondaryTool.onClick}
            />
          ))}
      </AnimatePresence>

      <Tool
        description={primaryTool.description}
        icon={primaryTool.icon}
        selectedTool={selectedTool}
        setSelectedTool={setSelectedTool}
        isToolbarVisible={isToolbarVisible}
        setIsToolbarVisible={setIsToolbarVisible}
        isAnimating={isAnimating}
        onClick={primaryTool.onClick}
      />
    </motion.div>
  )
}

const PureToolbar = ({
  isToolbarVisible,
  setIsToolbarVisible,
  isLoading,
  onStop,
  tools,
}: {
  isToolbarVisible: boolean
  setIsToolbarVisible: Dispatch<SetStateAction<boolean>>
  isLoading: boolean
  onStop: () => void
  tools: Array<ToolbarItem>
}) => {
  const toolbarRef = useRef<HTMLDivElement>(null)
  const timeoutRef = useRef<ReturnType<typeof setTimeout>>()

  const [selectedTool, setSelectedTool] = useState<string | null>(null)
  const [isAnimating, setIsAnimating] = useState(false)

  useOnClickOutside(toolbarRef, () => {
    setIsToolbarVisible(false)
    setSelectedTool(null)
  })

  const startCloseTimer = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }

    timeoutRef.current = setTimeout(() => {
      setSelectedTool(null)
      setIsToolbarVisible(false)
    }, 2000)
  }

  const cancelCloseTimer = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }
  }

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [])

  useEffect(() => {
    if (isLoading) {
      setIsToolbarVisible(false)
    }
  }, [isLoading, setIsToolbarVisible])

  if (tools.length === 0) {
    return null
  }

  return (
    <TooltipProvider delayDuration={0}>
      <motion.div
        className="absolute right-6 bottom-6 flex cursor-pointer flex-col justify-end rounded-full border bg-background p-1.5 shadow-lg"
        initial={{ opacity: 0, y: -20, scale: 1 }}
        animate={
          isToolbarVisible
            ? {
                opacity: 1,
                y: 0,
                height: tools.length * 50,
                transition: { delay: 0 },
                scale: 1,
              }
            : { opacity: 1, y: 0, height: 54, transition: { delay: 0 } }
        }
        exit={{ opacity: 0, y: -20, transition: { duration: 0.1 } }}
        transition={{ type: "spring", stiffness: 300, damping: 25 }}
        onHoverStart={() => {
          if (isLoading) return
          cancelCloseTimer()
          setIsToolbarVisible(true)
        }}
        onHoverEnd={() => {
          if (isLoading) return
          startCloseTimer()
        }}
        onAnimationStart={() => {
          setIsAnimating(true)
        }}
        onAnimationComplete={() => {
          setIsAnimating(false)
        }}
        ref={toolbarRef}
      >
        {isLoading ? (
          <motion.div
            key="stop-icon"
            initial={{ scale: 1 }}
            animate={{ scale: 1.4 }}
            exit={{ scale: 1 }}
            className="p-3"
            onClick={onStop}
          >
            <Square size={16} />
          </motion.div>
        ) : (
          <Tools
            key="tools"
            isAnimating={isAnimating}
            isToolbarVisible={isToolbarVisible}
            selectedTool={selectedTool}
            setIsToolbarVisible={setIsToolbarVisible}
            setSelectedTool={setSelectedTool}
            tools={tools}
          />
        )}
      </motion.div>
    </TooltipProvider>
  )
}

export const Toolbar = memo(PureToolbar, (prevProps, nextProps) => {
  if (prevProps.isLoading !== nextProps.isLoading) return false
  if (prevProps.isToolbarVisible !== nextProps.isToolbarVisible) return false
  return true
})
