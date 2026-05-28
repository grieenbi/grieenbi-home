import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, BookOpen, Send, Quote, Sparkles } from 'lucide-react';
import type { ArchiveArticle } from '../data/initialData';

interface ArchiveProps {
  articles: ArchiveArticle[];
}

interface SparkComment {
  id: string;
  author: string;
  content: string;
  createdAt: string;
}

export const Archive: React.FC<ArchiveProps> = ({ articles }) => {
  const [selectedCategory, setSelectedCategory] = useState<'All' | 'Essay' | 'Tech' | 'Daily'>('All');
  const [selectedArticle, setSelectedArticle] = useState<ArchiveArticle | null>(null);
  
  // Sparks comments state mapped by articleId
  const [sparks, setSparks] = useState<Record<string, SparkComment[]>>({
    'art-1': [
      { id: 'sp-1', author: '하늘지기', content: '내가 고독을 써내려갈 때 비로소 타인의 고독을 만난다는 구절에 눈물 한 방울 흘리고 갑니다.', createdAt: '2026-05-25T12:00:00Z' }
    ]
  });
  const [authorInput, setAuthorInput] = useState('');
  const [contentInput, setContentInput] = useState('');
  const [sparkError, setSparkError] = useState('');

  const filteredArticles = selectedCategory === 'All' 
    ? articles 
    : articles.filter(art => art.category === selectedCategory);

  const handleAddSpark = (articleId: string) => {
    if (!authorInput.trim()) {
      setSparkError('필명을 입력해주세요.');
      return;
    }
    if (!contentInput.trim()) {
      setSparkError('한 줄 영감을 남겨주세요.');
      return;
    }

    const newSpark: SparkComment = {
      id: `sp-${Date.now()}`,
      author: authorInput.trim(),
      content: contentInput.trim(),
      createdAt: new Date().toISOString()
    };

    setSparks(prev => ({
      ...prev,
      [articleId]: [newSpark, ...prev[articleId] || []]
    }));

    setAuthorInput('');
    setContentInput('');
    setSparkError('');
  };

  return (
    <section id="archive" className="grid-border-cell" style={styles.section}>
      <div style={styles.header}>
        <span style={styles.preTitle}>Curation Store</span>
        <h2 className="serif-title" style={styles.title}>큐레이션 아카이브</h2>
        <p style={styles.introText}>
          그린비 작가의 고유한 통찰이 깃든 에세이와 기술 노하우, 잔잔한 일상 스크랩북입니다. 
          원하는 범주를 선택해 탐독해보고, 각 글에서 파생된 생각들을 공유게시판에 남겨 대화를 이어보세요.
        </p>
      </div>

      {/* Filter Tabs */}
      <div style={styles.filterBar}>
        {(['All', 'Essay', 'Tech', 'Daily'] as const).map((cat) => (
          <button
            key={cat}
            type="button"
            onClick={() => setSelectedCategory(cat)}
            style={{
              ...styles.filterBtn,
              borderBottom: selectedCategory === cat ? '2px solid var(--text-primary)' : '2px solid transparent',
              fontWeight: selectedCategory === cat ? 800 : 500,
              color: selectedCategory === cat ? 'var(--text-primary)' : 'var(--text-tertiary)',
            }}
          >
            {cat === 'All' ? 'ALL ARCHIVE' : cat.toUpperCase()}
          </button>
        ))}
      </div>

      {/* Grid Layout of Cards */}
      <div style={styles.cardGrid}>
        <AnimatePresence mode="popLayout">
          {filteredArticles.map((art) => (
            <motion.div
              key={art.id}
              layout
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.4 }}
              onClick={() => setSelectedArticle(art)}
              style={styles.articleCard}
              className="archive-card-hover"
            >
              {/* Gradient Banner representing aesthetic touch */}
              <div style={{ ...styles.cardBanner, background: art.gradient }} />
              
              <div style={styles.cardBody}>
                <div style={styles.cardMeta}>
                  <span style={styles.cardCat}>#{art.category}</span>
                  <span style={styles.cardReadTime}>{art.readTime}</span>
                </div>
                <h3 className="serif-title" style={styles.cardTitle}>{art.title}</h3>
                <p style={styles.cardDesc}>{art.description}</p>
                <div style={styles.cardFooter}>
                  <span style={styles.cardDate}>{art.date}</span>
                  <span style={styles.readMoreBtn}>
                    <span>읽기</span>
                    <BookOpen size={14} />
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Slide-over Fullscreen Magazine Modal */}
      <AnimatePresence>
        {selectedArticle && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={styles.modalOverlay}
            onClick={() => setSelectedArticle(null)}
          >
            <motion.div 
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              style={styles.modalContent}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close button */}
              <button 
                type="button"
                onClick={() => setSelectedArticle(null)} 
                style={styles.closeBtn}
                title="닫기"
              >
                <X size={24} />
              </button>

              <div style={styles.modalInner}>
                {/* Visual Header */}
                <div style={{ ...styles.modalHeaderVisual, background: selectedArticle.gradient }}>
                  <div style={styles.headerVisualOverlay}>
                    <span style={styles.modalHeaderCat}>{selectedArticle.category.toUpperCase()}</span>
                    <h1 className="serif-title" style={styles.modalHeaderTitle}>{selectedArticle.title}</h1>
                    <div style={styles.modalHeaderMeta}>
                      <span>작성일: {selectedArticle.date}</span>
                      <span>•</span>
                      <span>소요 시간: {selectedArticle.readTime}</span>
                    </div>
                  </div>
                </div>

                {/* Article Body */}
                <div style={styles.modalArticleContent}>
                  <div style={styles.quoteCard}>
                    <Quote size={28} style={styles.quoteHeaderIcon} />
                    <p className="serif-title" style={styles.quoteDesc}>{selectedArticle.description}</p>
                  </div>

                  <div style={styles.articleTextBody}>
                    {selectedArticle.content.split('\n\n').map((paragraph, index) => (
                      <p key={index} style={styles.articleParagraph}>{paragraph}</p>
                    ))}
                  </div>
                </div>

                {/* Sparks Interaction Zone (Community Wall) */}
                <div style={styles.sparksSection}>
                  <div style={styles.sparksHeader}>
                    <Sparkles size={18} style={{ color: 'var(--accent-orange)' }} />
                    <h3 className="serif-title" style={styles.sparksTitle}>Sparks: 생각의 정원</h3>
                  </div>
                  <p style={styles.sparksDesc}>
                    글을 읽고 마음에 떠오른 조각글이나 관련 지식을 자유롭게 띄워 다른 독자들에게 영감의 불씨를 번지게 하세요.
                  </p>

                  {/* Spark Form */}
                  <div style={styles.sparkForm}>
                    <div style={styles.sparkFormRow}>
                      <input 
                        type="text" 
                        placeholder="필명" 
                        value={authorInput}
                        onChange={(e) => setAuthorInput(e.target.value)}
                        style={styles.sparkAuthorInput}
                        maxLength={15}
                      />
                      <input 
                        type="text" 
                        placeholder="이 글에서 얻은 영감이나 관련 링크를 한 줄로 적어주세요..." 
                        value={contentInput}
                        onChange={(e) => setContentInput(e.target.value)}
                        style={styles.sparkContentInput}
                        maxLength={120}
                      />
                      <button 
                        type="button"
                        onClick={() => handleAddSpark(selectedArticle.id)}
                        style={styles.sparkSubmitBtn}
                      >
                        <Send size={14} />
                      </button>
                    </div>
                    {sparkError && <p style={styles.sparkErrorText}>{sparkError}</p>}
                  </div>

                  {/* Sparks Board */}
                  <div style={styles.sparksBoard}>
                    <AnimatePresence initial={false}>
                      {(sparks[selectedArticle.id] || []).length > 0 ? (
                        (sparks[selectedArticle.id] || []).map((sp) => (
                          <motion.div
                            key={sp.id}
                            initial={{ opacity: 0, y: 15 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0 }}
                            style={styles.sparkCard}
                          >
                            <span style={styles.sparkCardAuthor}>{sp.author}</span>
                            <p style={styles.sparkCardContent}>"{sp.content}"</p>
                            <span style={styles.sparkCardTime}>
                              {new Date(sp.createdAt).toLocaleDateString('ko-KR', { month: 'numeric', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                            </span>
                          </motion.div>
                        ))
                      ) : (
                        <div style={styles.emptySparks}>
                          아직 띄워진 조각글이 없습니다. 첫 번째 생각의 불씨를 지펴보세요! 🔥
                        </div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
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
  filterBar: {
    display: 'flex',
    gap: '1.5rem',
    borderBottom: '1px solid var(--grid-line)',
    paddingBottom: '0.5rem',
    overflowX: 'auto',
  },
  filterBtn: {
    padding: '0.5rem 0.25rem',
    fontSize: '0.75rem',
    cursor: 'pointer',
    letterSpacing: '0.1em',
    transition: 'var(--transition-fast)',
    whiteSpace: 'nowrap',
    backgroundColor: 'transparent',
  },
  cardGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
    gap: '2rem',
    marginTop: '1rem',
  },
  articleCard: {
    backgroundColor: 'var(--bg-primary)',
    border: '1px solid var(--grid-line)',
    borderRadius: '12px',
    cursor: 'pointer',
    overflow: 'hidden',
    display: 'flex',
    flexDirection: 'column',
    boxShadow: 'var(--card-shadow)',
    transition: 'transform 0.4s cubic-bezier(0.25, 0.8, 0.25, 1), box-shadow 0.4s ease, border-color 0.4s ease',
  },
  cardBanner: {
    height: '140px',
    width: '100%',
  },
  cardBody: {
    padding: '1.5rem',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    flex: 1,
    gap: '1rem',
  },
  cardMeta: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cardCat: {
    fontSize: '0.75rem',
    fontWeight: 700,
    color: 'var(--accent-green)',
    letterSpacing: '0.02em',
  },
  cardReadTime: {
    fontSize: '0.7rem',
    color: 'var(--text-tertiary)',
    fontWeight: 600,
  },
  cardTitle: {
    fontSize: '1.3rem',
    color: 'var(--text-primary)',
    lineHeight: '1.3',
  },
  cardDesc: {
    fontSize: '0.85rem',
    color: 'var(--text-secondary)',
    lineHeight: '1.5',
    flex: 1,
    wordBreak: 'keep-all',
  },
  cardFooter: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTop: '1px solid var(--grid-line)',
    paddingTop: '0.75rem',
  },
  cardDate: {
    fontSize: '0.75rem',
    color: 'var(--text-tertiary)',
    fontWeight: 600,
  },
  readMoreBtn: {
    fontSize: '0.75rem',
    fontWeight: 700,
    color: 'var(--text-primary)',
    display: 'flex',
    alignItems: 'center',
    gap: '0.375rem',
    textTransform: 'uppercase',
  },
  modalOverlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.4)',
    backdropFilter: 'blur(4px)',
    zIndex: 999,
    display: 'flex',
    justifyContent: 'flex-end',
  },
  modalContent: {
    width: '100%',
    maxWidth: '720px',
    height: '100%',
    backgroundColor: 'var(--bg-primary)',
    boxShadow: '-10px 0 40px rgba(0,0,0,0.15)',
    display: 'flex',
    flexDirection: 'column',
    position: 'relative',
  },
  closeBtn: {
    position: 'absolute',
    top: '20px',
    right: '20px',
    color: '#fff',
    backgroundColor: 'rgba(0,0,0,0.3)',
    border: 'none',
    width: '40px',
    height: '40px',
    borderRadius: '50%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    cursor: 'pointer',
    zIndex: 1001,
    transition: 'background-color 0.2s',
  },
  modalInner: {
    overflowY: 'auto',
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
  },
  modalHeaderVisual: {
    padding: '6rem 3rem 4rem',
    position: 'relative',
    color: '#FFF',
  },
  headerVisualOverlay: {
    position: 'relative',
    zIndex: 2,
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
  },
  modalHeaderCat: {
    fontSize: '0.75rem',
    fontWeight: 800,
    letterSpacing: '0.15em',
    color: 'var(--accent-orange)',
  },
  modalHeaderTitle: {
    fontSize: '2.25rem',
    lineHeight: '1.3',
    wordBreak: 'keep-all',
  },
  modalHeaderMeta: {
    display: 'flex',
    gap: '1rem',
    fontSize: '0.8rem',
    opacity: 0.8,
    fontWeight: 600,
  },
  modalArticleContent: {
    padding: '3rem',
    backgroundColor: 'var(--bg-primary)',
  },
  quoteCard: {
    borderLeft: '4px solid var(--accent-orange)',
    backgroundColor: 'var(--bg-secondary)',
    borderRadius: '8px',
    padding: '1.5rem',
    marginBottom: '2.5rem',
    position: 'relative',
  },
  quoteHeaderIcon: {
    color: 'var(--accent-orange-light)',
    position: 'absolute',
    top: '10px',
    right: '15px',
  },
  quoteDesc: {
    fontSize: '1.1rem',
    lineHeight: '1.6',
    color: 'var(--text-primary)',
    fontWeight: 500,
    wordBreak: 'keep-all',
  },
  articleTextBody: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1.75rem',
  },
  articleParagraph: {
    fontSize: '1rem',
    lineHeight: '1.9',
    color: 'var(--text-secondary)',
    textAlign: 'justify',
    wordBreak: 'keep-all',
  },
  sparksSection: {
    backgroundColor: 'var(--bg-secondary)',
    borderTop: '1px solid var(--grid-line)',
    padding: '3rem',
    display: 'flex',
    flexDirection: 'column',
    gap: '1.25rem',
  },
  sparksHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
  },
  sparksTitle: {
    fontSize: '1.35rem',
    color: 'var(--text-primary)',
  },
  sparksDesc: {
    fontSize: '0.85rem',
    color: 'var(--text-secondary)',
    lineHeight: '1.5',
    wordBreak: 'keep-all',
  },
  sparkForm: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem',
    backgroundColor: 'var(--bg-primary)',
    padding: '1rem',
    border: '1px solid var(--grid-line)',
    borderRadius: '12px',
  },
  sparkFormRow: {
    display: 'flex',
    gap: '0.5rem',
    alignItems: 'center',
  },
  sparkAuthorInput: {
    width: '100px',
    padding: '0.5rem 0.75rem',
    backgroundColor: 'var(--bg-secondary)',
    border: '1px solid var(--grid-line)',
    borderRadius: '6px',
    fontSize: '0.8rem',
    fontWeight: 600,
    color: 'var(--text-primary)',
  },
  sparkContentInput: {
    flex: 1,
    padding: '0.5rem 0.75rem',
    backgroundColor: 'var(--bg-secondary)',
    border: '1px solid var(--grid-line)',
    borderRadius: '6px',
    fontSize: '0.8rem',
    color: 'var(--text-primary)',
  },
  sparkSubmitBtn: {
    padding: '0.5rem',
    backgroundColor: 'var(--text-primary)',
    color: 'var(--bg-primary)',
    cursor: 'pointer',
    border: 'none',
    borderRadius: '6px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  sparkErrorText: {
    color: 'var(--accent-orange)',
    fontSize: '0.75rem',
    fontWeight: 600,
  },
  sparksBoard: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
    marginTop: '0.5rem',
  },
  sparkCard: {
    backgroundColor: 'var(--bg-primary)',
    border: '1px solid var(--grid-line)',
    padding: '1rem',
    borderRadius: '8px',
    display: 'flex',
    flexDirection: 'column',
    gap: '0.25rem',
    position: 'relative',
  },
  sparkCardAuthor: {
    fontSize: '0.75rem',
    fontWeight: 700,
    color: 'var(--accent-green)',
  },
  sparkCardContent: {
    fontSize: '0.85rem',
    fontStyle: 'italic',
    color: 'var(--text-secondary)',
    lineHeight: '1.4',
    wordBreak: 'keep-all',
  },
  sparkCardTime: {
    fontSize: '0.65rem',
    color: 'var(--text-tertiary)',
    alignSelf: 'flex-end',
  },
  emptySparks: {
    fontSize: '0.8rem',
    color: 'var(--text-tertiary)',
    textAlign: 'center',
    padding: '1.5rem',
    fontStyle: 'italic',
  },
};

if (typeof document !== 'undefined') {
  const styleTag = document.createElement('style');
  styleTag.textContent = `
    .archive-card-hover:hover {
      transform: translateY(-6px);
      box-shadow: var(--card-shadow-hover) !important;
      border-color: var(--text-primary) !important;
    }
  `;
  document.head.appendChild(styleTag);
}
