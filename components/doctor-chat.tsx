"use client"

import { useState, useRef, useEffect } from "react"
import { Send, RefreshCw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card" 
import { ChatMessage } from "@/components/ui/chat-message"
import { createDoctorChat, getDoctorResponse } from "@/lib/gemini"
import { Alert, AlertDescription } from "@/components/ui/alert"

interface Message {
  id: string
  type: "user" | "bot"
  text: string
}

export function DoctorChat() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      type: "bot",
      text: "Hello! I'm Dr. MediBot, your virtual healthcare assistant. How can I help you today? Please note that I'm an AI and my responses are not a substitute for professional medical advice."
    }
  ])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [chatSession, setChatSession] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)
  const [isInitializing, setIsInitializing] = useState(true)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Initialize chat session
    const initChat = async () => {
      setIsInitializing(true)
      setError(null)
      try {
        const session = await createDoctorChat()
        setChatSession(session)
        setError(null)
      } catch (error: any) {
        console.error("Failed to initialize chat:", error)
        setError("Failed to initialize chat. Please check your API key.")
      } finally {
        setIsInitializing(false)
      }
    }
    
    initChat()
  }, [])

  useEffect(() => {
    // Scroll to bottom when messages change
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!input.trim() || isLoading) return
    
    // Add user message
    const userMessage = {
      id: Date.now().toString(),
      type: "user" as const,
      text: input.trim()
    }
    
    setMessages(prev => [...prev, userMessage])
    setInput("")
    setIsLoading(true)
    setError(null)
    
    try {
      // Add loading placeholder
      const loadingId = "loading-" + Date.now().toString()
      setMessages(prev => [
        ...prev,
        { id: loadingId, type: "bot", text: "..." }
      ])
      
      // Get response from Gemini
      const { text, chatSession: updatedSession } = await getDoctorResponse(
        userMessage.text,
        chatSession
      )
      
      // Check if the response indicates an API error
      if (text.includes("API authentication error")) {
        setError("API authentication error. Please check your Gemini API key in lib/gemini.ts")
      }
      
      // Update chat session if needed
      if (updatedSession) {
        setChatSession(updatedSession)
      }
      
      // Replace loading message with response
      setMessages(prev => 
        prev.map(msg => 
          msg.id === loadingId 
            ? { id: Date.now().toString(), type: "bot", text }
            : msg
        )
      )
    } catch (error: any) {
      console.error("Error getting response:", error)
      setError(error?.message || "An error occurred while processing your request")
      
      // Replace loading with error message
      setMessages(prev => 
        prev.map(msg => 
          msg.id.startsWith("loading-") 
            ? { 
                id: Date.now().toString(), 
                type: "bot", 
                text: "I'm sorry, I encountered an error processing your request. Please try again."
              }
            : msg
        )
      )
    } finally {
      setIsLoading(false)
    }
  }

  const handleRetry = () => {
    const initChat = async () => {
      setIsInitializing(true)
      setError(null)
      try {
        const session = await createDoctorChat()
        setChatSession(session)
        setError(null)
      } catch (error: any) {
        console.error("Failed to initialize chat:", error)
        setError("Failed to initialize chat. Please check your API key.")
      } finally {
        setIsInitializing(false)
      }
    }
    
    initChat()
  }

  return (
    <Card className="w-full max-w-[800px] h-[600px] flex flex-col">
      <CardHeader className="border-b bg-primary/5">
        <CardTitle className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center">
            <span className="text-primary text-sm font-bold">DR</span>
          </div>
          <span>Dr. MediBot</span>
        </CardTitle>
        <CardDescription>
          Your virtual healthcare assistant powered by Gemini 2.0 Flash
        </CardDescription>
      </CardHeader>
      
      <CardContent className="flex-1 overflow-y-auto p-4 space-y-4">
        {error && (
          <Alert variant="destructive" className="mb-4 bg-red-50 border-red-200">
            <AlertDescription className="text-sm">
              {error}
              <Button 
                variant="outline" 
                size="sm" 
                className="ml-2" 
                onClick={handleRetry}
                disabled={isInitializing}
              >
                <RefreshCw className="h-3 w-3 mr-1" />
                Retry
              </Button>
            </AlertDescription>
          </Alert>
        )}
        
        <div className="space-y-4">
          {messages.map((message) => (
            <ChatMessage
              key={message.id}
              type={message.type}
              message={message.text}
              isLoading={message.id.startsWith("loading-")}
            />
          ))}
          <div ref={messagesEndRef} />
        </div>
      </CardContent>
      
      <CardFooter className="border-t p-4">
        <form onSubmit={handleSubmit} className="flex w-full items-center space-x-2">
          <Input
            placeholder="Type your health question here..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={isLoading || isInitializing || !!error}
            className="flex-1"
          />
          <Button 
            type="submit" 
            size="icon" 
            disabled={isLoading || isInitializing || !!error || !input.trim()}
          >
            <Send className="h-4 w-4" />
            <span className="sr-only">Send</span>
          </Button>
        </form>
      </CardFooter>
    </Card>
  )
}