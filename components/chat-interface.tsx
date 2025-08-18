"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { Send, Paperclip } from "lucide-react"
import { supabase } from "@/lib/supabase/client"
import { formatDistanceToNow } from "date-fns"

interface Message {
  id: string
  content: string
  created_at: string
  sender_id: string
  users: {
    full_name: string
    role: string
  }
}

interface ChatInterfaceProps {
  groupId: string
  initialMessages: Message[]
  currentUser: any
}

export default function ChatInterface({ groupId, initialMessages, currentUser }: ChatInterfaceProps) {
  const [messages, setMessages] = useState<Message[]>(initialMessages)
  const [newMessage, setNewMessage] = useState("")
  const [isSending, setIsSending] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  // Set up real-time subscription
  useEffect(() => {
    const channel = supabase
      .channel(`group-${groupId}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "messages",
          filter: `group_id=eq.${groupId}`,
        },
        async (payload) => {
          // Fetch the complete message with user data
          const { data: newMessage } = await supabase
            .from("messages")
            .select(`
              *,
              users(full_name, role)
            `)
            .eq("id", payload.new.id)
            .single()

          if (newMessage) {
            setMessages((prev) => [...prev, newMessage])
          }
        },
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [groupId])

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!newMessage.trim() || isSending) return

    setIsSending(true)

    try {
      const { error } = await supabase.from("messages").insert({
        group_id: groupId,
        sender_id: currentUser.id,
        content: newMessage.trim(),
        message_type: "text",
      })

      if (error) {
        console.error("Send message error:", error)
        alert("Failed to send message. Please try again.")
      } else {
        setNewMessage("")
      }
    } catch (error) {
      console.error("Send message error:", error)
      alert("Failed to send message. Please try again.")
    } finally {
      setIsSending(false)
    }
  }

  return (
    <div className="flex-1 flex flex-col">
      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <p>No messages yet. Start the conversation!</p>
          </div>
        ) : (
          messages.map((message) => {
            const isOwnMessage = message.sender_id === currentUser.id

            return (
              <div key={message.id} className={`flex ${isOwnMessage ? "justify-end" : "justify-start"}`}>
                <Card
                  className={`max-w-xs lg:max-w-md px-4 py-3 ${
                    isOwnMessage ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-900"
                  }`}
                >
                  {!isOwnMessage && (
                    <div className="text-xs font-medium mb-1 text-gray-600">
                      {message.users.full_name}
                      {message.users.role === "lecturer" && (
                        <span className="ml-1 text-blue-600 font-semibold">• Lecturer</span>
                      )}
                    </div>
                  )}
                  <p className="text-sm">{message.content}</p>
                  <div className={`text-xs mt-1 ${isOwnMessage ? "text-blue-100" : "text-gray-500"}`}>
                    {formatDistanceToNow(new Date(message.created_at), { addSuffix: true })}
                  </div>
                </Card>
              </div>
            )
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Message Input */}
      <div className="border-t bg-white p-4">
        <form onSubmit={sendMessage} className="flex space-x-2">
          <Button type="button" variant="ghost" size="sm" className="text-gray-500">
            <Paperclip className="h-4 w-4" />
          </Button>
          <Input
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type a message..."
            className="flex-1"
            disabled={isSending}
          />
          <Button
            type="submit"
            disabled={!newMessage.trim() || isSending}
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            <Send className="h-4 w-4" />
          </Button>
        </form>
      </div>
    </div>
  )
}
