"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import HistoricTemplate from "../../components/templates/historic/HistoricTemplate";
import VoiceTemplate from "@/app/components/templates/voice-recognition/VoiceTemplate";
import { useAuth } from "../../contexts/AuthContext";
import { useVoice } from "@/app/contexts/VoiceContext";

const HistoricPage: React.FC = () => {
  const { isAuthenticated, loading } = useAuth();
  const { isVoiceActive, toggleVoice, hasSpokenActivation, setHasSpokenActivation } = useVoice();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push("/pages/login");
    }
  }, [isAuthenticated, loading, router]);

  if (loading) return null;

  return isAuthenticated ? 
  <>
  <HistoricTemplate />
  <VoiceTemplate 
        isActive={isVoiceActive} 
        onToggle={toggleVoice}
        hasSpokenActivation={hasSpokenActivation}
        setHasSpokenActivation={setHasSpokenActivation}
    />
  </>
   : null;
};

export default HistoricPage;
