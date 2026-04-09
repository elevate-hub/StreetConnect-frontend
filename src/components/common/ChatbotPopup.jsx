import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, X } from 'lucide-react';

const chatbotData = {
  questions: {
    vendor_register: "How to register as vendor?",
    delivery: "How does delivery work?",
    track_order: "How to track my order?",
    popular_items: "What are popular items near me?",
    earn_vendor: "How to earn more as vendor?"
  },
  answers: {
    vendor_register: "You can register by signing up as a vendor and submitting required documents.",
    delivery: "We assign delivery partners based on location and availability.",
    track_order: "You can track your order in real-time from the orders section.",
    popular_items: "We show trending items based on your nearby activity. Here are some recommended items: Pizza, Burger, Sushi.",
    earn_vendor: "Improve ratings, offer discounts, and keep items in stock."
  }
};

const ChatbotPopup = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { type: 'bot', text: 'Hello! I\'m your AI Assistant. How can I help you today?' }
  ]);
  const [availableQuestions, setAvailableQuestions] = useState(Object.keys(chatbotData.questions));
  const chatRef = useRef(null);

  useEffect(() => {
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }
  }, [messages]);

  const handleQuestionClick = (key) => {
    const question = chatbotData.questions[key];
    const answer = chatbotData.answers[key];

    setMessages(prev => [...prev, { type: 'user', text: question }, { type: 'bot', text: answer }]);
    setAvailableQuestions(prev => prev.filter(q => q !== key));
  };

  return (
    <>
      {/* Floating Button */}
      <motion.button
        className="fixed bottom-4 right-4 bg-blue-500 hover:bg-blue-600 text-white p-4 rounded-full shadow-lg z-50"
        onClick={() => setIsOpen(!isOpen)}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
      >
        <MessageCircle size={24} />
      </motion.button>

      {/* Chat Popup */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            transition={{ duration: 0.2 }}
            className="fixed bottom-16 right-4 w-80 h-96 bg-white rounded-lg shadow-xl border z-50 flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b bg-blue-500 text-white rounded-t-lg">
              <h3 className="font-semibold">AI Assistant</h3>
              <button onClick={() => setIsOpen(false)} className="hover:bg-blue-600 p-1 rounded">
                <X size={20} />
              </button>
            </div>

            {/* Chat Area */}
            <div ref={chatRef} className="flex-1 p-4 overflow-y-auto space-y-3">
              {messages.map((msg, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-xs px-3 py-2 rounded-lg ${
                      msg.type === 'user'
                        ? 'bg-blue-500 text-white'
                        : 'bg-gray-200 text-gray-800'
                    }`}
                  >
                    {msg.text}
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Questions */}
            {availableQuestions.length > 0 && (
              <div className="p-4 border-t space-y-2">
                {availableQuestions.map(key => (
                  <button
                    key={key}
                    onClick={() => handleQuestionClick(key)}
                    className="w-full text-left p-2 bg-gray-100 hover:bg-gray-200 rounded text-sm transition-colors"
                  >
                    {chatbotData.questions[key]}
                  </button>
                ))}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default ChatbotPopup;