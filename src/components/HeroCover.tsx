import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, ArrowRight, Quote } from 'lucide-react';
import type { RelayPrompt } from '../data/initialData';

interface HeroCoverProps {
  promptData: RelayPrompt;
  onJoinClick: () => void;
  isAdmin?: boolean;
  onUpdatePrompt?: (theme: string, description: string) => void;
  onShowReaderProfile?: (nickname: string) => void;
}

export const HeroCover: React.FC<HeroCoverProps> = ({ 
  promptData, 
  onJoinClick,
  isAdmin = false,
  onUpdatePrompt,
  onShowReaderProfile
}) => {
  const bestSentences = promptData.sentences.filter(s => s.likes >= 10);
  const [isEditing, setIsEditing] = useState(false);
  const [editTheme, setEditTheme] = useState(promptData.theme);
  const [editDesc, setEditDesc] = useState(promptData.description);
  const [hoveredMasterpieceId, setHoveredMasterpieceId] = useState<string | null>(null);

  const displaySentences = bestSentences.length > 0 ? bestSentences : promptData.sentences.slice(0, 5);
  const duplicatedMasterpieces = [...displaySentences, ...displaySentences];

  // Sync edits if promptData changes from outside
  useEffect(() => {
    setEditTheme(promptData.theme);
    setEditDesc(promptData.description);
  }, [promptData.theme, promptData.description]);



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

              <button onClick={onJoinClick} className="btn-primary" style={styles.actionBtn} data-guide-label="에세이 잇기 버튼 (HeroCover - Action Button)">
                <span>이 문장 뒤에 이어 쓰기</span>
                <ArrowRight size={16} />
              </button>
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

        </div>

        {/* Left Side: Weekly Cover Feature (Now Right) */}
        <div style={styles.coverPanel} data-guide-label="위클리 마스터피스 롤링 보드 (HeroCover - Masterpiece)">
          <div style={styles.coverHeader}>
            <span style={styles.magazineLabel}>Weekly Masterpiece</span>
            <div style={styles.lineDecorative} />
          </div>
          
          <div className="master-marquee-viewport" data-guide-label="마스터피스 롤링 텍스트 영역 (HeroCover - Rolling Text)">
            <div 
              className="master-marquee-track"
              style={{
                animationPlayState: hoveredMasterpieceId !== null ? 'paused' : 'running'
              }}
            >
              {duplicatedMasterpieces.map((sentence, index, arr) => {
                const itemsCount = arr.length / 2;
                const key = `${sentence.id}-master-${index >= itemsCount ? '2' : '1'}`;
                return (
                  <div
                    key={key}
                    className="master-sentence-block"
                    onClick={(e) => {
                      e.stopPropagation();
                      setHoveredMasterpieceId(prev => prev === sentence.id ? null : sentence.id);
                    }}
                  >
                    <Quote size={24} style={{ color: 'rgba(252, 185, 0, 0.22)', marginBottom: '0.4rem', display: 'block' }} />
                    <p style={{ fontFamily: 'var(--font-serif)', fontStyle: 'italic', marginBottom: '0.4rem', color: '#F5F2EB', fontSize: '1.05rem', wordBreak: 'keep-all', lineHeight: '1.5' }}>
                      "{sentence.content}"
                    </p>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginTop: '0.4rem' }}>
                      <span style={{ width: '12px', height: '1px', backgroundColor: 'var(--accent-orange)' }} />
                      <span style={{ fontSize: '0.72rem', color: '#D7CCC8', fontWeight: 600 }}>
                        독자 {sentence.author} 님
                      </span>
                    </div>

                    {/* Popover metadata speech card on hover/click */}
                    <AnimatePresence>
                      {hoveredMasterpieceId === sentence.id && (
                        <motion.span
                          initial={{ opacity: 0, y: 10, scale: 0.95, x: '-50%' }}
                          animate={{ opacity: 1, y: 0, scale: 1, x: '-50%' }}
                          exit={{ opacity: 0, y: 8, scale: 0.95, x: '-50%' }}
                          transition={{ duration: 0.12, ease: 'easeOut' }}
                          className="sentence-tooltip"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <span 
                            className="tooltip-author"
                            style={{
                              cursor: 'pointer',
                              textDecoration: 'underline',
                              color: 'var(--accent-orange)',
                              fontWeight: 700
                            }}
                            onClick={(e) => {
                              e.stopPropagation();
                              if (onShowReaderProfile) onShowReaderProfile(sentence.author);
                            }}
                            title={`${sentence.author} 작가의 프로필 및 작품집 보기`}
                          >
                            BY. {sentence.author}
                          </span>
                          <span style={{ fontSize: '0.65rem', color: 'rgba(255, 255, 255, 0.7)', marginTop: '0.2rem' }}>
                            누적 공감: ❤️ {sentence.likes}개
                          </span>
                          {/* Tooltip Triangle Arrow */}
                          <span className="tooltip-arrow" />
                        </motion.span>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })}
            </div>
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
    @keyframes verticalMarqueeMaster {
      0% { transform: translateY(0); }
      100% { transform: translateY(-50%); }
    }
    .master-marquee-viewport {
      height: 240px;
      overflow: hidden;
      position: relative;
      width: 100%;
      mask-image: linear-gradient(to bottom, transparent 0%, black 15%, black 85%, transparent 100%);
      -webkit-mask-image: linear-gradient(to bottom, transparent 0%, black 15%, black 85%, transparent 100%);
      margin: 1.5rem 0;
    }
    .master-marquee-track {
      display: flex;
      flex-direction: column;
      gap: 1.5rem;
      animation: verticalMarqueeMaster 35s linear infinite;
    }
    .master-sentence-block {
      display: block;
      padding: 1.1rem 1.4rem;
      background-color: rgba(255, 255, 255, 0.04);
      border: 1px solid rgba(255, 255, 255, 0.08);
      border-left: 4px solid var(--accent-orange);
      border-radius: 8px;
      font-family: var(--font-serif);
      font-size: 1.1rem;
      line-height: 1.6;
      cursor: pointer;
      position: relative;
      transition: var(--transition-fast);
      box-shadow: 0 4px 15px rgba(0, 0, 0, 0.15);
      box-sizing: border-box;
      word-break: keep-all;
      color: #F5F2EB;
      text-align: left;
    }
    .master-sentence-block:hover {
      border-color: var(--accent-orange);
      transform: translateY(-2px);
      box-shadow: 0 8px 25px rgba(0, 0, 0, 0.3);
      background-color: rgba(255, 255, 255, 0.08);
    }
    .sentence-tooltip {
      position: absolute;
      bottom: 125%;
      left: 50%;
      background-color: var(--text-primary);
      color: var(--bg-primary);
      padding: 0.75rem 1rem;
      border-radius: 8px;
      font-size: 0.75rem;
      white-space: nowrap;
      z-index: 100;
      box-shadow: 0 8px 30px rgba(0, 0, 0, 0.4);
      display: flex;
      flex-direction: column;
      gap: 0.25rem;
      border: 1px solid var(--grid-line);
      pointer-events: auto;
      transform: translateX(-50%);
    }
    .tooltip-arrow {
      position: absolute;
      top: 100%;
      left: 50%;
      transform: translateX(-50%);
      width: 0;
      height: 0;
      border-left: 6px solid transparent;
      border-right: 6px solid transparent;
      border-top: 6px solid var(--text-primary);
    }
    .tooltip-author {
      font-weight: 700;
      letter-spacing: 0.02em;
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
