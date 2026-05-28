import React from 'react';
import { Sun, Moon, Feather, Clock } from 'lucide-react';

interface HeaderProps {
  theme: 'light' | 'dark';
  toggleTheme: () => void;
  currentUser: { nickname: string; email: string } | null;
  onLoginClick: () => void;
  onLogout: () => void;
  isGuideMode: boolean;
  onToggleGuideMode: () => void;
  isAdmin?: boolean;
}

export const Header: React.FC<HeaderProps> = ({ 
  theme, 
  toggleTheme, 
  currentUser,
  onLoginClick,
  onLogout,
  isGuideMode,
  onToggleGuideMode,
  isAdmin = false
}) => {
  const currentDate = new Date().toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    weekday: 'short'
  });

  return (
    <header style={styles.header} className="main-header-container" data-guide-label="메인 헤더 박스 (Header)">
      <div style={styles.topBar} className="header-topbar">
        <div style={styles.dateSection} className="header-date-section" data-guide-label="오늘 날짜 인디케이터 (Header - Date)">
          <Clock size={14} style={{ color: 'var(--text-tertiary)' }} />
          <span style={styles.dateText}>{currentDate}</span>
        </div>
        <div style={styles.userActions} className="header-user-actions" data-guide-label="회원 및 도구 제어 섹션 (Header - User & Controls)">
          {currentUser ? (
            <div style={styles.userSession} className="header-user-session">
              <span style={styles.userName}>✒️ <strong>{currentUser.nickname}</strong> 님</span>
              <span style={styles.userDivider}>|</span>
              <button 
                type="button" 
                onClick={onLogout} 
                style={styles.authLinkBtn}
              >
                로그아웃
              </button>
            </div>
          ) : (
            <button 
              type="button" 
              onClick={onLoginClick} 
              style={styles.authLinkBtn}
              className="header-auth-btn"
            >
              로그인 / 회원가입
            </button>
          )}
          
          {/* Guide Mode Toggle Button */}
          {isAdmin && (
            <button 
              type="button"
              onClick={onToggleGuideMode} 
              style={{
                ...styles.guideBtn,
                backgroundColor: isGuideMode ? 'var(--accent-orange)' : 'transparent',
                color: isGuideMode ? '#0A1128' : 'var(--text-primary)',
                borderColor: isGuideMode ? 'var(--accent-orange)' : 'var(--grid-line)'
              }} 
              title={isGuideMode ? '영역 가이드 끄기' : '영역 가이드 켜기'}
              className="header-guide-toggle"
            >
              <span>{isGuideMode ? '🔍 가이드 ON' : '🔍 가이드'}</span>
            </button>
          )}

          <button 
            onClick={toggleTheme} 
            style={styles.themeToggle} 
            title={theme === 'light' ? '다크 모드로 전환' : '라이트 모드로 전환'}
            aria-label="Toggle Theme"
            className="header-theme-toggle"
          >
            {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
          </button>
        </div>
      </div>
      
      <div style={{
        ...styles.mainHeader,
        backgroundImage: theme === 'light' 
          ? 'linear-gradient(rgba(255, 255, 255, 0.46), rgba(255, 255, 255, 0.58)), url("/rainy_bg.png")'
          : 'linear-gradient(rgba(4, 13, 33, 0.52), rgba(4, 13, 33, 0.68)), url("/rainy_bg.png")'
      }} className="header-main-brand" data-guide-label="빗방울 헤더 배너 이미지 (Header - Visual Banner)">
        <div style={styles.logoContainer} className="header-logo-container" data-guide-label="매거진 메인 브랜드 타이틀 로고 (Header - Brand Logo)">
          <Feather size={48} style={styles.featherIcon} className="header-feather-icon" />
          <h1 style={styles.logo} className="header-logo-text">GRIEENBI</h1>
        </div>
        <p style={styles.subtitle} className="header-subtitle-text">
          창작 아카이브
        </p>
      </div>
      
      <nav style={styles.nav} className="header-nav" data-guide-label="매거진 서브 카테고리 내비게이션 바 (Header - Nav Links)">
        <a href="#hero" style={styles.navLink}>Cover</a>
        <span style={styles.navDivider}>/</span>
        <a href="#relay" style={styles.navLink}>Relay Essay</a>
        <span style={styles.navDivider}>/</span>
        <a href="#generator" style={styles.navLink}>Inspiration Generator</a>
      </nav>
    </header>
  );
};

