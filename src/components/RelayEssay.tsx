import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Send, CornerRightDown, Award } from 'lucide-react';
import type { RelayPrompt } from '../data/initialData';

interface RelayEssayProps {
  promptData: RelayPrompt;
  onAddSentence: (author: string, content: string) => void;
  onLikeSentence: (sentenceId: string) => void;
  externalSentence?: string;
  onClearExternalSentence?: () => void;
  currentUserNickname?: string;
  onLoginClick?: () => void;
}

export const RelayEssay: React.FC<RelayEssayProps> = ({ 
  promptData, 
  onAddSentence, 
  onLikeSentence,
  externalSentence,
  onClearExternalSentence,
  currentUserNickname,
  onLoginClick
}) => {
  const [content, setContent] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const [error, setError] = useState('');
  const nonSpaceLength = content.replace(/\s/g, '').length;
  const [hoveredSentenceId, setHoveredSentenceId] = useState<string | null>(null);

  React.useEffect(() => {
    if (externalSentence) {
      setContent(externalSentence);
      if (onClearExternalSentence) {
        onClearExternalSentence();
      }
    }
  }, [externalSentence, onClearExternalSentence]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const finalAuthor = currentUserNickname || '방문자';

    if (!content.trim()) {
      setError('에세이를 이어갈 아름다운 문장을 채워주세요.');
      return;
    }
    const nonSpaceLength = content.replace(/\s/g, '').length;
    if (nonSpaceLength > 50) {
      setError('문장은 최대 50자 이내(공백 제외)이어야 합니다.');
      return;
    }

    onAddSentence(finalAuthor, content.trim());
    setContent('');
    setError('');
  };

  return (
    <section id="relay" className="grid-border-cell" style={styles.section} data-guide-label="참여형 릴레이 에세이 섹션 (RelayEssay)">
      <div style={styles.header}>
        <div style={styles.titleArea}>
          <span style={styles.preTitle}>Interactive Space</span>
          <h2 className="serif-title" style={styles.title}>참여형 릴레이 에세이</h2>
        </div>
        <div className="badge badge-green">
          <Award size={12} />
          <span>우수작은 메인 커버에 등재</span>
        </div>
      </div>

      <p style={styles.introText}>
          아래는 방문한 작가님들의 고유한 생각들이 더해져 함께 만들어가고 있는 단 하나의 이야기입니다.  문장을 클릭하면 작가를 확인할 수 있는 미니 팝업이 활성화됩니다.
      </p>

      {/* Compiled Essay View (Paragraph flow feel) */}
      <div style={styles.essayPaper} data-guide-label="독자 공동 집필 원고지 (RelayEssay - Essay Paper)">
        <div style={styles.promptStart} data-guide-label="릴레이 에세이 시작점 문장 (RelayEssay - Start Prompt)">
          <span style={styles.promptLabel}>시작점</span>
          <p className="serif-title" style={styles.promptText}>
            {promptData.description}
          </p>
        </div>
        
        <div style={styles.flowContainer} data-guide-label="독자들이 이은 본문 글 (RelayEssay - Sentence Flow)">
          <AnimatePresence initial={false}>
            {[...promptData.sentences]
              .sort((a, b) => b.likes - a.likes)
              .slice(0, 5)
              .map((sentence, index) => (
                <motion.span
                  key={sentence.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  style={styles.sentenceSpan}
                  className="relay-sentence-span"
                  onClick={() => setHoveredSentenceId(prev => prev === sentence.id ? null : sentence.id)}
                >
                  <span style={sentence.isBest ? styles.bestHighlight : {}}>
                    {sentence.content}
                  </span>
                  
                  {/* Popover metadata speech card on hover */}
                  <AnimatePresence>
                    {hoveredSentenceId === sentence.id && (
                      <motion.span
                        initial={{ opacity: 0, y: 10, scale: 0.95, x: '-50%' }}
                        animate={{ opacity: 1, y: 0, scale: 1, x: '-50%' }}
                        exit={{ opacity: 0, y: 8, scale: 0.95, x: '-50%' }}
                        transition={{ duration: 0.12, ease: 'easeOut' }}
                        className="sentence-tooltip"
                        style={styles.tooltip}
                      >
                        <span style={styles.tooltipAuthor}>BY. {sentence.author}</span>
                        {sentence.isBest && (
                          <span style={styles.bestBadgeMini}>
                            👑 베스트 문장
                          </span>
                        )}
                        <span style={styles.tooltipActions}>
                          <button 
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              onLikeSentence(sentence.id);
                            }} 
                            style={styles.likeBtnMini}
                          >
                            <Heart 
                              size={12} 
                              fill={sentence.likes > 20 ? 'var(--accent-orange)' : 'transparent'} 
                              color={sentence.likes > 20 ? 'var(--accent-orange)' : 'var(--bg-primary)'} 
                            />
                            <span>{sentence.likes}</span>
                          </button>
                        </span>
                        {/* Tooltip Triangle Arrow */}
                        <span style={styles.tooltipArrow} />
                      </motion.span>
                    )}
                  </AnimatePresence>
                </motion.span>
              ))}
          </AnimatePresence>
          <span style={styles.cursorBlink}>_</span>
        </div>
      </div>

      {/* Writing form */}
      <div style={styles.formContainer} data-guide-label="문장 기고 입력 폼 (RelayEssay - Input Form)">
        <div style={styles.formIndicator}>
          <CornerRightDown size={16} style={{ color: 'var(--accent-orange)' }} />
          <span style={styles.formIndicatorText}>다음 문장으로 당신의 감성을 더해보세요</span>
        </div>
        
        {currentUserNickname ? (
          <form onSubmit={handleSubmit} style={styles.form}>
            <div style={styles.inputGroupRow}>
              <div style={styles.loggedInAuthor} data-guide-label="로그인한 필명 표시기 (RelayEssay - LoggedIn Author)">
                작성자 : <span style={styles.authorBadge}>✒️ {currentUserNickname} 님</span>
              </div>
              <span style={styles.charCounter}>
                {nonSpaceLength}/50자
              </span>
            </div>

            <div style={{ ...styles.textAreaWrapper, borderColor: isFocused ? 'var(--text-primary)' : 'var(--grid-line)' }} data-guide-label="에세이 문장 작성 창 (RelayEssay - Textarea)">
              <textarea
                placeholder="여기에 소설의 다음 문장을 이어 써주세요. (최대 50자, 비속어나 타인에게 상처를 주는 문장은 필터링될 수 있습니다.)"
                value={content}
                onChange={(e) => {
                  setContent(e.target.value);
                  if(error) setError('');
                }}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                style={styles.textarea}
                maxLength={100}
              />
            </div>

            {error && <p style={styles.errorText}>{error}</p>}

            <button type="submit" className="btn-primary" style={styles.submitBtn} data-guide-label="이야기 잇기 전송 버튼 (RelayEssay - Submit Button)">
              <span>이야기 잇기</span>
              <Send size={14} />
            </button>
          </form>
        ) : (
          <div style={styles.loginRequiredBox} data-guide-label="로그인 안내 박스 (RelayEssay - Login Required)">
            <p style={styles.loginRequiredText}>
              로그인 또는 회원가입을 하시면, 나만의 필명으로 함께 에세이를 이어 나갈 수 있습니다.
            </p>
            <button 
              type="button" 
              className="btn-primary" 
              style={styles.loginBtn} 
              onClick={onLoginClick}
              data-guide-label="로그인/회원가입 버튼 (RelayEssay - Login Button)"
            >
              로그인 / 회원가입하고 이야기 잇기
            </button>
          </div>
        )}
      </div>
    </section>
  );
};

