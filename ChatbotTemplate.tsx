import React, { useState, useRef, useEffect } from 'react';

interface Message {
  type: 'user' | 'bot';
  content: string;
}

export default function ChatbotTemplate() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const chatRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }
  }, [messages]);

  const toggleChat = () => {
    setIsOpen(!isOpen);
  };

  const sendMessage = async () => {
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      type: 'user',
      content: inputValue
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');

    try {
      const res = await fetch('http://localhost:3000/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: inputValue })
      });
      const data = await res.json();
      
      const botMessage: Message = {
        type: 'bot',
        content: data.reply
      };
      
      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      const errorMessage: Message = {
        type: 'bot',
        content: 'Desculpe, ocorreu um erro. Tente novamente.'
      };
      setMessages(prev => [...prev, errorMessage]);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      sendMessage();
    }
  };

  return (
    <>
      {/* Botão flutuante */}
      <button
        onClick={toggleChat}
        className={`fixed bottom-5 right-5 w-15 h-15 rounded-full bg-blue-600 text-white text-2xl cursor-pointer shadow-lg z-[1000] transition-transform hover:scale-110 ${isOpen ? 'hidden' : 'flex'} items-center justify-center`}
      >
        💬
      </button>

      {/* Container do chat */}
      <div
        className={`fixed bottom-5 right-5 w-[350px] h-[500px] bg-white rounded-lg shadow-xl z-[1000] flex-col ${isOpen ? 'flex' : 'hidden'}`}
      >
        {/* Cabeçalho do chat */}
        <div className="bg-blue-600 text-white p-4 rounded-t-lg flex justify-between items-center">
          <h3 className="m-0 text-base font-semibold">Assistente Virtual GPC</h3>
          <button
            onClick={toggleChat}
            className="bg-transparent border-none text-white text-2xl cursor-pointer hover:opacity-80"
          >
            ×
          </button>
        </div>

        {/* Área de mensagens */}
        <div
          ref={chatRef}
          className="flex-1 overflow-y-auto p-4 bg-gray-100"
        >
          {messages.map((message, index) => (
            <div
              key={index}
              className={`${
                message.type === 'user'
                  ? 'bg-blue-600 text-white ml-auto text-right'
                  : 'bg-white text-gray-800 shadow-sm'
              } p-2 px-3 rounded-2xl my-2 max-w-[70%] block`}
            >
              {message.content}
            </div>
          ))}
        </div>

        {/* Área de input */}
        <div className="p-4 bg-white rounded-b-lg flex gap-2">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Digite sua mensagem..."
            className="flex-1 p-2 px-4 border border-gray-300 rounded-full outline-none focus:border-blue-500"
          />
          <button
            onClick={sendMessage}
            className="bg-blue-600 text-white border-none py-2 px-5 rounded-full cursor-pointer hover:bg-blue-700 transition-colors"
          >
            Enviar
          </button>
        </div>
      </div>
    </>
  );
}