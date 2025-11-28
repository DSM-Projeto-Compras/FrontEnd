"use client";

import React, { createContext, useState, useContext, useEffect, useRef } from "react";

interface VoiceContextProps {
  isVoiceActive: boolean;
  setVoiceActive: (active: boolean) => void;
  toggleVoice: () => void;
  hasSpokenActivation: boolean;
  setHasSpokenActivation: (value: boolean) => void;
}

const VoiceContext = createContext<VoiceContextProps | undefined>(undefined);

export const VoiceProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [isVoiceActive, setIsVoiceActive] = useState(false);
  const [hasSpokenActivation, setHasSpokenActivation] = useState(false);

  // Restaura o estado da navegação por voz do localStorage
  useEffect(() => {
    const savedState = localStorage.getItem("voiceNavigationActive");
    if (savedState === "true") {
      setIsVoiceActive(true);
      setHasSpokenActivation(true); // Já foi ativado antes, não precisa falar novamente
    }
  }, []);

  const setVoiceActive = (active: boolean) => {
    setIsVoiceActive(active);
    localStorage.setItem("voiceNavigationActive", active.toString());
    if (!active) {
      setHasSpokenActivation(false);
    }
  };

  const toggleVoice = () => {
    setVoiceActive(!isVoiceActive);
  };

  return (
    <VoiceContext.Provider value={{ isVoiceActive, setVoiceActive, toggleVoice, hasSpokenActivation, setHasSpokenActivation }}>
      {children}
    </VoiceContext.Provider>
  );
};

export const useVoice = () => {
  const context = useContext(VoiceContext);
  if (!context) {
    throw new Error("useVoice deve ser usado dentro de um VoiceProvider");
  }
  return context;
};
