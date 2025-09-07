import { useState, useCallback, useRef, useEffect } from 'react';

interface UseSpeechRecognitionOptions {
  onResult?: (transcript: string, isFinal: boolean) => void;
  onStart?: () => void;
  onEnd?: () => void;
  onError?: (error: any) => void;
  continuous?: boolean;
  lang?: string;
}

export const useSpeechRecognition = (options: UseSpeechRecognitionOptions = {}) => {
  const [listening, setListening] = useState(false);
  const [supported, setSupported] = useState(false);
  const [transcript, setTranscript] = useState('');
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    
    if (SpeechRecognition) {
      setSupported(true);
      const recognition = new SpeechRecognition();
      
      recognition.continuous = options.continuous || false;
      recognition.interimResults = true;
      recognition.lang = options.lang || 'en-US';

      recognition.onstart = () => {
        setListening(true);
        options.onStart?.();
      };

      recognition.onend = () => {
        setListening(false);
        options.onEnd?.();
      };

      recognition.onerror = (event: any) => {
        setListening(false);
        options.onError?.(event);
      };

      recognition.onresult = (event: any) => {
        let finalTranscript = '';
        let interimTranscript = '';

        for (let i = event.resultIndex; i < event.results.length; i++) {
          const result = event.results[i];
          if (result.isFinal) {
            finalTranscript += result[0].transcript;
          } else {
            interimTranscript += result[0].transcript;
          }
        }

        const fullTranscript = finalTranscript || interimTranscript;
        setTranscript(fullTranscript);
        options.onResult?.(fullTranscript, !!finalTranscript);
      };

      recognitionRef.current = recognition;
    }
  }, [options]);

  const startListening = useCallback(() => {
    if (recognitionRef.current && !listening) {
      setTranscript('');
      recognitionRef.current.start();
    }
  }, [listening]);

  const stopListening = useCallback(() => {
    if (recognitionRef.current && listening) {
      recognitionRef.current.stop();
    }
  }, [listening]);

  const resetTranscript = useCallback(() => {
    setTranscript('');
  }, []);

  return {
    startListening,
    stopListening,
    resetTranscript,
    listening,
    supported,
    transcript
  };
};