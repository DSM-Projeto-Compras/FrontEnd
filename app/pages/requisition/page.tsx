"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import RequisitionTemplate from "../../components/templates/requisition/RequisitionTemplate";
import { useAuth } from "../../contexts/AuthContext";
import { useVoice } from "@/app/contexts/VoiceContext";
import ChatbotTemplate from "../../../app/components/templates/chat-bot/ChatbotTemplate";
import VoiceTemplate from "@/app/components/templates/voice-recognition/VoiceTemplate";

const RequisitionPage: React.FC = () => {
  const { isAuthenticated, loading } = useAuth();
  const { isVoiceActive, toggleVoice, hasSpokenActivation, setHasSpokenActivation } = useVoice();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push("login");
    }
  }, [isAuthenticated, loading, router]);

  if (loading) return null;

  return isAuthenticated ? 
  <>
    <RequisitionTemplate />
    <ChatbotTemplate />
    <VoiceTemplate 
        isActive={isVoiceActive} 
        onToggle={toggleVoice}
        hasSpokenActivation={hasSpokenActivation}
        setHasSpokenActivation={setHasSpokenActivation}
    />
  </>
   : null;
};

export default RequisitionPage;
