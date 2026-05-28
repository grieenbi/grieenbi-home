import React from 'react';
import { motion } from 'framer-motion';
import { X, Calendar, AlignLeft, BookOpen, Heart } from 'lucide-react';

interface ReaderProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  authorName: string;
  authorBio: string;
  authorJoinedAt: string;
  authorSentences: { id: string; content: string; likes: number; createdAt?: string }[];
}

export const ReaderProfileModal: React.FC<ReaderProfileModalProps> = ({
  isOpen,
  onClose,
  authorName,
  authorBio,
  authorJoinedAt,
  authorSentences,
}) => {
  if (!isOpen) return null;

  // Calculate total likes received by the author
  const totalLikes = authorSentences.reduce((acc, s) => acc + s.likes, 0);

  return (
    <div style={styles.modalOverlay} onClick={onClose}>
      <motion.div
        initial={{ opacity: 0, scale: 0.92, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.92, y: 15 }}
        transition={{ duration: 0.22, ease: 'easeOut' }}
        style={styles.modalCard}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button type="button" onClick={onClose} style={styles.closeBtn}>
          <X size={18} />
        </button>

        {/* Modal Header */}
        <div style={styles.modalHeader}>
          <span style={styles.preTitle}>Writer Profile</span>
          <h2 className="serif-title" style={styles.modalTitle}>
            ✒️ {authorName} 작가의 생각 정원
          </h2>
          <p style={styles.modalSubtitle}>
            그린비 스튜디오에서 이야기 조각을 빚어낸 기록입니다.
          </p>
        </div>

        {/* Stats Row */}
        <div style={styles.statsRow}>
          <div style={styles.statItem}>
            <span style={styles.statLabel}>조각글 수</span>
            <span style={styles.statVal}>{authorSentences.length}개</span>
          </div>
          <div style={styles.statItem}>
            <span style={styles.statLabel}>누적 공감</span>
            <span style={{ ...styles.statVal, color: 'var(--accent-orange)' }}>
              ❤️ {totalLikes}
            </span>
          </div>
          <div style={styles.statItem}>
            <span style={styles.statLabel}>작가 등급</span>
            <span style={{ ...styles.statVal, color: 'var(--accent-green)' }}>
              {authorSentences.length >= 5 ? '마스터 작가 👑' : authorSentences.length >= 3 ? '본격 작가 📜' : '새내기 작가 🌱'}
            </span>
          </div>
        </div>

        {/* Profile Details */}
        <div style={styles.detailsSection}>
          {/* Joined Date */}
          <div style={styles.detailRow}>
            <Calendar size={14} style={styles.detailIcon} />
            <div style={styles.detailContent}>
              <span style={styles.detailLabel}>정원 합류일</span>
              <span style={styles.detailVal}>{authorJoinedAt}</span>
            </div>
          </div>

          {/* Biography */}
          <div style={styles.detailRow}>
            <AlignLeft size={14} style={styles.detailIcon} />
            <div style={styles.detailContent}>
              <span style={styles.detailLabel}>작가 한 줄 자기소개</span>
              <p style={styles.bioText}>
                "{authorBio || '아직 가꾸지 않은 여백의 자기소개입니다. 문장으로 이야기를 이어가고 있습니다.'}"
              </p>
            </div>
          </div>
        </div>

        {/* Written Sentences Portfolio list */}
        <div style={styles.portfolioSection}>
          <div style={styles.portfolioHeader}>
            <BookOpen size={14} style={{ color: 'var(--accent-orange)' }} />
            <span style={styles.portfolioTitle}>작성한 이야기 조각 리스트</span>
          </div>

          <div style={styles.scrollList}>
            {authorSentences.length === 0 ? (
              <p style={styles.emptyText}>아직 기고한 에세이 문장이 없습니다.</p>
            ) : (
              authorSentences.map((s, idx) => (
                <div key={s.id} style={styles.sentenceCard}>
                  <div style={styles.cardHeader}>
                    <span style={styles.cardIndex}>#{idx + 1}</span>
                    <span style={styles.cardLike}>
                      <Heart size={10} fill="var(--accent-orange)" color="var(--accent-orange)" />
                      <span>{s.likes}</span>
                    </span>
                  </div>
                  <p className="serif-title" style={styles.sentenceContent}>
                    "{s.content}"
                  </p>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Action Button */}
        <button type="button" onClick={onClose} className="btn-primary" style={styles.confirmBtn}>
          확인
        </button>
      </motion.div>
    </div>
  );
};

const styles: Record<string, React.CSSProperties> = {
  modalOverlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(4, 13, 33, 0.45)',
    backdropFilter: 'blur(6px)',
    zIndex: 1100, // higher than normal modal to overlap other modals if needed
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '1rem',
  },
  modalCard: {
    backgroundColor: 'var(--bg-primary)',
    border: '1px solid var(--grid-line)',
    borderRadius: '16px',
    boxShadow: '0 25px 60px rgba(10, 17, 40, 0.3)',
    width: '100%',
    maxWidth: '480px',
    padding: '2.5rem',
    position: 'relative',
    display: 'flex',
    flexDirection: 'column',
    gap: '1.25rem',
  },
  closeBtn: {
    position: 'absolute',
    top: '16px',
    right: '16px',
    cursor: 'pointer',
    color: 'var(--text-secondary)',
    padding: '0.25rem',
    transition: 'var(--transition-fast)',
    backgroundColor: 'transparent',
    border: 'none',
  },
  modalHeader: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.25rem',
    textAlign: 'center',
  },
  preTitle: {
    fontSize: '0.65rem',
    fontWeight: 800,
    color: 'var(--text-tertiary)',
    textTransform: 'uppercase',
    letterSpacing: '0.12em',
  },
  modalTitle: {
    fontSize: '1.35rem',
    color: 'var(--text-primary)',
    marginTop: '0.25rem',
  },
  modalSubtitle: {
    fontSize: '0.8rem',
    color: 'var(--text-secondary)',
    lineHeight: '1.4',
  },
  statsRow: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    backgroundColor: 'var(--bg-secondary)',
    border: '1px solid var(--grid-line)',
    borderRadius: '10px',
    padding: '0.75rem',
    textAlign: 'center',
    gap: '0.5rem',
  },
  statItem: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.15rem',
  },
  statLabel: {
    fontSize: '0.65rem',
    color: 'var(--text-tertiary)',
    fontWeight: 600,
  },
  statVal: {
    fontSize: '0.85rem',
    fontWeight: 700,
    color: 'var(--text-primary)',
  },
  detailsSection: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.85rem',
    borderBottom: '1px solid var(--grid-line)',
    paddingBottom: '1rem',
  },
  detailRow: {
    display: 'flex',
    gap: '0.75rem',
    alignItems: 'flex-start',
  },
  detailIcon: {
    color: 'var(--text-tertiary)',
    marginTop: '0.2rem',
    flexShrink: 0,
  },
  detailContent: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.15rem',
    textAlign: 'left',
  },
  detailLabel: {
    fontSize: '0.65rem',
    fontWeight: 800,
    color: 'var(--text-tertiary)',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
  },
  detailVal: {
    fontSize: '0.8rem',
    color: 'var(--text-primary)',
    fontWeight: 600,
  },
  bioText: {
    fontSize: '0.85rem',
    fontStyle: 'italic',
    color: 'var(--text-secondary)',
    lineHeight: '1.5',
    wordBreak: 'keep-all',
    marginTop: '0.15rem',
  },
  portfolioSection: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.75rem',
    textAlign: 'left',
  },
  portfolioHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.4rem',
  },
  portfolioTitle: {
    fontSize: '0.75rem',
    fontWeight: 800,
    color: 'var(--text-primary)',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
  },
  scrollList: {
    maxHeight: '160px',
    overflowY: 'auto',
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem',
    paddingRight: '0.25rem',
  },
  sentenceCard: {
    backgroundColor: 'var(--bg-secondary)',
    border: '1px solid var(--grid-line)',
    borderRadius: '8px',
    padding: '0.75rem',
    display: 'flex',
    flexDirection: 'column',
    gap: '0.4rem',
  },
  cardHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cardIndex: {
    fontSize: '0.65rem',
    color: 'var(--text-tertiary)',
    fontWeight: 700,
  },
  cardLike: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.2rem',
    fontSize: '0.65rem',
    fontWeight: 700,
    color: 'var(--accent-orange)',
  },
  sentenceContent: {
    fontSize: '0.85rem',
    color: 'var(--text-primary)',
    lineHeight: '1.4',
    wordBreak: 'keep-all',
  },
  emptyText: {
    fontSize: '0.8rem',
    color: 'var(--text-tertiary)',
    fontStyle: 'italic',
  },
  confirmBtn: {
    width: '100%',
    justifyContent: 'center',
    borderRadius: '8px',
    marginTop: '0.5rem',
  },
};
