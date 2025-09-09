export enum MessageRole {
  USER = "user",
  MODEL = "model",
}

export enum Theme {
  LIGHT = "light",
  DARK = "dark",
}

export interface ChatMessage {
  role: MessageRole
  content: string
}
