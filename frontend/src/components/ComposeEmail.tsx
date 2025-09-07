import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Send, Mic, MicOff, X } from 'lucide-react';
import { useSpeechRecognition } from '@/hooks/useSpeechRecognition';
import { useSpeechSynthesis } from '@/hooks/useSpeechSynthesis';
import { cn } from '@/lib/utils';

interface ComposeEmailProps {
  onSend?: (email: { to: string; subject: string; body: string }) => void;
  onClose?: () => void;
  isOpen?: boolean;
}

export const ComposeEmail = ({ onSend, onClose, isOpen = false }: ComposeEmailProps) => {
  const [to, setTo] = useState('');
  const [subject, setSubject] = useState('');
  const [body, setBody] = useState('');
  const [isRecordingBody, setIsRecordingBody] = useState(false);
  const [isSending, setIsSending] = useState(false);

  const { speak } = useSpeechSynthesis();

  const { 
    startListening, 
    stopListening, 
    listening, 
    transcript,
    resetTranscript 
  } = useSpeechRecognition({
    onResult: (result, isFinal) => {
      if (isFinal && result.trim()) {
        if (isRecordingBody) {
          setBody(prev => prev + (prev ? ' ' : '') + result.trim());
          resetTranscript();
          speak('Text added to email body');
        }
      }
    },
    onStart: () => {
      speak('Listening for email content');
    },
    onEnd: () => {
      setIsRecordingBody(false);
    },
    continuous: true
  });

  const handleVoiceToggle = () => {
    if (listening) {
      stopListening();
      setIsRecordingBody(false);
    } else {
      setIsRecordingBody(true);
      startListening();
    }
  };

  const handleSend = async () => {
    if (!to.trim() || !subject.trim() || !body.trim()) {
      speak('Please fill in all fields before sending');
      return;
    }

    setIsSending(true);
    speak('Sending email');

    // Simulate sending
    setTimeout(() => {
      onSend?.({ to: to.trim(), subject: subject.trim(), body: body.trim() });
      setTo('');
      setSubject('');
      setBody('');
      setIsSending(false);
      speak('Email sent successfully');
      onClose?.();
    }, 2000);
  };

  const handleClose = () => {
    if (listening) {
      stopListening();
    }
    setIsRecordingBody(false);
    onClose?.();
  };

  if (!isOpen) return null;

  return (
    <Card className="p-6 border-2 border-accent bg-gradient-primary text-white">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <Send className="h-6 w-6" />
          <h2 className="text-2xl-bold">Compose Email</h2>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={handleClose}
          className="text-white hover:bg-white/20"
          aria-label="Close compose window"
        >
          <X className="h-5 w-5" />
        </Button>
      </div>

      <div className="space-y-6">
        <div>
          <Label htmlFor="to" className="text-bold text-white mb-2 block">
            To
          </Label>
          <Input
            id="to"
            type="email"
            placeholder="recipient@example.com"
            value={to}
            onChange={(e) => setTo(e.target.value)}
            className="border-2 border-white/30 bg-white/10 text-white placeholder:text-white/70 text-bold"
            aria-describedby="to-description"
          />
          <p id="to-description" className="sr-only">
            Enter the recipient's email address
          </p>
        </div>

        <div>
          <Label htmlFor="subject" className="text-bold text-white mb-2 block">
            Subject
          </Label>
          <Input
            id="subject"
            type="text"
            placeholder="Email subject"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            className="border-2 border-white/30 bg-white/10 text-white placeholder:text-white/70 text-bold"
            aria-describedby="subject-description"
          />
          <p id="subject-description" className="sr-only">
            Enter the email subject
          </p>
        </div>

        <div>
          <div className="flex items-center justify-between mb-2">
            <Label htmlFor="body" className="text-bold text-white">
              Message
            </Label>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleVoiceToggle}
              className={cn(
                "text-white border border-white/30",
                listening && "voice-active bg-voice-active"
              )}
              aria-label={listening ? "Stop voice recording" : "Start voice recording"}
            >
              {listening ? (
                <MicOff className="h-4 w-4 mr-1" />
              ) : (
                <Mic className="h-4 w-4 mr-1" />
              )}
              {listening ? 'Stop' : 'Voice'}
            </Button>
          </div>
          
          <Textarea
            id="body"
            placeholder="Type your message or use voice recording..."
            value={body}
            onChange={(e) => setBody(e.target.value)}
            rows={6}
            className="border-2 border-white/30 bg-white/10 text-white placeholder:text-white/70 text-bold resize-none"
            aria-describedby="body-description"
          />
          <p id="body-description" className="sr-only">
            Enter your email message. You can also use voice recording.
          </p>

          {listening && transcript && (
            <div className="mt-2 p-3 bg-white/20 border border-white/30 rounded">
              <p className="text-sm text-white text-bold">
                Recording: "{transcript}"
              </p>
            </div>
          )}
        </div>

        <div className="flex space-x-4">
          <Button
            onClick={handleSend}
            disabled={isSending || !to.trim() || !subject.trim() || !body.trim()}
            size="lg"
            className="flex-1 bg-white text-primary hover:bg-white/90 text-bold btn-glow"
            aria-label="Send email"
          >
            <Send className="h-5 w-5 mr-2" />
            {isSending ? 'Sending...' : 'Send Email'}
          </Button>

          <Button
            variant="ghost"
            onClick={handleClose}
            size="lg"
            className="text-white hover:bg-white/20 border border-white/30 text-bold"
            aria-label="Cancel and close"
          >
            Cancel
          </Button>
        </div>
      </div>
    </Card>
  );
};