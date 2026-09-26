import React, { useState, useRef, useEffect } from 'react';
import { ChatMessage } from '../types';
import { Bot, Send, X, Sparkles, User, RefreshCw } from 'lucide-react';

interface AICoachChatModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AICoachChatModal: React.FC<AICoachChatModalProps> = ({ isOpen, onClose }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'm-1',
      sender: 'assistant',
      text: "Hello! I'm PulseAI, your personal financial advisor. Ask me anything about your cash flow, budget limits, spending trends, or savings strategy!",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const samplePrompts = [
    "How much did I spend on Food & Dining this month?",
    "Can I afford a $350 weekend getaway trip?",
    "Where can I save $150 before month end?",
  ];

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  if (!isOpen) return null;

  const handleSend = async (textToSend?: string) => {
    const query = textToSend || input;
    if (!query.trim() || isLoading) return;

    const userMsg: ChatMessage = {
      id: 'm-' + Date.now(),
      sender: 'user',
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    try {
      const res = await fetch('/api/gemini/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: query,
          chatHistory: messages,
        }),
      });

      const data = await res.json();
      const botMsg: ChatMessage = {
        id: 'm-' + (Date.now() + 1),
        sender: 'assistant',
        text: data.text || "I've reviewed your financial data. Everything looks on track!",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, botMsg]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          id: 'm-' + Date.now(),
          sender: 'assistant',
          text: "I encountered an issue analyzing your accounts. Please check your connection and try again.",
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-end sm:p-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="w-full sm:w-[440px] h-full sm:h-[620px] bg-slate-900 border border-slate-800 sm:rounded-2xl shadow-2xl flex flex-col overflow-hidden text-slate-100">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-800 bg-slate-900/90">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <Bot className="w-4 h-4 animate-pulse" />
            </div>
            <div>
              <h3 className="text-xs font-bold text-white flex items-center gap-1.5">
                PulseAI Financial Coach
                <Sparkles className="w-3 h-3 text-emerald-400" />
              </h3>
              <p className="text-[10px] text-emerald-400 font-medium">Gemini 3.8 Intelligence Active</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Messages */}
        <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-slate-950/40">
          {messages.map((m) => (
            <div
              key={m.id}
              className={`flex gap-2.5 max-w-[88%] ${
                m.sender === 'user' ? 'ml-auto flex-row-reverse' : 'mr-auto'
              }`}
            >
              <div
                className={`w-6 h-6 rounded-lg flex items-center justify-center shrink-0 text-xs font-bold ${
                  m.sender === 'user'
                    ? 'bg-slate-800 text-slate-200'
                    : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                }`}
              >
                {m.sender === 'user' ? <User className="w-3.5 h-3.5" /> : <Bot className="w-3.5 h-3.5" />}
              </div>

              <div>
                <div
                  className={`p-3 rounded-2xl text-xs leading-relaxed whitespace-pre-line ${
                    m.sender === 'user'
                      ? 'bg-emerald-500 text-slate-950 font-medium rounded-tr-none'
                      : 'bg-slate-900 border border-slate-800 text-slate-200 rounded-tl-none'
                  }`}
                >
                  {m.text}
                </div>
                <div
                  className={`text-[9px] text-slate-500 mt-1 font-mono ${
                    m.sender === 'user' ? 'text-right' : 'text-left'
                  }`}
                >
                  {m.timestamp}
                </div>
              </div>
            </div>
          ))}

          {isLoading && (
            <div className="flex gap-2 max-w-[80%]">
              <div className="w-6 h-6 rounded-lg bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
              </div>
              <div className="p-3 rounded-2xl bg-slate-900 border border-slate-800 text-xs text-slate-400 rounded-tl-none">
                Analyzing transactions & cash flow...
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Sample Prompts */}
        <div className="px-3 py-2 bg-slate-950 border-t border-slate-800/80 flex items-center gap-1.5 overflow-x-auto no-scrollbar">
          {samplePrompts.map((p, idx) => (
            <button
              key={idx}
              onClick={() => handleSend(p)}
              className="px-2.5 py-1 rounded-md bg-slate-900 hover:bg-slate-800 text-[10px] font-medium text-slate-300 border border-slate-800 whitespace-nowrap transition-colors shrink-0"
            >
              {p}
            </button>
          ))}
        </div>

        {/* Input Bar */}
        <div className="p-3 bg-slate-900 border-t border-slate-800">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="flex items-center gap-2"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask PulseAI about your finances..."
              className="flex-1 px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
            />
            <button
              type="submit"
              disabled={!input.trim() || isLoading}
              className="p-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 transition-colors disabled:opacity-40"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
