import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Mic, MicOff, Volume2, VolumeX } from 'lucide-react';
import { useSpeechSynthesis } from '@/hooks/useSpeechSynthesis';
import { useSpeechRecognition } from '@/hooks/useSpeechRecognition';
import { cn } from '@/lib/utils';

interface VoiceControlProps {
  onVoiceCommand?: (command: string) => void;
  onStartListening?: () => void;
  onStopListening?: () => void;
}

export const VoiceControl = ({ 
  onVoiceCommand, 
  onStartListening, 
  onStopListening 
}: VoiceControlProps) => {
  const [isVoiceEnabled, setIsVoiceEnabled] = useState(true);

  const { speak, cancel, speaking, supported: speechSupported } = useSpeechSynthesis({
    onStart: () => console.log('Started speaking'),
    onEnd: () => console.log('Finished speaking'),
    onError: (error) => console.error('Speech error:', error)
  });

  const { 
    startListening, 
    stopListening, 
    listening, 
    transcript,
    supported: recognitionSupported 
  } = useSpeechRecognition({
    onResult: (result, isFinal) => {
      if (isFinal && result.trim()) {
        onVoiceCommand?.(result.trim().toLowerCase());
      }
    },
    onStart: () => {
      onStartListening?.();
      speak('Listening for your command');
    },
    onEnd: () => {
      onStopListening?.();
    },
    onError: (error) => {
      console.error('Recognition error:', error);
      speak('Sorry, I had trouble hearing you. Please try again.');
    },
    continuous: false,
    lang: 'en-US'
  });

  const handleMicToggle = () => {
    if (listening) {
      stopListening();
    } else {
      startListening();
    }
  };

  const handleVoiceToggle = () => {
    if (speaking) {
      cancel();
    }
    setIsVoiceEnabled(!isVoiceEnabled);
    speak(isVoiceEnabled ? 'Voice disabled' : 'Voice enabled');
  };

  const speakInstructions = () => {
    const instructions = `Welcome to EchoMail, your voice-controlled email assistant. 
    Press the microphone button and say commands like: 
    "read emails", "compose email", "next email", "previous email", or "help" for more options.`;
    speak(instructions);
  };

  if (!speechSupported || !recognitionSupported) {
    return (
      <Card className="p-6 text-center border-2 border-destructive">
        <h2 className="text-xl-bold text-destructive mb-4">
          Voice Control Not Supported
        </h2>
        <p className="text-bold">
          Your browser doesn't support voice recognition or speech synthesis. 
          Please use a modern browser like Chrome or Edge.
        </p>
      </Card>
    );
  }

  return (
    <Card className="p-6 border-2 border-accent bg-gradient-accent text-white">
      <div className="flex flex-col items-center space-y-6">
        <div className="text-center">
          <h2 className="text-2xl-bold mb-2 text-white">Voice Control</h2>
          <p className="text-bold text-white/90">
            Press the microphone to give voice commands
          </p>
        </div>

        <div className="flex space-x-4">
          <Button
            variant={listening ? "destructive" : "secondary"}
            size="lg"
            onClick={handleMicToggle}
            className={cn(
              "w-16 h-16 rounded-full text-bold btn-glow border-2 border-white",
              listening && "voice-active bg-destructive"
            )}
            aria-label={listening ? "Stop listening" : "Start listening"}
          >
            {listening ? (
              <MicOff className="h-8 w-8" />
            ) : (
              <Mic className="h-8 w-8" />
            )}
          </Button>

          <Button
            variant={isVoiceEnabled ? "secondary" : "outline"}
            size="lg"
            onClick={handleVoiceToggle}
            className="w-16 h-16 rounded-full text-bold btn-glow border-2 border-white"
            aria-label={isVoiceEnabled ? "Disable voice" : "Enable voice"}
          >
            {isVoiceEnabled ? (
              <Volume2 className="h-8 w-8" />
            ) : (
              <VolumeX className="h-8 w-8" />
            )}
          </Button>
        </div>

        {transcript && (
          <div className="w-full p-4 bg-white/20 border-2 border-white/50 rounded-lg">
            <p className="text-bold text-center text-white">
              <span className="sr-only">You said: </span>
              "{transcript}"
            </p>
          </div>
        )}

        <div className="flex flex-col space-y-2 w-full">
          <Button
            variant="outline"
            size="lg"
            onClick={speakInstructions}
            className="text-bold border-2 border-white text-white hover:bg-white hover:text-accent"
          >
            Hear Instructions
          </Button>
          
          <div className="text-center text-sm text-white/80">
            <p className="text-bold">
              Status: {listening ? 'Listening...' : speaking ? 'Speaking...' : 'Ready'}
            </p>
          </div>
        </div>
      </div>
    </Card>
  );
};