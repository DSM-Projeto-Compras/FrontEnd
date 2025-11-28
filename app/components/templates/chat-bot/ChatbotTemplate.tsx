import React, { useState, useRef, useEffect } from "react";
import ChatService from "../../../../app/services/chatService";

interface Message {
  type: "user" | "bot";
  content: string;
}

export default function ChatbotTemplate() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [hasGreeted, setHasGreeted] = useState(false);
  const chatRef = useRef<HTMLDivElement>(null);

  // Expõe funções globalmente para o VoiceTemplate usar
  useEffect(() => {
    // @ts-ignore
    window.chatbotSendMessage = (message: string) => {
      if (isOpen) {
        sendMessageFromVoice(message);
      }
    };
    // @ts-ignore
    window.isChatbotOpen = () => isOpen;

    return () => {
      // @ts-ignore
      delete window.chatbotSendMessage;
      // @ts-ignore
      delete window.isChatbotOpen;
    };
  }, [isOpen, messages]);

  // Scroll automático para o final das mensagens
  useEffect(() => {
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }
  }, [messages]);

  useEffect(() => {
    if (isOpen && !hasGreeted) {
      ChatService.greet()
        .then(result => {
          setMessages(prev => [...prev, { type: "bot", content: result.reply }]);
          setHasGreeted(true);
        })
        .catch(err => console.error("Erro ao buscar saudação:", err));
    }
  }, [isOpen]);

  const toggleChat = () => {
    setIsOpen(prev => !prev);
  };

  const sendMessage = async () => {
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      type: "user",
      content: inputValue
    };

    setMessages(prev => [...prev, userMessage]);

    try {
      const result = await ChatService.sendMessage(inputValue);

      const botMessage: Message = {
        type: "bot",
        content: result.reply
      };

      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      const errorMessage: Message = {
        type: "bot",
        content: "Desculpe, ocorreu um erro. Tente novamente."
      };
      setMessages(prev => [...prev, errorMessage]);
    }

    setInputValue("");
  };

  // Função para enviar mensagem de voz
  const sendMessageFromVoice = async (messageText: string) => {
    if (!messageText.trim()) return;

    const userMessage: Message = {
      type: "user",
      content: messageText
    };

    setMessages(prev => [...prev, userMessage]);

    try {
      const result = await ChatService.sendMessage(messageText);

      const botMessage: Message = {
        type: "bot",
        content: result.reply
      };

      setMessages(prev => [...prev, botMessage]);
      
      // Lê a resposta do bot em voz alta
      const utterance = new SpeechSynthesisUtterance(result.reply);
      utterance.lang = 'pt-BR';
      window.speechSynthesis.speak(utterance);
    } catch (error) {
      const errorMessage: Message = {
        type: "bot",
        content: "Desculpe, ocorreu um erro. Tente novamente."
      };
      setMessages(prev => [...prev, errorMessage]);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      sendMessage();
    }
  };

  return (
    <>
      {/* Botão flutuante */}
      <button
        onClick={toggleChat}
        className={`fixed bottom-5 right-5 w-14 h-14 rounded-full bg-blue-600 text-white text-2xl cursor-pointer shadow-lg z-[1000] transition-transform hover:scale-110 ${
          isOpen ? "hidden" : "flex"
        } items-center justify-center`}
      >
        💬
      </button>

      {/* Container do chat */}
      <div
        className={`fixed bottom-5 right-5 w-[350px] h-[500px] bg-white rounded-lg shadow-xl z-[1000] flex-col ${
          isOpen ? "flex" : "hidden"
        }`}
      >
        {/* Cabeçalho */}
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
          className="flex-1 overflow-y-auto p-4 bg-gray-100 whitespace-pre-line"
        >
          {messages.map((message, index) => (
            <div
              key={index}
              className={`w-full flex ${
                message.type === "user" ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`p-2 px-3 rounded-2xl my-1 max-w-[70%] w-fit ${
                  message.type === "user"
                    ? "bg-blue-600 text-white"
                    : "bg-white text-gray-800 shadow-sm"
                }`}
              >
                {message.content}
              </div>
            </div>
          ))}
        </div>

        {/* Área de input */}
        <div className="p-4 bg-white rounded-b-lg flex gap-2">
          <input
            type="text"
            value={inputValue}
            onChange={e => setInputValue(e.target.value)}
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