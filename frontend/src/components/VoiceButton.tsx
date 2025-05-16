
import { useVoiceCommand } from "../contexts/VoiceCommandContext";
import { Button } from "@/components/ui/button";
import { Mic, MicOff } from "lucide-react";

interface VoiceButtonProps {
  className?: string;
}

const VoiceButton = ({ className = "" }: VoiceButtonProps) => {
  const { isListening, startListening, stopListening } = useVoiceCommand();

  const toggleListening = () => {
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  };

  return (
    <Button
      onClick={toggleListening}
      className={`rounded-full p-3 ${isListening ? 'mic-active' : 'gradient-btn'} ${className}`}
      aria-label={isListening ? "Stop listening" : "Start listening"}
    >
      {isListening ? <MicOff size={20} /> : <Mic size={20} />}
    </Button>
  );
};

export default VoiceButton;