const styles: Record<string, React.CSSProperties> = {
  section: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1.5rem',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    flexWrap: 'wrap',
    gap: '1rem',
  },
  titleArea: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.25rem',
  },
  preTitle: {
    fontSize: '0.7rem',
    fontWeight: 700,
    textTransform: 'uppercase',
    letterSpacing: '0.1em',
    color: 'var(--text-tertiary)',
  },
  title: {
    fontSize: '1.75rem',
    color: 'var(--text-primary)',
  },
  introText: {
    fontSize: '0.9rem',
    color: 'var(--text-secondary)',
    lineHeight: '1.6',
    maxWidth: '800px',
  },
  essayPaper: {
    backgroundColor: 'var(--bg-secondary)',
    border: '1px solid var(--grid-line)',
    padding: '2.5rem',
    position: 'relative',
    lineHeight: '2.2',
    borderRadius: '12px',
  },
  promptStart: {
    marginBottom: '1rem',
    paddingBottom: '1rem',
    borderBottom: '1px dashed var(--grid-line)',
  },
  promptLabel: {
    fontSize: '0.65rem',
    fontWeight: 800,
    color: 'var(--accent-green)',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
    display: 'block',
    marginBottom: '0.25rem',
  },
  promptText: {
    fontSize: '1.15rem',
    color: 'var(--accent-green)',
    lineHeight: '1.6',
  },
  flowContainer: {
    fontSize: '1.15rem',
    color: 'var(--text-primary)',
    fontWeight: 500,
    textAlign: 'justify',
  },
  sentenceSpan: {
    position: 'relative',
    cursor: 'pointer',
    marginRight: '0.5rem',
    padding: '0.1rem 0.25rem',
    borderRadius: '4px',
    transition: 'var(--transition-fast)',
    display: 'inline-block',
  },
  bestHighlight: {
    borderBottom: '2px solid var(--accent-orange)',
    fontWeight: 600,
  },
  cursorBlink: {
    animation: 'blink 1s infinite',
    color: 'var(--accent-orange)',
    fontWeight: 'bold',
  },
  tooltip: {
    position: 'absolute',
    bottom: '135%',
    left: '50%',
    backgroundColor: 'var(--text-primary)',
    color: 'var(--bg-primary)',
    padding: '0.75rem 1rem',
    borderRadius: '8px',
    fontSize: '0.75rem',
    whiteSpace: 'nowrap',
    zIndex: 100,
    boxShadow: '0 8px 30px rgba(10, 17, 40, 0.22)',
    display: 'flex',
    flexDirection: 'column',
    gap: '0.4rem',
    border: '1px solid var(--grid-line)',
    pointerEvents: 'auto',
  },
  tooltipArrow: {
    position: 'absolute',
    top: '100%',
    left: '50%',
    transform: 'translateX(-50%)',
    width: 0,
    height: 0,
    borderLeft: '6px solid transparent',
    borderRight: '6px solid transparent',
    borderTop: '6px solid var(--text-primary)',
  },
  tooltipAuthor: {
    fontWeight: 700,
    letterSpacing: '0.02em',
  },
  bestBadgeMini: {
    color: 'var(--accent-orange)',
    fontSize: '0.65rem',
    fontWeight: 700,
  },
  tooltipActions: {
    display: 'flex',
    justifyContent: 'flex-start',
    borderTop: '1px solid rgba(255, 255, 255, 0.1)',
    paddingTop: '0.375rem',
  },
  likeBtnMini: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.25rem',
    cursor: 'pointer',
    color: 'var(--bg-primary)',
    fontWeight: 600,
    backgroundColor: 'transparent',
    border: 'none',
    outline: 'none',
    transition: 'var(--transition-fast)',
  },
  formContainer: {
    marginTop: '1.5rem',
    backgroundColor: 'var(--bg-primary)',
    border: '1px solid var(--grid-line)',
    padding: '1.5rem',
    borderRadius: '12px',
  },
  formIndicator: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    marginBottom: '1rem',
  },
  formIndicatorText: {
    fontSize: '0.8rem',
    fontWeight: 700,
    color: 'var(--text-secondary)',
    textTransform: 'uppercase',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
  },
  inputGroupRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: '1rem',
  },
  loggedInAuthor: {
    display: 'flex',
    alignItems: 'center',
    fontSize: '0.9rem',
    color: 'var(--text-secondary)',
    fontWeight: 500,
    gap: '0.4rem',
  },
  authorBadge: {
    color: 'var(--accent-orange)',
    fontWeight: 700,
  },
  loginRequiredBox: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '2.5rem 1.5rem',
    border: '2px dashed var(--grid-line)',
    borderRadius: '12px',
    backgroundColor: 'var(--bg-secondary)',
    gap: '1.2rem',
    textAlign: 'center',
    transition: 'var(--transition-fast)',
  },
  loginRequiredText: {
    fontSize: '0.95rem',
    color: 'var(--text-secondary)',
    lineHeight: '1.6',
    fontWeight: 500,
  },
  loginBtn: {
    padding: '0.65rem 1.5rem',
    fontSize: '0.85rem',
    fontWeight: 700,
    borderRadius: '8px',
  },
  charCounter: {
    fontSize: '0.75rem',
    color: 'var(--text-tertiary)',
    fontWeight: 600,
  },
  textAreaWrapper: {
    border: '1px solid var(--grid-line)',
    transition: 'var(--transition-fast)',
    backgroundColor: 'var(--bg-secondary)',
    borderRadius: '6px',
    overflow: 'hidden',
  },
  textarea: {
    width: '100%',
    minHeight: '96px', // increased by 20% for taller input area
    padding: '1rem',
    resize: 'none',
    fontSize: '0.95rem',
    lineHeight: '1.6',
    backgroundColor: 'transparent',
    color: 'var(--text-primary)',
  },
  errorText: {
    color: 'var(--accent-orange)',
    fontSize: '0.8rem',
    fontWeight: 600,
  },
  submitBtn: {
    alignSelf: 'flex-end',
  },
};

if (typeof document !== 'undefined') {
  const styleTag = document.createElement('style');
  styleTag.textContent = `
    @keyframes blink {
      0%, 100% { opacity: 0; }
      50% { opacity: 1; }
    }
    .relay-sentence-span:hover {
      background-color: var(--accent-orange-light);
    }
  `;
  document.head.appendChild(styleTag);
}
