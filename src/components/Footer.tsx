import React from 'react';
import { Mail, Globe, Link2, ArrowUp } from 'lucide-react';

export const Footer: React.FC = () => {
  const handleScrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer style={styles.footer}>
      <div style={styles.gridContainer}>
        {/* Col 1: Colophon / Author Note */}
        <div style={styles.footerCell}>
          <span style={styles.colLabel}>COLOPHON</span>
          <p className="serif-title" style={styles.authorNote}>
            "문장은 보이지 않는 생각의 뼈대이며, 기술은 그것을 실체화하는 단단한 그릇이다."
          </p>
          <p style={styles.desc}>
            GRIEENBI STUDIO는 글을 사랑하는 이들과 지식의 최전선에서 고민하는 이들이 만나 문학적 감수성과 기술적 사유를 연결하는 인터랙티브 공유 매거진입니다.
          </p>
        </div>

        {/* Col 2: Navigation Links */}
        <div style={styles.footerCell}>
          <span style={styles.colLabel}>INDEX</span>
          <ul style={styles.linkList}>
            <li><a href="#hero" style={styles.link}>01 / COVER</a></li>
            <li><a href="#relay" style={styles.link}>02 / RELAY ESSAY</a></li>
            <li><a href="#generator" style={styles.link}>03 / ORACLE GENERATOR</a></li>
          </ul>
        </div>

        {/* Col 3: Contact & Links */}
        <div style={styles.footerCell}>
          <span style={styles.colLabel}>CONNECTION</span>
          <div style={styles.contactRow}>
            <a href="mailto:foodyheo@gmail.com" style={styles.link}>foodyheo@gmail.com</a>
          </div>
        </div>
      </div>

      <div style={styles.bottomBar}>
        <p style={styles.copyright}>
          © 2026 GRIEENBI STUDIO. All rights reserved. Designed with ultimate aesthetics & tech.
        </p>
        <span style={styles.edition}>FIRST EDITION // MAY 2026</span>
      </div>
    </footer>
  );
};

const styles: Record<string, React.CSSProperties> = {
  footer: {
    width: '100%',
    backgroundColor: 'var(--bg-secondary)',
    borderTop: '1px solid var(--grid-line)',
  },
  gridContainer: {
    display: 'grid',
    gridTemplateColumns: '1.2fr 0.8fr 1fr',
    borderBottom: '1px solid var(--grid-line)',
  },
  footerCell: {
    padding: '3rem 2.5rem',
    borderRight: '1px solid var(--grid-line)',
    display: 'flex',
    flexDirection: 'column',
    gap: '1.25rem',
  },
  colLabel: {
    fontSize: '0.65rem',
    fontWeight: 800,
    letterSpacing: '0.15em',
    color: 'var(--text-tertiary)',
    textTransform: 'uppercase',
  },
  authorNote: {
    fontSize: '1.15rem',
    lineHeight: '1.5',
    color: 'var(--accent-green)',
    wordBreak: 'keep-all',
  },
  desc: {
    fontSize: '0.8rem',
    color: 'var(--text-secondary)',
    lineHeight: '1.6',
    wordBreak: 'keep-all',
  },
  linkList: {
    listStyle: 'none',
    display: 'flex',
    flexDirection: 'column',
    gap: '0.75rem',
  },
  link: {
    fontSize: '0.8rem',
    fontWeight: 700,
    letterSpacing: '0.05em',
    color: 'var(--text-secondary)',
    transition: 'var(--transition-fast)',
  },
  contactRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
  },
  icon: {
    color: 'var(--accent-orange)',
  },
  socialIcons: {
    display: 'flex',
    gap: '1rem',
    marginTop: '0.25rem',
  },
  socialLink: {
    color: 'var(--text-secondary)',
    transition: 'var(--transition-fast)',
  },
  scrollTopBtn: {
    marginTop: 'auto',
    alignSelf: 'flex-start',
    padding: '0.5rem 1rem',
    fontSize: '0.75rem',
  },
  bottomBar: {
    padding: '1.5rem 2.5rem',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    fontSize: '0.75rem',
    color: 'var(--text-tertiary)',
    fontWeight: 600,
    flexWrap: 'wrap',
    gap: '1rem',
  },
  copyright: {
    letterSpacing: '0.02em',
  },
  edition: {
    letterSpacing: '0.08em',
  },
};

if (typeof document !== 'undefined') {
  const styleTag = document.createElement('style');
  styleTag.textContent = `
    @media (max-width: 900px) {
      footer > div:first-child {
        grid-template-columns: 1fr !important;
      }
      footer > div:first-child > div {
        border-right: none !important;
        border-bottom: 1px solid var(--grid-line) !important;
        padding: 2rem 1.5rem !important;
      }
    }
  `;
  document.head.appendChild(styleTag);
}
export default Footer;
