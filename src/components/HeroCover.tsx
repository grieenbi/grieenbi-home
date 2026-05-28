import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, ArrowRight, Quote } from 'lucide-react';
import type { RelayPrompt, EssaySentence } from '../data/initialData';

interface HeroCoverProps {
  promptData: RelayPrompt;
  onJoinClick: () => void;
  isAdmin?: boolean;
  onUpdatePrompt?: (theme: string, description: string) => void;
}

const getDynamicFontSize = (text: string) => {
  const len = text.length;
  if (len <= 15) return '1.8rem';
  if (len <= 25) return '1.5rem';
  if (len <= 35) return '1.25rem';
  if (len <= 45) return '1.1rem';
  return '0.95rem';
};

const getDynamicFontSizeMobile = (text: string) => {
  const len = text.length;
  if (len <= 15) return '1.25rem';
  if (len <= 25) return '1.1rem';
  if (len <= 35) return '0.95rem';
  if (len <= 45) return '0.85rem';
  return '0.75rem';
};

export const HeroCover: React.FC<HeroCoverProps> = ({ 
  promptData, 
  onJoinClick,
  isAdmin = false,
  onUpdatePrompt
}) => {
  const bestSentences = promptData.sentences.filter(s => s.isBest);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editTheme, setEditTheme] = useState(promptData.theme);
  const [editDesc, setEditDesc] = useState(promptData.description);

  // Sync edits if promptData changes from outside
  useEffect(() => {
    setEditTheme(promptData.theme);
    setEditDesc(promptData.description);
  }, [promptData.theme, promptData.description]);

  // Rotate best sentences if multiple exist and not paused
  useEffect(() => {
    if (bestSentences.length <= 1 || isPaused) return;
    const interval = setInterval(() => {
      setActiveIndex(prev => (prev + 1) % bestSentences.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [bestSentences.length, isPaused]);

  const activeSentence: EssaySentence | undefined = bestSentences[activeIndex] || promptData.sentences[0];

  return (
    <section id="hero" style={styles.heroSection} data-guide-label="히어로 커버 섹션 (HeroCover)">
      <div style={styles.gridContainer}>
        {/* Right Side: Creative Spark & Prompt Intro (Now Left) */}
        <div style={styles.promptPanel} data-guide-label="에세이 주제 소개 패널 (HeroCover - Prompt Panel)">
          <div style={styles.sparkBadgeContainer}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
              <div className="badge badge-orange">
                <Sparkles size={12} />
                <span>릴레이 에세이 주제</span>
              </div>
              
              {isAdmin && !isEditing && (
                <button
                  type="button"
                  onClick={() => {
                    setEditTheme(promptData.theme);
                    setEditDesc(promptData.description);
                    setIsEditing(true);
                  }}
                  style={styles.adminEditBtn}
                >
                  📝 주제 수정
                </button>
              )}
            </div>
          </div>
          
          {isEditing ? (
            <div style={styles.editForm}>
              <div style={styles.editInputGroup}>
                <label style={styles.editLabel}>주제 타이틀 (Theme)</label>
                <input
                  type="text"
                  value={editTheme}
                  onChange={(e) => setEditTheme(e.target.value)}
                  style={styles.editInput}
                  maxLength={50}
                  placeholder="새로운 에세이 주제 타이틀 입력..."
                />
              </div>
              
              <div style={styles.editInputGroup}>
                <label style={styles.editLabel}>주제 상세 설명 (Description)</label>
                <textarea
                  value={editDesc}
                  onChange={(e) => setEditDesc(e.target.value)}
                  style={styles.editTextarea}
                  maxLength={200}
                  placeholder="새로운 에세이 첫 시작점 및 상세 설명 입력..."
                />
              </div>
              
              <div style={styles.editActionRow}>
                <button
                  type="button"
                  onClick={() => {
                    if (!editTheme.trim() || !editDesc.trim()) {
                      alert('주제 타이틀과 상세 설명을 모두 입력해 주세요.');
                      return;
                    }
                    if (onUpdatePrompt) {
                      onUpdatePrompt(editTheme.trim(), editDesc.trim());
                    }
                    setIsEditing(false);
                  }}
                  style={styles.editSaveBtn}
                >
                  💾 저장 완료
                </button>
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  style={styles.editCancelBtn}
                >
                  ❌ 취소
                </button>
              </div>
            </div>
          ) : (
            <>
              <h2 style={styles.promptTheme} className="serif-title">
                {promptData.theme}
              </h2>
              
              <p style={styles.promptDesc}>
                {promptData.description}
              </p>
            </>
          )}

          <div style={styles.metaRow} data-guide-label="참여 통계 및 인디케이터 (HeroCover - Stats Row)">
            <div style={styles.metaItem}>
              <span style={styles.metaLabel}>진행 상태</span>
              <span style={styles.metaValue}>실시간 문장 수집 중 ✒️</span>
            </div>
            <div style={styles.metaItem}>
              <span style={styles.metaLabel}>현재 참여작</span>
              <span style={styles.metaValue}>{promptData.sentences.length}개 문장 축적됨</span>
            </div>
          </div>

          <button onClick={onJoinClick} className="btn-primary" style={styles.actionBtn} data-guide-label="에세이 잇기 버튼 (HeroCover - Action Button)">
            <span>이 문장 뒤에 이어 쓰기</span>
            <ArrowRight size={16} />
          </button>
        </div>

        {/* Left Side: Weekly Cover Feature (Now Right) */}
        <div style={styles.coverPanel} data-guide-label="위클리 마스터피스 롤링 보드 (HeroCover - Masterpiece)">
          <div style={styles.coverHeader}>
            <span style={styles.magazineLabel}>Weekly Masterpiece</span>
            <div style={styles.lineDecorative} />
          </div>
          
          <div 
            style={{
              ...styles.quoteWrapper,
              cursor: 'pointer',
              opacity: isPaused ? 0.9 : 1,
            }}
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
            title="마우스를 올리면 문장 순환이 일시정지됩니다."
            data-guide-label="마스터피스 롤링 텍스트 영역 (HeroCover - Rolling Text)"
          >
            <Quote size={40} style={styles.quoteIcon} />
            <AnimatePresence mode="wait">
              {activeSentence && (
                    <motion.div
      key={activeSentence.id}
      initial={{ opacity: 0, y: 30 }} // start slightly below
      animate={{ opacity: 1, y: 0 }} // slide up into view
      exit={{ opacity: 0, y: -30 }} // exit upwards
      transition={{ duration: 0.9, ease: [0.25, 0.8, 0.25, 1] }}
      style={styles.sentenceContainer}
    >
                  <p 
                    className="serif-title best-sentence-text-dynamic" 
                    style={{
                      ...styles.bestSentenceText,
                      '--best-font-size-desktop': getDynamicFontSize(activeSentence.content),
                      '--best-font-size-mobile': getDynamicFontSizeMobile(activeSentence.content),
                      marginBottom: activeSentence.content.length > 30 ? '0.8rem' : '1.8rem'
                    } as React.CSSProperties}
                  >
                    "{activeSentence.content}"
                  </p>
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4 }}
                    style={styles.authorBadge}
                  >
                    <span style={styles.authorLine} />
                    <span style={styles.authorName}>독자 {activeSentence.author} 님의 문장</span>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          
          <div style={styles.coverFooter}>
            <span style={styles.volumeText}>ISSUE NO. 12 // SPRING 2026</span>
          </div>
        </div>
      </div>
    </section>
  );
};

const styles: Record<string, React.CSSProperties> = {
  heroSection: {
    width: '100%',
    backgroundColor: 'var(--bg-primary)',
    borderBottom: '1px solid var(--grid-line)',
    boxSizing: 'border-box',
  },
  gridContainer: {
    display: 'grid',
    gridTemplateColumns: '1.3fr 0.7fr', // ~10% smaller than previous enlargement
    minHeight: '450px', // reduced from 500px
  },
  coverPanel: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    padding: '3.2rem 2.8rem', // slightly reduced padding
    borderRight: '1px solid var(--grid-line)',
    backgroundColor: 'rgba(38, 22, 15, 0.8)', /* 20% transparent dark walnut */
    position: 'relative',
    overflow: 'visible',
    boxShadow: 'inset 0 0 40px rgba(0, 0, 0, 0.4)',
    transition: 'var(--transition-smooth)',
  },
  coverHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
  },
  magazineLabel: {
    fontSize: '0.75rem',
    fontWeight: 800,
    textTransform: 'uppercase',
    letterSpacing: '0.15em',
    color: '#A1887F', /* Light wood beige */
  },
  lineDecorative: {
    flex: 1,
    height: '1px',
    backgroundColor: '#4E342E', /* Deep wood line */
  },
  quoteWrapper: {
    margin: '2.5rem 0',
    position: 'relative',
    height: '240px', // Prevent Cumulative Layout Shift (CLS)
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'visible', // Ensure contents can render slightly outside without clipping
  },
  quoteIcon: {
    color: 'rgba(252, 185, 0, 0.15)', /* Transparent golden shine */
    position: 'absolute',
    top: '-35px',
    left: '-15px',
    zIndex: 0,
  },
    sentenceContainer: {
        position: 'relative',
        zIndex: 1,
        minHeight: '200px', // Maintain minimum height
        height: 'auto', // Allow it to size naturally so it doesn't clip
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'visible', // NEVER chop off text at top or bottom
        whiteSpace: 'normal',
        textAlign: 'center',
        padding: '0 0.5rem',
        boxSizing: 'border-box',
    },
  bestSentenceText: {
    fontSize: 'clamp(1.5rem, 3vw, 2.4rem)', // responsive to keep box size stable
    lineHeight: '1.55',
    color: '#F5F2EB', /* High-contrast warm ivory */
    letterSpacing: '-0.02em',
    marginBottom: '1.8rem',
    wordBreak: 'keep-all',
  },
  authorBadge: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
  },
  authorLine: {
    width: '24px',
    height: '1px',
    backgroundColor: 'var(--accent-orange)',
  },
  authorName: {
    fontSize: '0.9rem',
    fontWeight: 600,
    color: '#D7CCC8', /* Soft woody rose */
    letterSpacing: '0.02em',
  },
  coverFooter: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    fontSize: '0.75rem',
    fontWeight: 700,
    color: '#8D6E63', /* Muted oak brown */
    letterSpacing: '0.05em',
  },
  promptPanel: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    padding: '3.5rem 3rem',
    background: 'linear-gradient(135deg, #0A1128 0%, #002C6C 100%)', // premium deep royal tech navy
    color: '#F5F2EB', // warm ivory for high-contrast elite editorial tone
    borderLeft: '5px solid var(--accent-orange)', // striking amber gold left border anchor
    boxShadow: 'inset -15px 0 35px rgba(0, 0, 0, 0.3), 0 10px 30px rgba(10, 17, 40, 0.08)',
  },
  sparkBadgeContainer: {
    marginBottom: '1.25rem',
  },
  promptTheme: {
    fontSize: '2.6rem',
    color: 'var(--accent-orange)', // glowing golden theme title
    textShadow: '0 2px 10px rgba(252, 185, 0, 0.3)', // gold glow to pop out
    marginBottom: '1.5rem',
    lineHeight: '1.25',
    fontWeight: 700,
  },
  promptDesc: {
    fontSize: '1.05rem',
    lineHeight: '1.75',
    color: '#E9ECF0', // warm light sky silver for perfect AAA contrast
    marginBottom: '2rem',
    wordBreak: 'keep-all',
    fontWeight: 500,
  },
  metaRow: {
    display: 'flex',
    gap: '2rem',
    marginBottom: '2.5rem',
    borderTop: '1px solid rgba(255, 255, 255, 0.15)', // modern light gold line instead of gray grid line
    borderBottom: '1px solid rgba(255, 255, 255, 0.15)',
    padding: '1.25rem 0',
  },
  metaItem: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.25rem',
  },
  metaLabel: {
    fontSize: '0.7rem',
    textTransform: 'uppercase',
    color: 'rgba(255, 255, 255, 0.6)', // high contrast readable label
    letterSpacing: '0.05em',
    fontWeight: 600,
  },
  metaValue: {
    fontSize: '0.88rem',
    fontWeight: 700,
    color: '#FFFFFF', // solid pure white
  },
  actionBtn: {
    alignSelf: 'flex-start',
    boxShadow: '0 4px 20px rgba(252, 185, 0, 0.25)', // glowing gold accent shadow
    backgroundColor: 'var(--accent-orange)', // gold buttons for epic visibility!
    color: '#0A1128',
    border: '1px solid var(--accent-orange)',
    fontWeight: 700,
  },
  adminEditBtn: {
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    color: '#FFFFFF',
    border: '1px solid rgba(255, 255, 255, 0.3)',
    borderRadius: '4px',
    padding: '0.3rem 0.75rem',
    fontSize: '0.75rem',
    fontWeight: 700,
    cursor: 'pointer',
    transition: 'var(--transition-fast)',
  },
  editForm: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
    marginBottom: '1.5rem',
    width: '100%',
  },
  editInputGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.4rem',
  },
  editLabel: {
    fontSize: '0.7rem',
    fontWeight: 700,
    color: 'var(--accent-orange)', // gold label in edit mode
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
  },
  editInput: {
    width: '100%',
    padding: '0.6rem 0.75rem',
    borderRadius: '6px',
    border: '1px solid rgba(255, 255, 255, 0.25)',
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    color: '#FFFFFF',
    fontSize: '0.9rem',
    fontFamily: 'var(--font-sans)',
  },
  editTextarea: {
    width: '100%',
    height: '100px',
    padding: '0.6rem 0.75rem',
    borderRadius: '6px',
    border: '1px solid rgba(255, 255, 255, 0.25)',
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    color: '#FFFFFF',
    fontSize: '0.85rem',
    fontFamily: 'var(--font-sans)',
    resize: 'none',
    lineHeight: '1.5',
  },
  editActionRow: {
    display: 'flex',
    gap: '0.5rem',
    marginTop: '0.5rem',
  },
  editSaveBtn: {
    backgroundColor: 'var(--accent-orange)',
    color: '#0A1128',
    border: 'none',
    borderRadius: '6px',
    padding: '0.5rem 1rem',
    fontSize: '0.8rem',
    fontWeight: 700,
    cursor: 'pointer',
    transition: 'var(--transition-fast)',
  },
  editCancelBtn: {
    backgroundColor: 'transparent',
    color: 'rgba(255, 255, 255, 0.8)',
    border: '1px solid rgba(255, 255, 255, 0.3)',
    borderRadius: '6px',
    padding: '0.5rem 1rem',
    fontSize: '0.8rem',
    fontWeight: 700,
    cursor: 'pointer',
    transition: 'var(--transition-fast)',
  },
};

// Add styles injection in the head for responsive behavior since inline styles have limits
if (typeof document !== 'undefined') {
  const styleTag = document.createElement('style');
  styleTag.textContent = `
    @keyframes pulse {
      0% {
        box-shadow: 0 0 0 0 rgba(255, 76, 41, 0.7);
      }
      70% {
        box-shadow: 0 0 0 6px rgba(255, 76, 41, 0);
      }
      100% {
        box-shadow: 0 0 0 0 rgba(255, 76, 41, 0);
      }
    }
    @media (max-width: 900px) {
      #hero > div {
        grid-template-columns: 1fr !important;
      }
      #hero > div > div:first-child {
        border-right: none !important;
        border-bottom: 1px solid var(--grid-line) !important;
      }
      /* Mobile adjustment for Masterpiece text size */
      .bestSentenceText {
        font-size: clamp(1rem, 5vw, 2rem);
      }
      .best-sentence-text-dynamic {
        font-size: var(--best-font-size-desktop) !important;
      }
      @media (max-width: 900px) {
        .best-sentence-text-dynamic {
          font-size: var(--best-font-size-mobile) !important;
        }
      }
    }
  `;
  document.head.appendChild(styleTag);
}
