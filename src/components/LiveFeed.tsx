import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, Heart, CheckCircle2, AlertCircle, HelpCircle, CornerDownRight } from 'lucide-react';
import type { WorkshopLog } from '../data/initialData';

interface LiveFeedProps {
  logs: WorkshopLog[];
  onLikeLog: (logId: string) => void;
  onAddComment: (logId: string, author: string, content: string) => void;
}

export const LiveFeed: React.FC<LiveFeedProps> = ({ logs, onLikeLog, onAddComment }) => {
  const [commentInputs, setCommentInputs] = useState<Record<string, { author: string; content: string }>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleInputChange = (logId: string, field: 'author' | 'content', value: string) => {
    setCommentInputs(prev => ({
      ...prev,
      [logId]: {
        ...prev[logId] || { author: '', content: '' },
        [field]: value
      }
    }));
    if (errors[logId]) {
      setErrors(prev => ({ ...prev, [logId]: '' }));
    }
  };

  const handleCommentSubmit = (e: React.FormEvent, logId: string) => {
    e.preventDefault();
    const input = commentInputs[logId] || { author: '', content: '' };
    
    if (!input.author.trim()) {
      setErrors(prev => ({ ...prev, [logId]: '필명을 적어주세요.' }));
      return;
    }
    if (!input.content.trim()) {
      setErrors(prev => ({ ...prev, [logId]: '의견을 남겨주세요.' }));
      return;
    }

    onAddComment(logId, input.author.trim(), input.content.trim());
    
    // Clear input
    setCommentInputs(prev => ({
      ...prev,
      [logId]: { author: '', content: '' }
    }));
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'writing':
        return (
          <div className="badge badge-green" style={styles.badgeFix}>
            <CheckCircle2 size={12} />
            <span>초안 작성 중 📝</span>
          </div>
        );
      case 'brainstorming':
        return (
          <div className="badge badge-orange" style={styles.badgeFix}>
            <AlertCircle size={12} />
            <span>소재 고민 중 🧐</span>
          </div>
        );
      case 'feedback':
        return (
          <div className="badge badge-orange" style={{ ...styles.badgeFix, color: '#aa3bff', backgroundColor: 'rgba(170, 59, 255, 0.1)' }}>
            <HelpCircle size={12} />
            <span>피드백 환영 🙌</span>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <section id="workshop" className="grid-border-cell" style={styles.section} data-guide-label="작가의 라이브 작업실 섹션 (LiveFeed)">
      <div style={styles.header}>
        <span style={styles.preTitle}>Writer's Live Log</span>
        <h2 className="serif-title" style={styles.title}>작가의 작업실 - 라이브 피드</h2>
        <p style={styles.introText}>
          작품이 완성되기 전, 작가님이 치열하게 고민하고 있는 흔적들의 기록입니다. 
          "이 부분은 이렇게 풀면 어떨까요?"라며 창작 과정에 작가님의 든든한 페이스메이커가 되어보세요.
        </p>
      </div>

      <div style={styles.feedList}>
        {logs.map((log) => {
          const input = commentInputs[log.id] || { author: '', content: '' };
          return (
            <motion.div 
              key={log.id} 
              style={styles.logCard}
              layout
              transition={{ duration: 0.4 }}
              data-guide-label="작가의 라이브 피드 카드 (LiveFeed - Feed Card)"
            >
              {/* Card Header */}
              <div style={styles.cardHeader}>
                <div style={styles.cardHeaderLeft}>
                  {getStatusBadge(log.status)}
                  <span style={styles.categoryText}>#{log.category}</span>
                </div>
                <span style={styles.dateText}>
                  {new Date(log.createdAt).toLocaleDateString('ko-KR', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>

              {/* Title & Content */}
              <h3 style={styles.logTitle}>{log.title}</h3>
              <p style={styles.logContent}>{log.content}</p>

              {/* Interaction Bar */}
              <div style={styles.interactionBar} data-guide-label="공감 및 댓글 수 인디케이터 (LiveFeed - Interaction Bar)">
                <button 
                  type="button"
                  onClick={() => onLikeLog(log.id)} 
                  style={styles.likeBtn}
                  className="interactive-like-btn"
                >
                  <Heart 
                    size={16} 
                    fill={log.likes > 30 ? 'var(--accent-orange)' : 'transparent'} 
                    color={log.likes > 30 ? 'var(--accent-orange)' : 'var(--text-primary)'} 
                  />
                  <span>공감과 응원 ({log.likes})</span>
                </button>
                <div style={styles.commentCount}>
                  <MessageSquare size={16} />
                  <span>독자 의견 {log.comments.length}개</span>
                </div>
              </div>

              {/* Comments Thread */}
              <div style={styles.commentsSection} data-guide-label="독자 의견 및 댓글 영역 (LiveFeed - Comments Thread)">
                <AnimatePresence initial={false}>
                  {log.comments.length > 0 && (
                    <div style={styles.commentsList}>
                      {log.comments.map((comment) => (
                        <motion.div 
                          key={comment.id} 
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, height: 0 }}
                          style={styles.commentItem}
                        >
                          <CornerDownRight size={14} style={styles.arrowIcon} />
                          <div style={styles.commentBody}>
                            <div style={styles.commentMeta}>
                              <span style={styles.commentAuthor}>{comment.author}</span>
                              <span style={styles.commentTime}>
                                {new Date(comment.createdAt).toLocaleDateString('ko-KR', { month: 'numeric', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                              </span>
                            </div>
                            <p style={styles.commentText}>{comment.content}</p>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  )}
                </AnimatePresence>

                {/* Comment Form */}
                <form onSubmit={(e) => handleCommentSubmit(e, log.id)} style={styles.commentForm} data-guide-label="의견 작성 폼 (LiveFeed - Comment Form)">
                  <div style={styles.commentFormRow}>
                    <input
                      type="text"
                      placeholder="필명"
                      value={input.author}
                      onChange={(e) => handleInputChange(log.id, 'author', e.target.value)}
                      style={styles.commentAuthorInput}
                      maxLength={15}
                      data-guide-label="의견 작성 필명 필드 (LiveFeed - Author Input)"
                    />
                    <input
                      type="text"
                      placeholder="아이디어나 의견을 보태주세요..."
                      value={input.content}
                      onChange={(e) => handleInputChange(log.id, 'content', e.target.value)}
                      style={styles.commentContentInput}
                      maxLength={150}
                      data-guide-label="의견 작성 내용 필드 (LiveFeed - Content Input)"
                    />
                    <button type="submit" style={styles.commentSubmitBtn} data-guide-label="의견 등록 버튼 (LiveFeed - Submit Button)">
                      남기기
                    </button>
                  </div>
                  {errors[log.id] && <p style={styles.errorText}>{errors[log.id]}</p>}
                </form>
              </div>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
};

const styles: Record<string, React.CSSProperties> = {
  section: {
    display: 'flex',
    flexDirection: 'column',
    gap: '2rem',
  },
  header: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem',
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
    marginTop: '0.5rem',
  },
  feedList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '2.5rem',
  },
  logCard: {
    backgroundColor: 'var(--bg-primary)',
    border: '1px solid var(--grid-line)',
    borderRadius: '12px',
    padding: '2rem',
    display: 'flex',
    flexDirection: 'column',
    boxShadow: 'var(--card-shadow)',
    transition: 'box-shadow 0.3s ease, border-color 0.3s ease',
  },
  cardHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '1rem',
  },
  cardHeaderLeft: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
  },
  badgeFix: {
    borderRadius: '4px',
    padding: '0.2rem 0.5rem',
    fontSize: '0.7rem',
  },
  categoryText: {
    fontSize: '0.75rem',
    fontWeight: 700,
    color: 'var(--accent-green)',
    letterSpacing: '0.02em',
  },
  dateText: {
    fontSize: '0.75rem',
    color: 'var(--text-tertiary)',
    fontWeight: 500,
  },
  logTitle: {
    fontSize: '1.25rem',
    color: 'var(--text-primary)',
    marginBottom: '0.75rem',
  },
  logContent: {
    fontSize: '0.95rem',
    color: 'var(--text-secondary)',
    lineHeight: '1.7',
    marginBottom: '1.5rem',
    wordBreak: 'keep-all',
  },
  interactionBar: {
    display: 'flex',
    gap: '1.5rem',
    alignItems: 'center',
    paddingBottom: '1rem',
    borderBottom: '1px solid var(--grid-line)',
    marginBottom: '1rem',
  },
  likeBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    fontSize: '0.8rem',
    fontWeight: 600,
    color: 'var(--text-primary)',
    cursor: 'pointer',
    backgroundColor: 'transparent',
    border: 'none',
    transition: 'var(--transition-fast)',
  },
  commentCount: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    fontSize: '0.8rem',
    fontWeight: 600,
    color: 'var(--text-secondary)',
  },
  commentsSection: {
    backgroundColor: 'var(--bg-secondary)',
    borderRadius: '8px',
    padding: '1.25rem',
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
  },
  commentsList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.75rem',
    paddingBottom: '0.75rem',
    borderBottom: '1px dashed var(--grid-line)',
  },
  commentItem: {
    display: 'flex',
    gap: '0.5rem',
    alignItems: 'flex-start',
  },
  arrowIcon: {
    color: 'var(--text-tertiary)',
    marginTop: '0.25rem',
    flexShrink: 0,
  },
  commentBody: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.15rem',
    flex: 1,
  },
  commentMeta: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  commentAuthor: {
    fontSize: '0.8rem',
    fontWeight: 700,
    color: 'var(--text-primary)',
  },
  commentTime: {
    fontSize: '0.65rem',
    color: 'var(--text-tertiary)',
  },
  commentText: {
    fontSize: '0.85rem',
    color: 'var(--text-secondary)',
    lineHeight: '1.4',
  },
  commentForm: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem',
  },
  commentFormRow: {
    display: 'flex',
    gap: '0.5rem',
    alignItems: 'center',
  },
  commentAuthorInput: {
    width: '100px',
    padding: '0.4rem 0.6rem',
    backgroundColor: 'var(--bg-primary)',
    border: '1px solid var(--grid-line)',
    borderRadius: '6px',
    fontSize: '0.8rem',
    fontWeight: 600,
    color: 'var(--text-primary)',
  },
  commentContentInput: {
    flex: 1,
    padding: '0.4rem 0.6rem',
    backgroundColor: 'var(--bg-primary)',
    border: '1px solid var(--grid-line)',
    borderRadius: '6px',
    fontSize: '0.8rem',
    color: 'var(--text-primary)',
  },
  commentSubmitBtn: {
    padding: '0.4rem 0.8rem',
    backgroundColor: 'var(--text-primary)',
    color: 'var(--bg-primary)',
    fontSize: '0.8rem',
    fontWeight: 700,
    cursor: 'pointer',
    border: '1px solid var(--text-primary)',
    borderRadius: '6px',
    transition: 'var(--transition-fast)',
  },
  errorText: {
    color: 'var(--accent-orange)',
    fontSize: '0.75rem',
    fontWeight: 600,
  },
};
