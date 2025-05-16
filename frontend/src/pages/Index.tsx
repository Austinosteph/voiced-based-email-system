
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { MessageSquare, Mic } from 'lucide-react';

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col items-center bg-gradient-to-b from-white to-blue-50">
      {/* Hero section */}
      <header className="w-full py-4 px-6 flex justify-between items-center">
        <div className="flex items-center">
          <div className="bg-gradient-to-r from-email-primary to-email-secondary p-2 rounded-md mr-2">
            <MessageSquare size={24} className="text-white" />
          </div>
          <h1 className="text-xl font-semibold">VoiceMail</h1>
        </div>
        
        <div className="flex gap-4">
          <Button 
            variant="ghost" 
            onClick={() => navigate('/login')}
            className="text-email-primary hover:text-email-secondary"
          >
            Log in
          </Button>
          <Button 
            className="gradient-btn"
            onClick={() => navigate('/signup')}
          >
            Sign up
          </Button>
        </div>
      </header>
      
      <main className="flex-grow w-full max-w-7xl mx-auto px-6 py-16 flex flex-col lg:flex-row items-center">
        <div className="lg:w-1/2 mb-10 lg:mb-0 lg:pr-10">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 leading-tight text-gray-900">
            Control Your Emails with <span className="bg-gradient-to-r from-email-primary to-email-secondary bg-clip-text text-transparent">Your Voice</span>
          </h2>
          
          <p className="text-lg text-gray-600 mb-8">
            Experience a new way to manage your emails using voice commands. Dictate messages, listen to your inbox, and navigate with simple voice instructions.
          </p>
          
          <div className="flex flex-wrap gap-4">
            <Button 
              size="lg" 
              className="gradient-btn text-lg px-8"
              onClick={() => navigate('/signup')}
            >
              Get Started
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              className="text-email-primary border-email-primary hover:bg-email-light"
              onClick={() => navigate('/login')}
            >
              Try Demo
            </Button>
          </div>
        </div>
        
        <div className="lg:w-1/2 relative">
          <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
            <div className="flex items-center mb-6">
              <div className="w-10 h-10 rounded-full bg-email-primary flex items-center justify-center">
                <Mic className="h-5 w-5 text-white" />
              </div>
              <div className="ml-4">
                <h3 className="font-semibold">Voice Commands</h3>
                <p className="text-sm text-gray-500">Just speak naturally</p>
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="p-3 bg-email-light rounded-lg border border-email-primary/20">
                <p className="font-medium text-email-dark">"Compose a new email"</p>
              </div>
              <div className="p-3 bg-gray-50 rounded-lg">
                <p className="font-medium text-gray-700">"Read my latest email"</p>
              </div>
              <div className="p-3 bg-gray-50 rounded-lg">
                <p className="font-medium text-gray-700">"Reply to this message"</p>
              </div>
              <div className="p-3 bg-email-light rounded-lg border border-email-primary/20">
                <p className="font-medium text-email-dark">"Delete this email"</p>
              </div>
            </div>
            
            <div className="flex justify-end mt-6">
              <div className="px-4 py-2 bg-email-primary text-white rounded-full text-sm inline-block">
                Opening compose email...
              </div>
            </div>
          </div>
          
          {/* Decorative elements */}
          <div className="absolute -z-10 w-40 h-40 bg-blue-100 rounded-full top-10 -right-10"></div>
          <div className="absolute -z-10 w-24 h-24 bg-purple-100 rounded-full bottom-10 -left-10"></div>
        </div>
      </main>
      
      {/* Features */}
      <section className="w-full bg-white py-16 px-6">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Key Features</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="p-6 border border-gray-100 rounded-xl shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-full bg-email-light flex items-center justify-center mb-4">
                <Mic className="h-6 w-6 text-email-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Voice Commands</h3>
              <p className="text-gray-600">Navigate your inbox using natural voice commands without touching your keyboard.</p>
            </div>
            
            <div className="p-6 border border-gray-100 rounded-xl shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-full bg-email-light flex items-center justify-center mb-4">
                <MessageSquare className="h-6 w-6 text-email-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Dictate Emails</h3>
              <p className="text-gray-600">Compose emails by speaking naturally with accurate voice-to-text transcription.</p>
            </div>
            
            <div className="p-6 border border-gray-100 rounded-xl shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-full bg-email-light flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6 text-email-primary">
                  <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"></path>
                  <path d="M19 10v2a7 7 0 0 1-14 0v-2"></path>
                  <line x1="12" y1="19" x2="12" y2="23"></line>
                  <line x1="8" y1="23" x2="16" y2="23"></line>
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-3">Listen to Emails</h3>
              <p className="text-gray-600">Have your emails read aloud to you with natural-sounding text-to-speech.</p>
            </div>
          </div>
        </div>
      </section>
      
      {/* CTA */}
      <section className="w-full bg-gradient-to-r from-email-primary to-email-secondary py-16 px-6 text-white">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to experience email in a new way?</h2>
          <p className="text-lg mb-8 text-blue-50">Sign up now and start controlling your inbox with just your voice.</p>
          <Button 
            size="lg"
            variant="secondary"
            className="bg-white text-email-primary hover:bg-blue-50"
            onClick={() => navigate('/signup')}
          >
            Get Started For Free
          </Button>
        </div>
      </section>
      
      {/* Footer */}
      <footer className="w-full bg-gray-900 text-white py-8 px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <div className="flex items-center mb-4">
              <div className="bg-white p-1 rounded-md mr-2">
                <MessageSquare size={20} className="text-email-primary" />
              </div>
              <h3 className="text-xl font-semibold">VoiceMail</h3>
            </div>
            <p className="text-gray-400">Control your emails with your voice.</p>
          </div>
          
          <div>
            <h4 className="font-medium mb-4">Links</h4>
            <ul className="space-y-2 text-gray-400">
              <li><a href="#" className="hover:text-white">About</a></li>
              <li><a href="#" className="hover:text-white">Features</a></li>
              <li><a href="#" className="hover:text-white">Pricing</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-medium mb-4">Legal</h4>
            <ul className="space-y-2 text-gray-400">
              <li><a href="#" className="hover:text-white">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-white">Terms of Service</a></li>
              <li><a href="#" className="hover:text-white">Contact Us</a></li>
            </ul>
          </div>
        </div>
        
        <div className="max-w-7xl mx-auto mt-8 pt-6 border-t border-gray-800 text-center text-gray-500">
          <p>&copy; {new Date().getFullYear()} VoiceMail. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
