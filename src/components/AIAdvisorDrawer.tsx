import React, { useState, useRef, useEffect } from 'react';
import {
  MessageSquare,
  X,
  Send,
  Bot,
  User,
  Sparkles,
  TrendingUp,
  Landmark,
  Building,
  HelpCircle,
  Briefcase
} from 'lucide-react';
import { useGame } from '../context/GameContext';
import { formatCurrency } from '../utils/formatters';

export const AIAdvisorDrawer: React.FC = () => {
  const {
    chatMessages,
    isAdvisorLoading,
    sendAdvisorMessage,
    isAdvisorOpen,
    setIsAdvisorOpen,
    netWorth,
    cash,
    incomePerHour,
    currentTitle
  } = useGame();

  const [inputVal, setInputVal] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isAdvisorOpen) {
      scrollToBottom();
    }
  }, [chatMessages, isAdvisorOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputVal.trim() || isAdvisorLoading) return;
    const msg = inputVal;
    setInputVal('');
    sendAdvisorMessage(msg);
  };

  const quickQuestions = [
    "What should be my next strategic investment?",
    "How does the current market wire affect my assets?",
    "Should I buy more stocks or acquire commercial properties?",
    "Analyze my balance sheet and hourly cash flow."
  ];

  return (
    <>
      {/* Floating Executive AI Button */}
      <button
        onClick={() => setIsAdvisorOpen(true)}
        className="fixed bottom-6 right-6 z-40 flex items-center gap-2.5 px-4 py-3 rounded-full bg-gradient-to-r from-amber-500 via-amber-600 to-amber-500 text-neutral-950 font-bold text-xs shadow-xl shadow-amber-500/20 hover:scale-105 active:scale-95 transition-all cursor-pointer border border-amber-400/40 select-none"
      >
        <Bot className="w-4 h-4 text-neutral-950 animate-bounce" />
        <span className="font-semibold tracking-wide">ADVISOR STERLING</span>
        <span className="w-2 h-2 rounded-full bg-emerald-950 animate-pulse" />
      </button>

      {/* Drawer Overlay */}
      {isAdvisorOpen && (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="w-full max-w-lg bg-neutral-950 border-l border-neutral-800 flex flex-col h-full shadow-2xl animate-in slide-in-from-right duration-200">
            {/* Header */}
            <div className="p-4 sm:p-5 border-b border-neutral-800 bg-neutral-900 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
                  <Bot className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-neutral-100 font-['Cinzel',serif] flex items-center gap-2">
                    Archibald Sterling
                    <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded border border-emerald-500/20">
                      LIVE CONTEXT
                    </span>
                  </h3>
                  <p className="text-xs text-neutral-400">
                    Senior Partner & Corporate Strategic Advisor
                  </p>
                </div>
              </div>

              <button
                onClick={() => setIsAdvisorOpen(false)}
                className="p-2 rounded-lg bg-neutral-950 text-neutral-400 hover:text-neutral-200 border border-neutral-800 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Live Context Strip */}
            <div className="px-4 py-2 bg-neutral-900/60 border-b border-neutral-850 flex items-center justify-between text-[11px] font-mono">
              <span className="text-neutral-400">
                Cash: <strong className="text-emerald-400">{formatCurrency(cash)}</strong>
              </span>
              <span className="text-neutral-400">
                Net: <strong className="text-amber-400">{formatCurrency(netWorth)}</strong>
              </span>
              <span className="text-neutral-400">
                Income: <strong className="text-emerald-300">+{formatCurrency(incomePerHour)}/hr</strong>
              </span>
            </div>

            {/* Messages Scroll Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 text-xs">
              {chatMessages.map(msg => {
                const isUser = msg.role === 'user';
                return (
                  <div
                    key={msg.id}
                    className={`flex gap-3 ${isUser ? 'justify-end' : 'justify-start'}`}
                  >
                    {!isUser && (
                      <div className="w-7 h-7 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0 mt-0.5">
                        <Bot className="w-4 h-4" />
                      </div>
                    )}

                    <div
                      className={`max-w-[85%] rounded-2xl p-3.5 leading-relaxed ${
                        isUser
                          ? 'bg-amber-500 text-neutral-950 font-medium rounded-tr-none'
                          : 'bg-neutral-900 border border-neutral-800 text-neutral-200 rounded-tl-none space-y-2'
                      }`}
                    >
                      <p className="whitespace-pre-wrap">{msg.text}</p>
                    </div>

                    {isUser && (
                      <div className="w-7 h-7 rounded-lg bg-neutral-800 border border-neutral-700 flex items-center justify-center text-neutral-300 shrink-0 mt-0.5">
                        <User className="w-4 h-4" />
                      </div>
                    )}
                  </div>
                );
              })}

              {isAdvisorLoading && (
                <div className="flex gap-3 justify-start items-center">
                  <div className="w-7 h-7 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0">
                    <Bot className="w-4 h-4 animate-spin" />
                  </div>
                  <div className="bg-neutral-900 border border-neutral-800 rounded-2xl rounded-tl-none p-3 text-neutral-400 text-xs flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-ping" />
                    <span>Sterling is reviewing financial markets & portfolio telemetry...</span>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Quick Questions Chips */}
            <div className="px-4 py-2 border-t border-neutral-850 bg-neutral-900/40">
              <span className="text-[10px] font-semibold text-neutral-500 uppercase tracking-wider block mb-1.5">
                Suggested Directives:
              </span>
              <div className="flex gap-1.5 overflow-x-auto pb-1 no-scrollbar">
                {quickQuestions.map((q, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      sendAdvisorMessage(q);
                    }}
                    disabled={isAdvisorLoading}
                    className="px-2.5 py-1 text-[11px] rounded-lg bg-neutral-900 hover:bg-neutral-850 border border-neutral-800 text-neutral-400 hover:text-neutral-200 whitespace-nowrap transition-colors"
                  >
                    {q}
                  </button>
                ))}
              </div>
            </div>

            {/* Input Form */}
            <form onSubmit={handleSubmit} className="p-3 sm:p-4 border-t border-neutral-800 bg-neutral-900 flex gap-2">
              <input
                type="text"
                value={inputVal}
                onChange={e => setInputVal(e.target.value)}
                placeholder="Ask Archibald Sterling about investments, news, or strategy..."
                className="flex-1 bg-neutral-950 border border-neutral-800 rounded-xl px-3.5 py-2.5 text-xs text-neutral-100 placeholder:text-neutral-600 focus:outline-none focus:border-amber-500/60"
              />
              <button
                type="submit"
                disabled={!inputVal.trim() || isAdvisorLoading}
                className="px-4 py-2.5 bg-amber-500 hover:bg-amber-400 disabled:bg-neutral-800 disabled:text-neutral-600 text-neutral-950 font-bold rounded-xl text-xs transition-colors flex items-center justify-center shrink-0"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
};
