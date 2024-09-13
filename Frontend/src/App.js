import React, { useState } from 'react';
import './App.css';
import NavBar from './Components/NavBar';

import WelcomeMessage from './Components/WelcomeMessages';

import Text2TaleGenerator from './Components/DocumentUpload';

import Footer from './Components/Footer';

// import Chatbot from './Components/Chat';

// import { MessageCircle } from 'lucide-react'; // Import the MessageCircle icon from lucide-react

function App() {
  const [activeTab, setActiveTab] = useState('home');

  const handleNavClick = (tabId) => {
    setActiveTab(tabId);
  };

  return (
    <div className="app">
      <NavBar onNavClick={handleNavClick} activeTab={activeTab} />
      <main className="main-content">
        {activeTab === 'home' && <WelcomeMessage />}
        {activeTab === 'document-upload' && <Text2TaleGenerator />}
        {/* {activeTab === 'chat-bot' && <Chatbot />} */}

      </main>
      <div className="chat-icon-container">
    
      </div>
      <Footer />
    </div>
  );
}

export default App;

