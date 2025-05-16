
import { useState, useEffect, useCallback } from 'react';

interface SpeechSynthesisHook {
  speak: (text: string) => void;
  stop: () => void;
  isPlaying: boolean;
  isPaused: boolean;
  pause: () => void;
  resume: () => void;
  voices: SpeechSynthesisVoice[];
  setVoice: (voice: SpeechSynthesisVoice) => void;
  currentVoice: SpeechSynthesisVoice | null;
}

const useSpeechSynthesis = (): SpeechSynthesisHook => {
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [currentVoice, setCurrentVoice] = useState<SpeechSynthesisVoice | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [utterance, setUtterance] = useState<SpeechSynthesisUtterance | null>(null);

  useEffect(() => {
    const synth = window.speechSynthesis;
    const updateVoices = () => {
      const availableVoices = synth.getVoices();
      setVoices(availableVoices);
      
      // Set default voice (prefer English)
      const englishVoice = availableVoices.find(v => v.lang.includes('en-'));
      if (englishVoice && !currentVoice) setCurrentVoice(englishVoice);
    };

    // Update voices immediately if available
    updateVoices();
    
    // Chrome loads voices asynchronously
    if (speechSynthesis.onvoiceschanged !== undefined) {
      speechSynthesis.onvoiceschanged = updateVoices;
    }

    return () => {
      if (synth.speaking) synth.cancel();
    };
  }, []);

  const speak = useCallback((text: string) => {
    const synth = window.speechSynthesis;
    
    // Cancel any ongoing speech
    if (synth.speaking) synth.cancel();
    
    if (text) {
      const newUtterance = new SpeechSynthesisUtterance(text);
      if (currentVoice) newUtterance.voice = currentVoice;
      
      newUtterance.onstart = () => setIsPlaying(true);
      newUtterance.onend = () => setIsPlaying(false);
      newUtterance.onpause = () => setIsPaused(true);
      newUtterance.onresume = () => setIsPaused(false);
      
      synth.speak(newUtterance);
      setUtterance(newUtterance);
    }
  }, [currentVoice]);

  const stop = useCallback(() => {
    const synth = window.speechSynthesis;
    setIsPlaying(false);
    setIsPaused(false);
    synth.cancel();
  }, []);

  const pause = useCallback(() => {
    const synth = window.speechSynthesis;
    if (synth.speaking && !synth.paused) {
      synth.pause();
      setIsPaused(true);
    }
  }, []);

  const resume = useCallback(() => {
    const synth = window.speechSynthesis;
    if (synth.speaking && synth.paused) {
      synth.resume();
      setIsPaused(false);
    }
  }, []);

  const setVoice = useCallback((voice: SpeechSynthesisVoice) => {
    setCurrentVoice(voice);
  }, []);

  return {
    speak,
    stop,
    isPlaying,
    isPaused,
    pause,
    resume,
    voices,
    setVoice,
    currentVoice
  };
};

export default useSpeechSynthesis;
