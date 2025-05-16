
import { ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import VoiceButton from './VoiceButton';
import { Button } from "@/components/ui/button";
import { MessageSquare, User, LogOut } from 'lucide-react';

interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 shadow-sm">
        <div className="container mx-auto px-4 py-3">
          <div className="flex justify-between items-center">
            <div 
              className="flex items-center cursor-pointer" 
              onClick={() => navigate('/dashboard')}
            >
              <div className="bg-gradient-to-r from-email-primary to-email-secondary p-2 rounded-md mr-2">
                <MessageSquare size={24} className="text-white" />
              </div>
              <h1 className="text-xl font-semibold">VoiceMail</h1>
            </div>
            
            <div className="flex items-center space-x-4">
              <VoiceButton />
              
              <div className="flex items-center">
                <div className="mr-2 flex flex-col items-end">
                  <span className="font-medium text-sm">{user?.name}</span>
                  <span className="text-xs text-gray-500">{user?.email}</span>
                </div>
                <div className="h-8 w-8 bg-email-primary rounded-full flex items-center justify-center text-white">
                  <User size={16} />
                </div>
              </div>
              
              <Button 
                variant="ghost" 
                size="icon"
                onClick={logout} 
                className="text-gray-500 hover:text-email-primary"
              >
                <LogOut size={20} />
              </Button>
            </div>
          </div>
        </div>
      </header>
      
      {/* Main content */}
      <main className="flex-grow container mx-auto px-4 py-6">
        {children}
      </main>
      
      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 py-4">
        <div className="container mx-auto px-4 text-center text-sm text-gray-500">
          <p>VoiceMail - Control your emails with voice commands</p>
          <p className="text-xs mt-1">Try saying "Go to inbox", "Compose email", or "Read email"</p>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
