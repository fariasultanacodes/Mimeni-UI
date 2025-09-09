"use client"
import { Message, MessageContent, MessageAvatar } from "@/components/ui/message"
import { Conversation, ConversationContent, ConversationScrollButton } from "@/components/ui/conversation"
import { Response } from "@/components/ui/response"
import { Sources, SourcesTrigger, SourcesContent, Source } from "@/components/ui/sources"
import { Loader } from "@/components/ui/loader"
import { MessageReasoning } from "@/components/ui/message-reasoning"

interface ChatMessage {
  id: string
  role: "user" | "assistant"
  content: string
  reasoning?: string
  sources?: Array<{ title: string; url: string }>
  isStreaming?: boolean
}

interface EnhancedChatHistoryProps {
  messages: ChatMessage[]
  isLoading?: boolean
  className?: string
}

export function EnhancedChatHistory({ messages, isLoading, className }: EnhancedChatHistoryProps) {
  return (
    <Conversation className={className}>
      <ConversationContent>
        <div className="space-y-4">
          {messages.map((message) => (
            <Message key={message.id} from={message.role}>
              <MessageAvatar
                src={
                  message.role === "user"
                    ? "/placeholder.svg?height=32&width=32&query=user+avatar"
                    : "/placeholder.svg?height=32&width=32&query=ai+assistant+avatar"
                }
                name={message.role === "user" ? "You" : "AI"}
              />
              <MessageContent>
                {message.role === "assistant" && message.reasoning && (
                  <MessageReasoning isLoading={message.isStreaming || false} reasoning={message.reasoning} />
                )}

                {message.role === "assistant" && message.sources && message.sources.length > 0 && (
                  <Sources>
                    <SourcesTrigger count={message.sources.length} />
                    <SourcesContent>
                      {message.sources.map((source, index) => (
                        <Source key={index} href={source.url} title={source.title} />
                      ))}
                    </SourcesContent>
                  </Sources>
                )}

                <Response>{message.content}</Response>
              </MessageContent>
            </Message>
          ))}

          {isLoading && (
            <Message from="assistant">
              <MessageAvatar src="/ai-assistant-avatar.png" name="AI" />
              <MessageContent>
                <div className="flex items-center gap-2">
                  <Loader size={16} />
                  <span className="text-muted-foreground">Thinking...</span>
                </div>
              </MessageContent>
            </Message>
          )}
        </div>
      </ConversationContent>
      <ConversationScrollButton />
    </Conversation>
  )
}
