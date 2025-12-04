"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MessageSquare, X, Send, AlertCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { mockStore } from "@/lib/mock-data";
import { useSession } from "next-auth/react";
import faqData from "@/lib/faq-data.json";

export function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Array<{ role: "user" | "bot"; content: string }>>([
    { role: "bot", content: "Hello! I'm your AI assistant. How can I help you today?" },
  ]);
  const [input, setInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  const { data: session } = useSession();

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const findFAQAnswer = (question: string): string | null => {
    const lowerQuestion = question.toLowerCase();
    for (const faq of faqData.faqs) {
      if (lowerQuestion.includes(faq.question.toLowerCase().split(" ")[0]) || 
          faq.question.toLowerCase().includes(lowerQuestion.split(" ")[0])) {
        return faq.answer;
      }
    }
    return null;
  };

  const handleSend = () => {
    if (!input.trim()) return;

    const userMessage = input.trim();
    setMessages((prev) => [...prev, { role: "user", content: userMessage }]);
    setInput("");

    // Simulate bot response
    setTimeout(() => {
      const faqAnswer = findFAQAnswer(userMessage);
      let botResponse: string;

      if (userMessage.toLowerCase().includes("escalate") || userMessage.toLowerCase().includes("admin")) {
        // Create support ticket
        if (session?.user?.id) {
          mockStore.supportTickets.create({
            userId: session.user.id,
            subject: "Support Request from Chat",
            message: userMessage,
          });
          botResponse = "I've escalated your request to an admin. A support ticket has been created and you'll receive a response soon.";
          toast({
            title: "Ticket Created",
            description: "Your support ticket has been created",
          });
        } else {
          botResponse = "Please log in to escalate to admin.";
        }
      } else if (faqAnswer) {
        botResponse = faqAnswer;
      } else {
        botResponse = "I'm here to help! You can ask me about jobs, payments, courses, or the forum. Type 'escalate to admin' if you need human assistance.";
      }

      setMessages((prev) => [...prev, { role: "bot", content: botResponse }]);
    }, 500);
  };

  if (!isOpen) {
    return (
      <div className="fixed bottom-4 right-4 z-50">
        <Button
          onClick={() => setIsOpen(true)}
          size="lg"
          className="rounded-full h-14 w-14 shadow-lg"
        >
          <MessageSquare className="h-6 w-6" />
        </Button>
      </div>
    );
  }

  return (
    <div className="fixed bottom-4 right-4 z-50 w-96">
      <Card className="shadow-2xl">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-lg">AI Assistant</CardTitle>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsOpen(false)}
            className="h-6 w-6"
          >
            <X className="h-4 w-4" />
          </Button>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="h-96 overflow-y-auto space-y-4 pr-2">
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[80%] rounded-lg p-3 ${
                    msg.role === "user"
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted"
                  }`}
                >
                  <p className="text-sm">{msg.content}</p>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
          <div className="flex gap-2">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleSend()}
              placeholder="Type your message..."
            />
            <Button onClick={handleSend} size="icon">
              <Send className="h-4 w-4" />
            </Button>
          </div>
          <Button
            variant="outline"
            size="sm"
            className="w-full"
            onClick={() => {
              if (session?.user?.id) {
                mockStore.supportTickets.create({
                  userId: session.user.id,
                  subject: "Support Request from Chat",
                  message: "User requested escalation",
                });
                setMessages((prev) => [
                  ...prev,
                  {
                    role: "bot",
                    content: "I've escalated your request to an admin. A support ticket has been created.",
                  },
                ]);
                toast({
                  title: "Ticket Created",
                  description: "Your support ticket has been created",
                });
              }
            }}
          >
            <AlertCircle className="mr-2 h-4 w-4" />
            Escalate to Admin
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

