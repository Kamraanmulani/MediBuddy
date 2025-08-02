"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Skeleton } from "@/components/ui/skeleton"
import { cn } from "@/lib/utils"

export type MessageType = "user" | "bot"

export interface ChatMessageProps {
  type: MessageType
  message: string
  isLoading?: boolean
  className?: string
}

export function ChatMessage({
  type,
  message,
  isLoading = false,
  className,
}: ChatMessageProps) {
  return (
    <div
      className={cn(
        "flex w-full items-start gap-4 py-4",
        type === "user" ? "justify-end" : "justify-start",
        className
      )}
    >
      {type === "bot" && (
        <Avatar className="h-8 w-8 border bg-background">
          <AvatarImage src="/doctor-avatar.png" alt="Dr. MediBot" />
          <AvatarFallback className="text-primary/80 bg-primary/10 font-medium">DR</AvatarFallback>
        </Avatar>
      )}
      
      <div
        className={cn(
          "rounded-lg px-4 py-3 max-w-[80%]",
          type === "user"
            ? "bg-primary text-primary-foreground"
            : "bg-muted text-muted-foreground"
        )}
      >
        {isLoading ? (
          <Skeleton className="h-4 w-[200px]" />
        ) : (
          <div className="whitespace-pre-wrap text-sm leading-relaxed">
            {message}
          </div>
        )}
      </div>
      
      {type === "user" && (
        <Avatar className="h-8 w-8 border bg-background">
          <AvatarFallback className="bg-primary/10 text-primary/80 font-medium">ME</AvatarFallback>
        </Avatar>
      )}
    </div>
  )
} 