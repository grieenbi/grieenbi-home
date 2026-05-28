import { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { HeroCover } from './components/HeroCover';
import { RelayEssay } from './components/RelayEssay';
import { Generator } from './components/Generator';
import { Footer } from './components/Footer';
import { AuthModal } from './components/AuthModal';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { auth } from './firebase';

import { 
  initialRelayPrompt
} from './data/initialData';
import type { 
  RelayPrompt, 
  EssaySentence
} from './data/initialData';

import './App.css';

function App() {
  // Theme State
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    const saved = localStorage.getItem('grieenbi-theme');
    if (saved === 'dark' || saved === 'light') return saved;
    return 'light';
  });

  // Guide Mode State
  const [isGuideMode, setIsGuideMode] = useState<boolean>(() => {
    return localStorage.getItem('grieenbi-guide') === 'true';
  });

  // Auth State
  const [currentUser, setCurrentUser] = useState<{ nickname: string; email: string } | null>(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  // Monitor Firebase Authentication State
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setCurrentUser({
          nickname: user.displayName || '새내기작가',
          email: user.email || ''
        });
      } else {
        // Fallback to bypass admin check locally if saved in localStorage
        const saved = localStorage.getItem('grieenbi-current-user');
        if (saved) {
          try {
            const parsed = JSON.parse(saved);
            if (parsed.email === 'grieenbi@example.com') {
              setCurrentUser(parsed);
              return;
            }
          } catch (e) {
            console.error(e);
          }
        }
        setCurrentUser(null);
      }
    });
    return () => unsubscribe();
  }, []);

  // Relay Essay State
  const [promptData, setPromptData] = useState<RelayPrompt>(() => {
    const saved = localStorage.getItem('grieenbi-relay-prompt');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { console.error(e); }
    }
    return initialRelayPrompt;
  });

  // Blocked Users (Emails) State
  const [blockedEmails, setBlockedEmails] = useState<string[]>(() => {
    const saved = localStorage.getItem('grieenbi-blocked-emails');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { console.error(e); }
    }
    return [];
  });

  // Sync Blocked Emails to LocalStorage
  useEffect(() => {
    localStorage.setItem('grieenbi-blocked-emails', JSON.stringify(blockedEmails));
  }, [blockedEmails]);

  const handleBlockUser = (email: string) => {
    if (!blockedEmails.includes(email)) {
      setBlockedEmails(prev => [...prev, email]);
    }
  };

  const handleUnblockUser = (email: string) => {
    setBlockedEmails(prev => prev.filter(e => e !== email));
  };

  const handleAuthSuccess = (nickname: string, email: string) => {
    const user = { nickname, email };
    setCurrentUser(user);
    if (email === 'grieenbi@example.com') {
      localStorage.setItem('grieenbi-current-user', JSON.stringify(user));
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (e) {
      console.error(e);
    }
    setCurrentUser(null);
    localStorage.removeItem('grieenbi-current-user');
  };

  // External Sentence (for inspiration generator linkage)
  const [externalSentence, setExternalSentence] = useState('');

  // Apply Theme to document element
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('grieenbi-theme', theme);
  }, [theme]);

  // Sync Guide Mode to LocalStorage
  useEffect(() => {
    localStorage.setItem('grieenbi-guide', isGuideMode.toString());
  }, [isGuideMode]);

  // Sync Relay Prompt to LocalStorage
  useEffect(() => {
    localStorage.setItem('grieenbi-relay-prompt', JSON.stringify(promptData));
  }, [promptData]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  // Handler: Add sentence to Relay Essay
  const handleAddSentence = (author: string, content: string) => {
    const newSentence: EssaySentence = {
      id: `s-${Date.now()}`,
      author,
      content,
      likes: 0,
      createdAt: new Date().toISOString()
    };

    setPromptData(prev => ({
      ...prev,
      sentences: [...prev.sentences, newSentence]
    }));
  };

  // Handler: Like a sentence in Relay Essay
  const handleLikeSentence = (sentenceId: string) => {
    setPromptData(prev => ({
      ...prev,
      sentences: prev.sentences.map(s => 
        s.id === sentenceId ? { ...s, likes: s.likes + 1 } : s
      )
    }));
  };

  // Handler: Delete sentence in Relay Essay (Admin only)
  const handleDeleteSentence = (sentenceId: string) => {
    setPromptData(prev => ({
      ...prev,
      sentences: prev.sentences.filter(s => s.id !== sentenceId)
    }));
  };

  // Handler: Hero button click, scroll to relay form
  const handleJoinClick = () => {
    const el = document.getElementById('relay');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div 
      style={styles.appContainer}
      className={isGuideMode ? 'guide-mode-active' : ''}
    >
      <Header 
        theme={theme} 
        toggleTheme={toggleTheme} 
        currentUser={currentUser}
        onLoginClick={() => setIsAuthModalOpen(true)}
        onLogout={handleLogout}
        isGuideMode={isGuideMode}
        onToggleGuideMode={() => setIsGuideMode(prev => !prev)}
      />
      
      <HeroCover 
        promptData={promptData} 
        onJoinClick={handleJoinClick} 
      />

      {/* Main Grid: Single Column Relay Essay Layout */}
      <main style={styles.splitSection}>
        <div style={styles.essayColumn}>
          <RelayEssay 
            promptData={promptData}
            onAddSentence={handleAddSentence}
            onLikeSentence={handleLikeSentence}
            externalSentence={externalSentence}
            onClearExternalSentence={() => setExternalSentence('')}
            currentUserNickname={currentUser ? currentUser.nickname : undefined}
            currentUserEmail={currentUser ? currentUser.email : undefined}
            onLoginClick={() => setIsAuthModalOpen(true)}
            isAdmin={currentUser !== null && (currentUser.email === 'foodyheo@gmail.com' || currentUser.email === 'grieenbi@example.com')}
            blockedEmails={blockedEmails}
            onBlockUser={handleBlockUser}
            onUnblockUser={handleUnblockUser}
            onDeleteSentence={handleDeleteSentence}
          />
        </div>
      </main>

      {/* Oracle inspiration card drawer */}
      <div style={styles.dividerLine} />
      <Generator onSelectPrompt={(text) => setExternalSentence(text)} />

      <Footer />

      {/* Authentication Modal */}
      <AuthModal 
        isOpen={isAuthModalOpen} 
        onClose={() => setIsAuthModalOpen(false)} 
        onAuthSuccess={handleAuthSuccess} 
      />
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  appContainer: {
    maxWidth: '1440px',
    margin: '2rem auto',
    width: '100%',
    boxSizing: 'border-box',
    border: '1px solid var(--grid-line)',
    borderRadius: '16px',
    overflow: 'hidden',
    backgroundColor: 'var(--bg-primary)',
    transition: 'border-color 0.3s ease, background-color 0.3s ease',
  },
  splitSection: {
    display: 'block',
    width: '100%',
  },
  essayColumn: {
    width: '100%',
    height: '100%',
  },
  dividerLine: {
    width: '100%',
    height: '1px',
    backgroundColor: 'var(--grid-line)',
  },
};
export default App;