const styles: Record<string, React.CSSProperties> = {
  header: {
    display: 'flex',
    flexDirection: 'column',
    width: '100%',
    borderBottom: '1px solid var(--grid-line)',
    backgroundColor: 'var(--bg-primary)',
    transition: 'border-color 0.3s ease, background-color 0.3s ease',
  },
  topBar: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '0.75rem 2rem',
    borderBottom: '1px solid var(--grid-line)',
    fontSize: '0.8rem',
    color: 'var(--text-secondary)',
    flexWrap: 'wrap',
    gap: '0.5rem',
  },
  userActions: {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
  },
  userSession: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    fontSize: '0.75rem',
  },
  userName: {
    color: 'var(--text-primary)',
  },
  userDivider: {
    color: 'var(--grid-line)',
  },
  authLinkBtn: {
    fontSize: '0.75rem',
    fontWeight: 700,
    cursor: 'pointer',
    color: 'var(--accent-green)',
    transition: 'var(--transition-fast)',
    backgroundColor: 'transparent',
    border: 'none',
  },
  guideBtn: {
    fontSize: '0.75rem',
    fontWeight: 700,
    cursor: 'pointer',
    padding: '0.35rem 0.65rem',
    borderRadius: '6px',
    border: '1px solid var(--grid-line)',
    transition: 'var(--transition-fast)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '0.25rem',
  },
  dateSection: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.375rem',
    letterSpacing: '0.02em',
  },
  dateText: {
    fontWeight: 500,
  },
  statusSection: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    background: 'var(--bg-secondary)',
    padding: '0.25rem 0.75rem',
    borderRadius: '9999px',
    border: '1px solid var(--grid-line)',
  },
  pulseDot: {
    width: '8px',
    height: '8px',
    backgroundColor: 'var(--accent-orange)',
    borderRadius: '50%',
    boxShadow: '0 0 0 0 rgba(255, 76, 41, 0.4)',
    animation: 'pulse 1.8s infinite',
  },
  statusText: {
    fontSize: '0.75rem',
    fontWeight: 500,
  },
  themeToggle: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    color: 'var(--text-primary)',
    padding: '0.375rem',
    borderRadius: '50%',
    transition: 'var(--transition-fast)',
    border: '1px solid transparent',
  },
  mainHeader: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '7rem 2rem 6rem',
    textAlign: 'center',
    backgroundSize: 'cover',
    backgroundPosition: 'center 42%',
    backgroundRepeat: 'no-repeat',
    transition: 'var(--transition-smooth)',
  },
  logoContainer: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
    marginBottom: '0.5rem',
  },
  featherIcon: {
    color: 'var(--accent-green)',
  },
  logo: {
    fontSize: '4.5rem',
    fontFamily: 'var(--font-serif)',
    fontWeight: 700,
    letterSpacing: '-0.05em',
    color: 'var(--text-primary)',
    textTransform: 'uppercase',
  },
  subtitle: {
    fontSize: '1.1rem',
    color: 'var(--text-secondary)',
    letterSpacing: '0.25em',
    textTransform: 'uppercase',
    fontWeight: 500,
  },
  italicSub: {
    color: 'var(--accent-green)',
    marginLeft: '0.25rem',
  },
  nav: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    gap: '1rem',
    padding: '1.25rem 2rem',
    borderTop: '1px solid var(--grid-line)',
    flexWrap: 'wrap',
  },
  navLink: {
    fontSize: '0.85rem',
    fontWeight: 700,
    textTransform: 'uppercase',
    letterSpacing: '0.08em',
    color: 'var(--text-secondary)',
    transition: 'var(--transition-fast)',
    padding: '0.25rem 0.5rem',
  },
  navDivider: {
    color: 'var(--grid-line)',
    userSelect: 'none',
  },
};
