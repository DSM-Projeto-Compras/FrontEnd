import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";

interface VoiceTemplateProps {
  isActive: boolean;
  onToggle: () => void;
  hasSpokenActivation: boolean;
  setHasSpokenActivation: (value: boolean) => void;
}

export default function VoiceTemplate({ isActive, onToggle, hasSpokenActivation, setHasSpokenActivation }: VoiceTemplateProps) {
  const [isListening, setIsListening] = useState(false);
  const [lastCommand, setLastCommand] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [micPermission, setMicPermission] = useState<string>("checking");
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const isActiveRef = useRef(isActive);
  const isMountedRef = useRef(true);
  const hasStartedRef = useRef(false);
  const router = useRouter();

  // Atualiza a ref quando isActive muda
  useEffect(() => {
    isActiveRef.current = isActive;
  }, [isActive]);

  // Verificar permissão do microfone
  useEffect(() => {
    const checkMicPermission = async () => {
      try {
        console.log('🔍 Verificando permissão do microfone...');
        console.log('🌐 Navegador:', navigator.userAgent);
        
        // Verificar se a API está disponível
        if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
          console.error('❌ getUserMedia não disponível');
          setMicPermission("denied");
          setError("API de mídia não disponível");
          return;
        }
        
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        console.log('✅ Permissão do microfone concedida');
        console.log('🎙️ Stream de áudio:', stream.getAudioTracks());
        setMicPermission("granted");
        // Para o stream após verificar
        stream.getTracks().forEach(track => {
          console.log('🔇 Parando track:', track.label);
          track.stop();
        });
      } catch (err: any) {
        console.error('❌ Permissão do microfone negada:', err);
        setMicPermission("denied");
        setError(`Permissão negada: ${err.name}`);
      }
    };

    checkMicPermission();
  }, []);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      
      console.log('🔍 Verificando suporte à Web Speech API...');
      console.log('SpeechRecognition:', !!window.SpeechRecognition);
      console.log('webkitSpeechRecognition:', !!window.webkitSpeechRecognition);
      
      if (!SpeechRecognition) {
        console.warn('⚠️ Reconhecimento de voz não disponível neste navegador');
        setError("Reconhecimento de voz não suportado. Tente Chrome ou Edge.");
        return;
      }

      const recognitionInstance = new SpeechRecognition();
      recognitionInstance.continuous = true;
      recognitionInstance.interimResults = true; // Mudado para true para captar resultados parciais
      recognitionInstance.lang = 'pt-BR';

      console.log('⚙️ Configuração:', {
        continuous: recognitionInstance.continuous,
        interimResults: recognitionInstance.interimResults,
        lang: recognitionInstance.lang
      });

      recognitionInstance.onstart = () => {
        console.log('🎤 Reconhecimento de voz iniciado - FALE AGORA!');
        if (isMountedRef.current) {
          setIsListening(true);
          setError("");
        }
      };

      recognitionInstance.onend = () => {
        console.log('🎤 Reconhecimento de voz finalizado');
        if (isMountedRef.current) {
          setIsListening(false);
        }
        
        // Reinicia automaticamente se ainda estiver ativo E o componente ainda estiver montado
        if (isActiveRef.current && isMountedRef.current) {
          console.log('🔄 Reiniciando reconhecimento...');
          setTimeout(() => {
            if (isMountedRef.current && isActiveRef.current && recognitionRef.current) {
              try {
                recognitionRef.current.start();
              } catch (e) {
                console.log('❌ Erro ao reiniciar:', e);
              }
            }
          }, 100);
        }
      };

      recognitionInstance.onaudiostart = () => {
        console.log('🔊 Áudio detectado - Microfone ativo');
        if (isMountedRef.current) {
          setError("");
        }
      };

      recognitionInstance.onsoundstart = () => {
        console.log('🔉 Som detectado - Algum ruído captado');
      };

      recognitionInstance.onspeechstart = () => {
        console.log('🗣️ Fala detectada - Processando voz...');
        if (isMountedRef.current) {
          setError("Processando...");
        }
      };
      
      recognitionInstance.onspeechend = () => {
        console.log('🤐 Fala finalizada');
      };
      
      recognitionInstance.onsoundend = () => {
        console.log('🔇 Som finalizado');
      };
      
      recognitionInstance.onaudioend = () => {
        console.log('🔴 Áudio finalizado');
      };

      recognitionInstance.onresult = (event) => {
        if (!isMountedRef.current) return;
        
        console.log('📊 Resultado recebido - Total de resultados:', event.results.length);
        
        for (let i = event.resultIndex; i < event.results.length; i++) {
          const result = event.results[i];
          const transcript = result[0].transcript.toLowerCase().trim();
          const confidence = result[0].confidence;
          const isFinal = result.isFinal;
          
          console.log(`${isFinal ? '✅ FINAL' : '⏳ Parcial'}:`, transcript, '| Confiança:', confidence);
          
          if (isFinal && isMountedRef.current) {
            setLastCommand(transcript);
            handleVoiceCommand(transcript);
          }
        }
      };

      recognitionInstance.onerror = (event) => {
        console.error('❌ Erro no reconhecimento de voz:', event.error);
        
        if (!isMountedRef.current) {
          console.log('⏹️ Componente desmontado, ignorando erro');
          return;
        }
        
        setError(`Erro: ${event.error}`);
        setIsListening(false);
        
        // Só tenta reiniciar se o componente ainda estiver montado e for erro temporário
        if (event.error !== 'no-speech' && event.error !== 'aborted' && isActiveRef.current && isMountedRef.current) {
          setTimeout(() => {
            if (isMountedRef.current && isActiveRef.current && recognitionRef.current) {
              try {
                recognitionRef.current.start();
              } catch (e) {
                console.log('Erro ao reiniciar após erro:', e);
              }
            }
          }, 1000);
        }
      };

      recognitionInstance.onnomatch = () => {
        console.log('❓ Nenhuma correspondência encontrada');
        if (isMountedRef.current) {
          setError("Comando não reconhecido");
        }
      };

      recognitionRef.current = recognitionInstance;
    }

    return () => {
      console.log('🧹 Limpando reconhecimento de voz...');
      isMountedRef.current = false;
      hasStartedRef.current = false;
      
      if (recognitionRef.current) {
        try {
          // Remove todos os event listeners
          recognitionRef.current.onstart = null;
          recognitionRef.current.onend = null;
          recognitionRef.current.onerror = null;
          recognitionRef.current.onresult = null;
          recognitionRef.current.onaudiostart = null;
          recognitionRef.current.onaudioend = null;
          recognitionRef.current.onsoundstart = null;
          recognitionRef.current.onsoundend = null;
          recognitionRef.current.onspeechstart = null;
          recognitionRef.current.onspeechend = null;
          recognitionRef.current.onnomatch = null;
          
          recognitionRef.current.abort();
          console.log('✅ Reconhecimento abortado com sucesso');
        } catch (e) {
          console.log('Erro ao limpar reconhecimento:', e);
        }
        recognitionRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    isMountedRef.current = true;
    
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  useEffect(() => {
    const recognition = recognitionRef.current;
    
    if (recognition) {
      if (isActive && !hasStartedRef.current) {
        try {
          console.log('🚀 Iniciando reconhecimento de voz...');
          recognition.start();
          hasStartedRef.current = true;
          
          // Só fala se ainda não falou nesta sessão
          if (!hasSpokenActivation) {
            speak("Navegação por voz ativada");
            setHasSpokenActivation(true);
          }
        } catch (e: any) {
          if (e.message.includes('already started')) {
            console.log('⚠️ Reconhecimento já está ativo');
            hasStartedRef.current = true;
          } else {
            console.error('❌ Erro ao iniciar:', e);
            setError(`Erro ao iniciar: ${e.message}`);
          }
        }
      } else if (!isActive && hasStartedRef.current) {
        try {
          recognition.abort();
          hasStartedRef.current = false;
          setIsListening(false);
          // Só fala se estava ativo antes (não na primeira renderização)
          if (isListening) {
            speak("Navegação por voz desativada");
          }
        } catch (e) {
          console.log('Erro ao parar:', e);
        }
      }
    }
  }, [isActive, hasSpokenActivation]);

  const speak = (text: string) => {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'pt-BR';
    utterance.rate = 1;
    utterance.pitch = 1;
    window.speechSynthesis.speak(utterance);
  };

  const handleVoiceCommand = (command: string) => {
    console.log('🎯 Processando comando:', command);
    
    // Verifica se o chatbot está aberto
    // @ts-ignore
    const isChatOpen = typeof window !== 'undefined' && window.isChatbotOpen && window.isChatbotOpen();
    
    // Comandos para fechar o chat (mesmo com chat aberto)
    if (isChatOpen && (command === "chat" || command.includes("fechar chat") || command.includes("fecha chat"))) {
      const chatButton = document.querySelector('button[class*="bottom-5"]') as HTMLButtonElement;
      if (chatButton) {
        chatButton.click();
        speak("Fechando chatbot");
      }
      return;
    }
    
    // Se o chat estiver aberto, envia a mensagem para o chatbot
    if (isChatOpen) {
      console.log('💬 Enviando para chatbot:', command);
      // @ts-ignore
      if (window.chatbotSendMessage) {
        // @ts-ignore
        window.chatbotSendMessage(command);
      }
      return;
    }
    
    // Caso contrário, processa como comando de navegação
    if (command.includes("realizar pedido") || command.includes("pedido") ||  command.includes("home") || command.includes("inicial")) {
      router.push("/pages/requisition");
      speak("Indo para página inicial");
    } else if (command.includes("histórico") || command.includes("historico")) {
      router.push("/pages/historic");
      speak("Indo para histórico");
    } else if (command.includes("voltar")) {
      router.back();
      speak("Voltando");
    } else if (command.includes("avançar") || command.includes("avancar")) {
      router.forward();
      speak("Avançando");
    } else if (command.includes("abrir chat") || command.includes("abre chat") || command === "chat") {
      const chatButton = document.querySelector('button[class*="bottom-5"]') as HTMLButtonElement;
      if (chatButton) {
        chatButton.click();
        speak("Abrindo chatbot");
      }
    } else if (command.includes("cima")) {
      window.scrollBy({ top: -300, behavior: 'smooth' });
      speak("Rolando para cima");
    } else if (command.includes("baixo")) {
      window.scrollBy({ top: 300, behavior: 'smooth' });
      speak("Rolando para baixo");
    } else if (command.includes("ajuda")) {
      speak("Comandos disponíveis: página inicial, histórico, voltar, avançar, chat, cima, baixo");
    } else {
      console.log('❓ Comando não reconhecido:', command);
      speak("Comando não reconhecido");
    }
  };

  return (
    <div className="fixed bottom-24 right-5 z-[1000] flex flex-col gap-2">
      <button
        onClick={onToggle}
        className={`w-14 h-14 rounded-full text-white text-2xl cursor-pointer shadow-lg transition-all hover:scale-110 flex items-center justify-center ${
          isActive ? "bg-green-600 animate-pulse" : "bg-gray-600"
        }`}
        aria-label="Ativar/Desativar navegação por voz"
        title={isActive ? "Navegação por voz ativada" : "Navegação por voz desativada"}
      >
        🎤
      </button>
      
      {/* Indicador de escuta */}
      {isActive && (
        <div className="mt-2 bg-gray-800 text-white text-xs px-3 py-2 rounded-lg shadow-lg max-w-xs">
          <div className="flex items-center gap-2">
            <span className={`w-2 h-2 rounded-full ${isListening ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`}></span>
            <span>{isListening ? 'Escutando...' : 'Aguardando...'}</span>
          </div>
          <div className="mt-1 text-gray-400 text-xs">
            Mic: {micPermission === "granted" ? "✅" : micPermission === "denied" ? "❌ Negado" : "⏳"}
          </div>
          {lastCommand && (
            <div className="mt-1 text-gray-300 truncate">
              Último: {lastCommand}
            </div>
          )}
          {error && (
            <div className="mt-1 text-red-400 text-xs">
              {error}
            </div>
          )}
        </div>
      )}
    </div>
  );
}