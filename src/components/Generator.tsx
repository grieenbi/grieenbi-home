import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, RefreshCw, Copy, ExternalLink, Compass } from 'lucide-react';
import { initialInspirationDatabase } from '../data/initialData';
import type { InspirationTip } from '../data/initialData';

interface GeneratorProps {
  onSelectPrompt: (promptText: string) => void;
}

export const Generator: React.FC<GeneratorProps> = ({ onSelectPrompt }) => {
  const [activeTip, setActiveTip] = useState<InspirationTip | null>(null);
  const [isFlipped, setIsFlipped] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleDrawCard = () => {
    // Daily limit using localStorage
    const today = new Date().toISOString().split('T')[0];
    const lastDraw = localStorage.getItem('inspirationCardLastDraw');
    if (lastDraw === today) {
      alert('오늘은 이미 영감 카드를 뽑으셨습니다. 내일 다시 시도해주세요.');
      return;
    }
    // Record today's draw
    localStorage.setItem('inspirationCardLastDraw', today);

    setIsFlipped(false);
    
    // Combine all tips into one database
    const db = [
      ...initialInspirationDatabase.novel,
      ...initialInspirationDatabase.essay,
      ...initialInspirationDatabase.planning
    ];

    // Slight delay to allow flip back before changing content
    setTimeout(() => {
      const randomIndex = Math.floor(Math.random() * db.length);
      setActiveTip(db[randomIndex]);
      setIsFlipped(true);
    }, 200);
  };

  const handleCopyText = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getTipCategory = (tipId: string): string => {
    if (tipId.startsWith('n-tip')) return '소설 반전 서사 🎭';
    if (tipId.startsWith('e-tip')) return '에세이 도입부 ✒️';
    return '주말 특별 기획 🗺️';
  };

  return (
    <section id="generator" className="grid-border-cell" style={styles.section} data-guide-label="창작 영감 발전기 섹션 (Generator)">
      <div style={styles.header}>
        <span style={styles.preTitle}>Interactive Oracle</span>
        <h2 className="serif-title" style={styles.title}>창작 영감 발전기</h2>
        <p style={styles.introText}>
          창작의 첫 문장을 떼기 어렵거나 지루한 주말의 특별한 영감이 필요하신가요? 
          아래 버튼을 눌러 3D 오라클 카드가 제안하는 뜻밖의 서사와 활동을 무작위로 관찰해보세요. 하루에 한 번만 뽑을 수 있습니다.
        </p>
      </div>

      <div style={styles.mainGrid}>
        {/* Left Side: Controller (No Tabs, Single Button & Description) */}
        <div style={styles.controlPanel} data-guide-label="영감 컨트롤러 영역 (Generator - Controller)">
          <div style={styles.guideTextArea}>
            <span style={styles.helperLabel}>Oracle Guide</span>
            <p style={styles.guideText}>
              카테고리 구분 없이 무작위로 신비로운 영감 카드가 뽑힙니다. 
              때로는 뜻밖의 장르와 활동을 마주할 때, 잠들어 있던 창작의 무의식이 깨어납니다. 
              아래 버튼을 눌러 당신만의 오라클 카드를 획득해 보세요.
            </p>
          </div>

          <button 
            type="button"
            onClick={handleDrawCard} 
            className="btn-primary" 
            style={styles.drawBtn}
            data-guide-label="영감 카드 뽑기 버튼 (Generator - Draw Button)"
          >
            <Sparkles size={16} />
            <span>영감 카드 뽑기</span>
          </button>
        </div>

        {/* Right Side: Interactive Flip Card */}
        <div style={styles.cardContainer} data-guide-label="3D 오라클 플립 카드 (Generator - Oracle Card)">
          <div style={styles.perspectiveWrapper}>
            <motion.div
              style={styles.flipCard}
              animate={{ rotateY: isFlipped ? 180 : 0 }}
              transition={{ duration: 0.6, ease: [0.23, 1, 0.32, 1] }}
            >
              {/* CARD FRONT (Unflipped) */}
              <div style={styles.cardFront}>
                <div style={styles.cardFrame}>
                  <Compass size={48} style={styles.frontIcon} />
                  <span className="serif-title" style={styles.frontTitle}>Grieenbi's Oracle</span>
                  <p style={styles.frontDesc}>버튼을 누르고 카드를 뽑아 신비로운 창작 영감을 획득해보세요.</p>
                  <div style={styles.cardCornerTopLeft}>✒️</div>
                  <div style={styles.cardCornerBottomRight}>✒️</div>
                </div>
              </div>

              {/* CARD BACK (Flipped & Content) */}
              <div style={styles.cardBack}>
                {activeTip && (
                  <div style={styles.cardBackFrame}>
                    <div style={styles.cardBackHeader}>
                      <span style={styles.cardBackCat}>{getTipCategory(activeTip.id)}</span>
                      <button 
                        type="button"
                        onClick={handleDrawCard} 
                        style={styles.redoBtn} 
                        title="다시 뽑기"
                      >
                        <RefreshCw size={14} />
                      </button>
                    </div>

                    <h4 className="serif-title" style={styles.tipTitle}>
                      {activeTip.title}
                    </h4>
                    
                    <p style={styles.tipContent}>
                      {activeTip.content}
                    </p>

                    <div style={styles.helperBox} data-guide-label="실천 제안 팁 박스 (Generator - Helper Box)">
                      <span style={styles.helperLabel}>실천 팁</span>
                      <p style={styles.helperText}>{activeTip.helper}</p>
                    </div>

                    <div style={styles.promptBox} data-guide-label="제안 오프닝 문장 박스 (Generator - Prompt Box)">
                      <span style={styles.promptBoxLabel}>제안하는 오프닝 문장 (클릭 시 복사)</span>
                      <p 
                        onClick={() => handleCopyText(activeTip.suggestedPrompt)} 
                        style={styles.promptText}
                        title="클릭하여 복사"
                      >
                        "{activeTip.suggestedPrompt}"
                      </p>
                      {copied && <span style={styles.copyBadge}>복사됨!</span>}
                    </div>

                    <div style={styles.cardBackActions} data-guide-label="영감 복사 & 에세이 연동 액션바 (Generator - Actions)">
                      <button 
                        type="button"
                        onClick={() => handleCopyText(activeTip.suggestedPrompt)} 
                        style={styles.actionBtnText}
                      >
                        <Copy size={12} />
                        <span>텍스트 복사</span>
                      </button>
                      <button 
                        type="button"
                        onClick={() => {
                          onSelectPrompt(activeTip.suggestedPrompt);
                          // Smooth scroll to relay essay section
                          const el = document.getElementById('relay');
                          if (el) el.scrollIntoView({ behavior: 'smooth' });
                        }} 
                        style={styles.actionBtnTextPrimary}
                      >
                        <ExternalLink size={12} />
                        <span>이 문장으로 에세이 참여</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};

const styles: Record<string, React.CSSProperties> = {
  section: {
    display: 'flex',
    flexDirection: 'column',
    gap: '2.5rem',
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
  mainGrid: {
    display: 'grid',
    gridTemplateColumns: '0.8fr 1.2fr',
    gap: '3rem',
    alignItems: 'center',
  },
  controlPanel: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1.5rem',
  },
  tabList: {
    display: 'flex',
    flexDirection: 'column',
    borderLeft: '1px solid var(--grid-line)',
  },
  tabBtn: {
    padding: '1rem 1.5rem',
    fontSize: '0.9rem',
    fontWeight: 700,
    textAlign: 'left',
    cursor: 'pointer',
    transition: 'var(--transition-smooth)',
  },
  drawBtn: {
    alignSelf: 'flex-start',
    padding: '1rem 2rem',
    boxShadow: '0 4px 14px rgba(255, 76, 41, 0.15)',
  },
  cardContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '1rem 0',
  },
  perspectiveWrapper: {
    perspective: '1200px',
    width: '320px',
    height: '460px',
  },
  flipCard: {
    width: '100%',
    height: '100%',
    position: 'relative',
    transformStyle: 'preserve-3d',
  },
  cardFront: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    backfaceVisibility: 'hidden',
    backgroundColor: 'var(--accent-green)',
    color: '#FCFBF9',
    borderRadius: '12px',
    padding: '1.5rem',
    boxShadow: 'var(--card-shadow-hover)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardFrame: {
    border: '1px solid rgba(252, 251, 249, 0.2)',
    width: '100%',
    height: '100%',
    borderRadius: '8px',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '2rem',
    textAlign: 'center',
    position: 'relative',
  },
  frontIcon: {
    color: 'var(--accent-orange)',
    marginBottom: '1.5rem',
  },
  frontTitle: {
    fontSize: '1.5rem',
    fontWeight: 600,
    letterSpacing: '0.05em',
    marginBottom: '1rem',
  },
  frontDesc: {
    fontSize: '0.8rem',
    lineHeight: '1.6',
    color: '#EFECE6',
    wordBreak: 'keep-all',
  },
  cardCornerTopLeft: {
    position: 'absolute',
    top: '12px',
    left: '12px',
    fontSize: '0.9rem',
    opacity: 0.6,
  },
  cardCornerBottomRight: {
    position: 'absolute',
    bottom: '12px',
    right: '12px',
    fontSize: '0.9rem',
    opacity: 0.6,
  },
  cardBack: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    backfaceVisibility: 'hidden',
    backgroundColor: 'var(--bg-secondary)',
    color: 'var(--text-primary)',
    borderRadius: '12px',
    padding: '1.5rem',
    boxShadow: 'var(--card-shadow-hover)',
    transform: 'rotateY(180deg)',
    border: '1px solid var(--grid-line)',
  },
  cardBackFrame: {
    border: '1px solid var(--grid-line)',
    width: '100%',
    height: '100%',
    borderRadius: '8px',
    display: 'flex',
    flexDirection: 'column',
    padding: '1.5rem',
    position: 'relative',
    justifyContent: 'space-between',
  },
  cardBackHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cardBackCat: {
    fontSize: '0.75rem',
    fontWeight: 800,
    color: 'var(--accent-green)',
  },
  redoBtn: {
    cursor: 'pointer',
    color: 'var(--text-tertiary)',
    padding: '0.25rem',
    borderRadius: '50%',
    transition: 'var(--transition-fast)',
  },
  tipTitle: {
    fontSize: '1.1rem',
    color: 'var(--text-primary)',
    marginTop: '0.5rem',
    fontWeight: 700,
  },
  tipContent: {
    fontSize: '0.8rem',
    lineHeight: '1.5',
    color: 'var(--text-secondary)',
    wordBreak: 'keep-all',
  },
  helperBox: {
    backgroundColor: 'var(--bg-primary)',
    borderLeft: '2px solid var(--accent-green)',
    padding: '0.5rem 0.75rem',
    fontSize: '0.75rem',
    borderRadius: '6px',
  },
  helperLabel: {
    fontWeight: 800,
    color: 'var(--accent-green)',
    display: 'block',
    marginBottom: '0.15rem',
  },
  helperText: {
    color: 'var(--text-secondary)',
    lineHeight: '1.4',
  },
  promptBox: {
    backgroundColor: 'var(--bg-primary)',
    border: '1px dashed var(--grid-line)',
    padding: '0.6rem 0.8rem',
    position: 'relative',
    cursor: 'pointer',
    borderRadius: '6px',
    transition: 'background-color 0.2s',
  },
  promptBoxLabel: {
    fontSize: '0.65rem',
    fontWeight: 700,
    color: 'var(--text-tertiary)',
    display: 'block',
    marginBottom: '0.25rem',
  },
  promptText: {
    fontSize: '0.8rem',
    lineHeight: '1.4',
    fontStyle: 'italic',
    fontWeight: 500,
    color: 'var(--accent-orange)',
    wordBreak: 'keep-all',
  },
  copyBadge: {
    position: 'absolute',
    right: '8px',
    top: '4px',
    backgroundColor: 'var(--accent-green)',
    color: '#fff',
    fontSize: '0.6rem',
    padding: '0.1rem 0.3rem',
    borderRadius: '2px',
  },
  cardBackActions: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: '0.5rem',
    borderTop: '1px solid var(--grid-line)',
    paddingTop: '0.75rem',
  },
  actionBtnText: {
    fontSize: '0.7rem',
    fontWeight: 700,
    display: 'flex',
    alignItems: 'center',
    gap: '0.25rem',
    color: 'var(--text-secondary)',
    cursor: 'pointer',
    backgroundColor: 'transparent',
    border: 'none',
  },
  actionBtnTextPrimary: {
    fontSize: '0.7rem',
    fontWeight: 800,
    display: 'flex',
    alignItems: 'center',
    gap: '0.25rem',
    color: 'var(--accent-orange)',
    cursor: 'pointer',
    backgroundColor: 'transparent',
    border: 'none',
  },
  guideTextArea: {
    backgroundColor: 'var(--bg-secondary)',
    borderLeft: '3px solid var(--accent-orange)',
    padding: '1.25rem',
    borderRadius: '8px',
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem',
    textAlign: 'left',
  },
  guideText: {
    fontSize: '0.85rem',
    color: 'var(--text-secondary)',
    lineHeight: '1.6',
    wordBreak: 'keep-all',
  },
};

if (typeof document !== 'undefined') {
  const styleTag = document.createElement('style');
  styleTag.textContent = `
    @media (max-width: 900px) {
      #generator > div {
        grid-template-columns: 1fr !important;
        gap: 1.5rem !important;
      }
      #generator button {
        align-self: center !important;
      }
    }
  `;
  document.head.appendChild(styleTag);
}
export default Generator;
