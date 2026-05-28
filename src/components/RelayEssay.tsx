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
  const [showAllArchive, setShowAllArchive] = useState(false);
  const [archiveSortBy, setArchiveSortBy] = useState<'latest' | 'likes'>('likes');

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

      {/* 📜 Exhibition Hall Trigger Button */}
      <div style={styles.archiveActionRow} data-guide-label="독자 문장 전시장 버튼 (RelayEssay - Archive Toggle Button)">
        <button
          type="button"
          onClick={() => setShowAllArchive(prev => !prev)}
          style={{
            ...styles.archiveToggleBtn,
            borderColor: showAllArchive ? 'var(--accent-orange)' : 'var(--grid-line)',
            color: showAllArchive ? 'var(--accent-orange)' : 'var(--text-secondary)'
          }}
          className="btn-secondary"
        >
          <span>
            {showAllArchive ? '📖 모든 이야기 조각 닫기' : `📜 독자 문장 전시장 읽기 (총 ${promptData.sentences.length}개)`}
          </span>
          <motion.span
            animate={{ rotate: showAllArchive ? 180 : 0 }}
            transition={{ duration: 0.25 }}
            style={{ display: 'inline-flex' }}
          >
            ▼
          </motion.span>
        </button>
      </div>

      {/* 🔮 All Sentences Exhibition Grid Container */}
      <AnimatePresence>
        {showAllArchive && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.35, ease: 'easeInOut' }}
            style={styles.archiveContainer}
            data-guide-label="독자 문장 전시장 (RelayEssay - Exhibition Hall)"
          >
            {/* Sorting controls */}
            <div style={styles.archiveFilterBar}>
              <span style={styles.archiveFilterLabel}>문장 배열 방식 :</span>
              <div style={styles.archiveFilterButtons}>
                <button
                  type="button"
                  onClick={() => setArchiveSortBy('likes')}
                  style={{
                    ...styles.filterTab,
                    backgroundColor: archiveSortBy === 'likes' ? 'var(--text-primary)' : 'transparent',
                    color: archiveSortBy === 'likes' ? 'var(--bg-primary)' : 'var(--text-secondary)',
                    borderColor: archiveSortBy === 'likes' ? 'var(--text-primary)' : 'var(--grid-line)',
                  }}
                >
                  🔥 인기 공감순
                </button>
                <button
                  type="button"
                  onClick={() => setArchiveSortBy('latest')}
                  style={{
                    ...styles.filterTab,
                    backgroundColor: archiveSortBy === 'latest' ? 'var(--text-primary)' : 'transparent',
                    color: archiveSortBy === 'latest' ? 'var(--bg-primary)' : 'var(--text-secondary)',
                    borderColor: archiveSortBy === 'latest' ? 'var(--text-primary)' : 'var(--grid-line)',
                  }}
                >
                  ✨ 최신 등록순
                </button>
              </div>
            </div>

            {/* Grid of manuscript cards */}
            {promptData.sentences.length === 0 ? (
              <div style={styles.emptyArchive}>
                아직 전시장에 등록된 이야기 조각이 없습니다. 첫 문장의 주인공이 되어 보세요!
              </div>
            ) : (
              <div style={styles.archiveGrid}>
                {[...promptData.sentences]
                  .sort((a, b) => {
                    if (archiveSortBy === 'likes') {
                      return b.likes - a.likes;
                    } else {
                      const timeA = new Date(a.createdAt || '').getTime();
                      const timeB = new Date(b.createdAt || '').getTime();
                      return timeB - timeA;
                    }
                  })
                  .map((sentence) => {
                    // Check if it is a Best sentence (top 5 by likes)
                    const sortedByLikes = [...promptData.sentences].sort((a, b) => b.likes - a.likes);
                    const best5Ids = sortedByLikes.slice(0, 5).map(s => s.id);
                    const isBest = best5Ids.includes(sentence.id);

                    // Formatted date
                    let formattedDate = '';
                    if (sentence.createdAt) {
                      const dateObj = new Date(sentence.createdAt);
                      const month = String(dateObj.getMonth() + 1).padStart(2, '0');
                      const day = String(dateObj.getDate()).padStart(2, '0');
                      const hours = String(dateObj.getHours()).padStart(2, '0');
                      const minutes = String(dateObj.getMinutes()).padStart(2, '0');
                      formattedDate = `${month}-${day} ${hours}:${minutes}`;
                    }

                    return (
                      <motion.div
                        key={sentence.id}
                        layout
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        transition={{ duration: 0.25 }}
                        style={{
                          ...styles.archiveCard,
                          borderColor: isBest ? 'var(--accent-orange)' : 'var(--grid-line)',
                        }}
                      >
                        {/* Quotes design background decoration */}
                        <span style={styles.cardQuoteIcon}>“</span>
                        
                        {/* Sentence content */}
                        <p className="serif-title" style={styles.cardText}>
                          {sentence.content}
                        </p>

                        {/* Card metadata footer */}
                        <div style={styles.cardFooter}>
                          <div style={styles.cardAuthorRow}>
                            <span style={styles.cardAuthor}>✒️ {sentence.author}</span>
                            {formattedDate && <span style={styles.cardDate}>{formattedDate}</span>}
                          </div>
                          
                          <div style={styles.cardActions}>
                            {isBest && (
                              <span style={styles.bestBadgeMiniGrid}>
                                👑 베스트 5
                              </span>
                            )}
                            <button
                              type="button"
                              onClick={() => onLikeSentence(sentence.id)}
                              style={styles.cardLikeBtn}
                              className="btn-card-like"
                            >
                              <Heart
                                size={13}
                                fill={sentence.likes > 0 ? 'var(--accent-orange)' : 'transparent'}
                                color={sentence.likes > 0 ? 'var(--accent-orange)' : 'var(--text-secondary)'}
                              />
                              <span style={{ fontSize: '0.8rem', fontWeight: 700, color: sentence.likes > 0 ? 'var(--accent-orange)' : 'var(--text-secondary)' }}>
                                {sentence.likes}
                              </span>
                            </button>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

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
  archiveActionRow: {
    display: 'flex',
    justifyContent: 'center',
    width: '100%',
    marginTop: '0.5rem',
  },
  archiveToggleBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    backgroundColor: 'var(--bg-secondary)',
    border: '1px solid var(--grid-line)',
    padding: '0.75rem 2rem',
    borderRadius: '30px',
    fontSize: '0.85rem',
    fontWeight: 700,
    cursor: 'pointer',
    transition: 'var(--transition-fast)',
    boxShadow: '0 4px 12px rgba(10, 17, 40, 0.04)',
  },
  archiveContainer: {
    backgroundColor: 'var(--bg-secondary)',
    border: '1px solid var(--grid-line)',
    borderRadius: '12px',
    padding: '2rem 1.5rem',
    display: 'flex',
    flexDirection: 'column',
    gap: '1.5rem',
    overflow: 'hidden',
  },
  archiveFilterBar: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottom: '1px dashed var(--grid-line)',
    paddingBottom: '1rem',
    flexWrap: 'wrap',
    gap: '1rem',
  },
  archiveFilterLabel: {
    fontSize: '0.8rem',
    fontWeight: 700,
    color: 'var(--text-secondary)',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
  },
  archiveFilterButtons: {
    display: 'flex',
    gap: '0.5rem',
  },
  filterTab: {
    border: '1px solid var(--grid-line)',
    padding: '0.4rem 1rem',
    borderRadius: '20px',
    fontSize: '0.75rem',
    fontWeight: 700,
    cursor: 'pointer',
    transition: 'var(--transition-fast)',
  },
  emptyArchive: {
    textAlign: 'center',
    color: 'var(--text-tertiary)',
    fontSize: '0.9rem',
    padding: '3rem 1rem',
  },
  archiveGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
    gap: '1rem',
  },
  archiveCard: {
    backgroundColor: 'var(--bg-primary)',
    border: '1px solid var(--grid-line)',
    borderRadius: '10px',
    padding: '1.5rem',
    position: 'relative',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    minHeight: '160px',
    boxShadow: '0 2px 8px rgba(10, 17, 40, 0.02)',
    overflow: 'hidden',
    transition: 'border-color var(--transition-fast)',
  },
  cardQuoteIcon: {
    position: 'absolute',
    top: '-15px',
    left: '10px',
    fontSize: '4.5rem',
    fontFamily: 'serif',
    color: 'var(--grid-line)',
    opacity: 0.35,
    userSelect: 'none',
    pointerEvents: 'none',
  },
  cardText: {
    fontSize: '1.05rem',
    lineHeight: '1.6',
    color: 'var(--text-primary)',
    margin: '0.5rem 0 1.5rem 0',
    wordBreak: 'keep-all',
    position: 'relative',
    zIndex: 1,
  },
  cardFooter: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.75rem',
    borderTop: '1px solid var(--grid-line)',
    paddingTop: '0.75rem',
    position: 'relative',
    zIndex: 1,
  },
  cardAuthorRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cardAuthor: {
    fontSize: '0.75rem',
    fontWeight: 700,
    color: 'var(--accent-orange)',
  },
  cardDate: {
    fontSize: '0.65rem',
    color: 'var(--text-tertiary)',
    fontWeight: 500,
  },
  cardActions: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  bestBadgeMiniGrid: {
    color: 'var(--accent-orange)',
    fontSize: '0.65rem',
    fontWeight: 700,
    backgroundColor: 'var(--accent-orange-light)',
    padding: '0.2rem 0.5rem',
    borderRadius: '4px',
  },
  cardLikeBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.25rem',
    cursor: 'pointer',
    backgroundColor: 'transparent',
    border: 'none',
    outline: 'none',
    transition: 'transform var(--transition-fast)',
    marginLeft: 'auto',
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
    .btn-card-like:hover {
      transform: scale(1.15);
    }
    .btn-card-like:active {
      transform: scale(0.9);
    }
  `;
  document.head.appendChild(styleTag);
}
