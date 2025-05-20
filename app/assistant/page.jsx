"use client";
// app/assistant/page.jsx

import { useState, useRef, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Card, 
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter
} from "@/components/ui/card";
import { 
  Form, 
  FormControl, 
  FormField, 
  FormItem 
} from "@/components/ui/form";
import { 
  Loader, 
  MessageSquare, 
  Home, 
  User 
} from "lucide-react";

// Form schema
const chatFormSchema = z.object({
  message: z.string().min(1, "Please enter a message"),
});

/**
 * @typedef {Object} ChatFormValues
 * @property {string} message
 */

/**
 * @typedef {Object} Message
 * @property {"user" | "assistant"} role
 * @property {string} content
 * @property {Date} timestamp
 */

export default function ChatAssistant() {
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content: "Hello! I'm your real estate assistant powered by AI. I can help answer questions about buying or renting a home, mortgages, real estate market trends, and more. How can I assist you today?",
      timestamp: new Date(),
    },
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Form definition
  const form = useForm<ChatFormValues>({
    resolver: zodResolver(chatFormSchema),
    defaultValues: {
      message: "",
    },
  });

  // Scroll to bottom of messages
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  // Simulate a response from AI
  const simulateAIResponse = async (userMessage) => {
    // Basic response patterns based on keywords
    if (userMessage.toLowerCase().includes("mortgage")) {
      return "Mortgages are loans used to purchase homes when you don't have the full purchase price available upfront. The key factors to understand are:\n\n- Down payment: Typically 3-20% of the home's value\n- Interest rates: Can be fixed or adjustable\n- Loan term: Usually 15 or 30 years\n- Credit score: Higher scores get better rates\n\nBefore applying, I'd recommend checking your credit score, saving for a down payment, and getting pre-approved to understand how much house you can afford.";
    } else if (userMessage.toLowerCase().includes("first time") || userMessage.toLowerCase().includes("first-time")) {
      return "As a first-time homebuyer, here are some essential tips:\n\n1. Check if you qualify for first-time buyer programs that offer lower down payments or closing cost assistance\n2. Get pre-approved for a mortgage before house hunting\n3. Consider all costs beyond the purchase price (taxes, insurance, maintenance)\n4. Don't skip the home inspection\n5. Research neighborhoods thoroughly\n\nMany first-time buyers focus only on the monthly mortgage payment but forget about property taxes, homeowners insurance, and maintenance costs.";
    } else if (userMessage.toLowerCase().includes("rent") || userMessage.toLowerCase().includes("renting")) {
      return "When considering renting vs buying, think about:\n\n- How long you plan to stay in the area (typically buying makes more sense if you'll stay 5+ years)\n- Upfront costs (renting requires security deposit; buying needs down payment and closing costs)\n- Maintenance responsibilities (landlords handle maintenance when renting)\n- Financial flexibility (renting allows more mobility)\n\nRenting gives you flexibility but doesn't build equity. Buying builds wealth over time but comes with more responsibilities and costs.";
    } else if (userMessage.toLowerCase().includes("market") || userMessage.toLowerCase().includes("prices")) {
      return "Real estate markets are highly localized, but some general trends include:\n\n- Urban vs. suburban preferences shift based on lifestyle changes\n- Interest rates significantly impact affordability and buying power\n- Housing inventory levels affect price competition\n- Seasonal variations can make winter a buyer's market in many regions\n\nI'd recommend researching specific data for your target location, as national trends don't always reflect local conditions.";
    } else {
      return "Thank you for your question about " + userMessage.slice(0, 30) + "... As your real estate assistant, I can help with topics like mortgages, home buying processes, renting vs. buying decisions, property investments, and market trends.\n\nCould you provide more specific details about what you'd like to know regarding real estate? I'm here to provide practical guidance for your property journey.";
    }
  };

  // Handle form submission
  const onSubmit = async (data) => {
    const userMessage = data.message;
    
    // Add user message to chat
    setMessages((prev) => [
      ...prev,
      {
        role: "user",
        content: userMessage,
        timestamp: new Date(),
      },
    ]);
    
    // Reset form
    form.reset();
    
    // Set loading state
    setIsLoading(true);
    
    try {
      // In a production environment, this would be a call to a real AI API
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate network delay
      const aiResponse = await simulateAIResponse(userMessage);
      
      // Add assistant response to chat
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: aiResponse,
          timestamp: new Date(),
        },
      ]);
    } catch (error) {
      console.error("Error in chat:", error);
      // Add error message
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "I'm sorry, I experienced an error processing your request. Please try again.",
          timestamp: new Date(),
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container py-10 max-w-4xl">
      <Card className="w-full shadow-lg">
        <CardHeader className="border-b bg-primary/5">
          <CardTitle className="flex items-center gap-2 text-xl">
            <MessageSquare className="h-6 w-6" />
            Real Estate Assistant
          </CardTitle>
          <CardDescription>
            Ask questions about buying, selling, or renting properties
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <div className="h-[60vh] overflow-y-auto p-4">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`mb-4 flex ${
                  message.role === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`max-w-[80%] rounded-lg p-3 ${
                    message.role === "user"
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted dark:bg-gray-800"
                  }`}
                >
                  <div className="flex items-center gap-2 mb-1">
                    {message.role === "user" ? (
                      <User className="h-4 w-4" />
                    ) : (
                      <Home className="h-4 w-4" />
                    )}
                    <span className="text-xs font-medium">
                      {message.role === "user" ? "You" : "Assistant"}
                    </span>
                  </div>
                  <div className="whitespace-pre-wrap">{message.content}</div>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
        </CardContent>
        <CardFooter className="border-t p-4">
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="flex w-full gap-2"
            >
              <FormField
                control={form.control}
                name="message"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormControl>
                      <Input
                        placeholder="Type your message here..."
                        {...field}
                        disabled={isLoading}
                        className="h-12"
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              <Button type="submit" size="icon" disabled={isLoading} className="h-12 w-12">
                {isLoading ? (
                  <Loader className="h-5 w-5 animate-spin" />
                ) : (
                  <MessageSquare className="h-5 w-5" />
                )}
              </Button>
            </form>
          </Form>
        </CardFooter>
      </Card>
    </div>
  );
}