import { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { HeroCover } from './components/HeroCover';
import { RelayEssay } from './components/RelayEssay';
import { Generator } from './components/Generator';
import { Footer } from './components/Footer';
import { AuthModal } from './components/AuthModal';
import { MyPageModal } from './components/MyPageModal';
import { ReaderProfileModal } from './components/ReaderProfileModal';
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
  const [isMyPageOpen, setIsMyPageOpen] = useState(false);
  const [isReaderProfileOpen, setIsReaderProfileOpen] = useState(false);
  const [selectedAuthor, setSelectedAuthor] = useState<{
    name: string;
    bio: string;
    joinedAt: string;
    sentences: { id: string; content: string; likes: number }[];
  } | null>(null);

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

  const handleProfileUpdate = (newNickname: string) => {
    if (currentUser) {
      const updatedUser = { ...currentUser, nickname: newNickname };
      setCurrentUser(updatedUser);
      if (currentUser.email === 'grieenbi@example.com') {
        localStorage.setItem('grieenbi-current-user', JSON.stringify(updatedUser));
      }

      // Sync written sentences with new nickname and bio
      const savedBio = localStorage.getItem(`grieenbi-bio-${currentUser.email}`) || '';
      setPromptData(prev => ({
        ...prev,
        sentences: prev.sentences.map(s => {
          if (s.author === currentUser.nickname) {
            return {
              ...s,
              author: newNickname,
              authorBio: savedBio
            };
          }
          return s;
        })
      }));
    }
  };

  const handleWithdrawSuccess = () => {
    setCurrentUser(null);
    localStorage.removeItem('grieenbi-current-user');
  };

  const handleShowReaderProfile = (authorName: string) => {
    // Find all sentences written by this author
    const authorSentences = promptData.sentences.filter(s => s.author === authorName);
    
    // Try to find if any sentence has authorBio / authorJoinedAt
    const sentenceWithBio = promptData.sentences.find(s => s.author === authorName && s.authorBio);
    
    // Fallbacks for mock writers
    const fallbackBios: Record<string, { bio: string; joinedAt: string }> = {
      '은새': { bio: '시의 여백과 바람의 소리를 기록하는 방랑 에세이스트입니다.', joinedAt: '2026.04.12' },
      '북러버': { bio: '책 냄새와 오래된 종이의 질감을 사랑하는 탐독가입니다.', joinedAt: '2026.04.20' },
      '새벽감성': { bio: '가장 깊은 새벽, 홀로 깨어 글을 지어내는 조용한 밤의 작가.', joinedAt: '2026.05.02' },
      '그린비 작가': { bio: '그린비 스튜디오의 명예 작가이자 첫 생각의 기획자.', joinedAt: '2026.05.01' },
      '그린비 작가님': { bio: '그린비 스튜디오의 명예 작가이자 첫 생각의 기획자.', joinedAt: '2026.05.01' },
    };

    const resolvedDetails = sentenceWithBio ? {
      bio: sentenceWithBio.authorBio || '',
      joinedAt: sentenceWithBio.authorJoinedAt || '2026.05.28',
    } : (fallbackBios[authorName] || {
      bio: '생각의 뼈대를 모아 아름다운 소설 문장을 짓는 그린비의 독자 작가입니다.',
      joinedAt: '2026.05.28'
    });

    setSelectedAuthor({
      name: authorName,
      bio: resolvedDetails.bio,
      joinedAt: resolvedDetails.joinedAt,
      sentences: authorSentences
    });
    setIsReaderProfileOpen(true);
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
    const savedBio = localStorage.getItem(`grieenbi-bio-${currentUser?.email}`) || '';
    const joinedDate = new Date().toLocaleDateString('ko-KR', { year: 'numeric', month: '2-digit', day: '2-digit' }).replace(/\.$/, ''); // e.g. 2026.05.28

    const newSentence: EssaySentence = {
      id: `s-${Date.now()}`,
      author,
      content,
      likes: 0,
      createdAt: new Date().toISOString(),
      authorBio: savedBio,
      authorJoinedAt: joinedDate
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

  // Handler: Update Relay Essay Topic (Admin only)
  const handleUpdatePrompt = (newTheme: string, newDescription: string) => {
    setPromptData(prev => ({
      ...prev,
      theme: newTheme,
      description: newDescription
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
        onMyPageClick={() => setIsMyPageOpen(true)}
        onLogout={handleLogout}
        isGuideMode={isGuideMode}
        onToggleGuideMode={() => setIsGuideMode(prev => !prev)}
        isAdmin={currentUser !== null && (currentUser.email === 'foodyheo@gmail.com' || currentUser.email === 'grieenbi@example.com')}
      />
      
      <HeroCover 
        promptData={promptData} 
        onJoinClick={handleJoinClick} 
        isAdmin={currentUser !== null && (currentUser.email === 'foodyheo@gmail.com' || currentUser.email === 'grieenbi@example.com')}
        onUpdatePrompt={handleUpdatePrompt}
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
            onShowReaderProfile={handleShowReaderProfile}
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

      {/* My Page Modal */}
      <MyPageModal
        isOpen={isMyPageOpen}
        onClose={() => setIsMyPageOpen(false)}
        currentUser={currentUser}
        onProfileUpdate={handleProfileUpdate}
        onWithdrawSuccess={handleWithdrawSuccess}
      />

      {/* Reader Profile Modal */}
      {selectedAuthor && (
        <ReaderProfileModal
          isOpen={isReaderProfileOpen}
          onClose={() => {
            setIsReaderProfileOpen(false);
            setSelectedAuthor(null);
          }}
          authorName={selectedAuthor.name}
          authorBio={selectedAuthor.bio}
          authorJoinedAt={selectedAuthor.joinedAt}
          authorSentences={selectedAuthor.sentences}
        />
      )}
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
