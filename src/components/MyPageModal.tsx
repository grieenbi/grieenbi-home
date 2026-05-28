import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { X, User, Mail, AlignLeft, ShieldAlert, Award, Check } from 'lucide-react';
import { updateProfile, deleteUser } from 'firebase/auth';
import { auth } from '../firebase';

interface MyPageModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: { nickname: string; email: string } | null;
  onProfileUpdate: (newNickname: string) => void;
  onWithdrawSuccess: () => void;
}

export const MyPageModal: React.FC<MyPageModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  onProfileUpdate,
  onWithdrawSuccess,
}) => {
  const [nickname, setNickname] = useState('');
  const [bio, setBio] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showWithdrawConfirm, setShowWithdrawConfirm] = useState(false);

  // Sync state with current user and bio from localStorage when modal opens
  useEffect(() => {
    if (currentUser) {
      setNickname(currentUser.nickname);
      const savedBio = localStorage.getItem(`grieenbi-bio-${currentUser.email}`) || '';
      setBio(savedBio);
    }
    setError('');
    setSuccess('');
    setShowWithdrawConfirm(false);
  }, [currentUser, isOpen]);

  if (!isOpen || !currentUser) return null;

  // Handle Profile Update (Nickname & Bio)
  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!nickname.trim()) {
      setError('변경할 필명을 입력해 주세요.');
      return;
    }

    try {
      const user = auth.currentUser;
      if (user) {
        // Update display name in Firebase Auth
        await updateProfile(user, { displayName: nickname.trim() });
      }

      // Save bio in localStorage
      localStorage.setItem(`grieenbi-bio-${currentUser.email}`, bio.trim());

      // Update parent state
      onProfileUpdate(nickname.trim());

      setSuccess('프로필 설정이 정상적으로 반영되었습니다.');
      setTimeout(() => setSuccess(''), 2000);
    } catch (err: any) {
      console.error(err);
      setError('프로필 수정 중 오류가 발생했습니다. 다시 시도해 주세요.');
    }
  };

  // Handle Account Withdrawal (Delete User)
  const handleWithdraw = async () => {
    setError('');
    setSuccess('');

    const user = auth.currentUser;
    if (!user) {
      setError('인증 정보가 만료되었습니다. 다시 로그인해 주세요.');
      return;
    }

    try {
      // Trigger user deletion in Firebase Auth
      await deleteUser(user);
      
      // Clean up localStorage data
      localStorage.removeItem(`grieenbi-bio-${currentUser.email}`);
      localStorage.removeItem('grieenbi-current-user');

      setSuccess('탈퇴가 정상 처리되었습니다. 그동안 함께여서 따뜻했습니다.');
      setTimeout(() => {
        onWithdrawSuccess();
        onClose();
      }, 2000);
    } catch (err: any) {
      console.error(err);
      if (err.code === 'auth/requires-recent-login') {
        setError('보안 상의 이유로 최근 로그인 세션이 필요합니다. 로그아웃 후 다시 로그인한 뒤 회원탈퇴를 진행해 주세요.');
      } else {
        setError('회원 탈퇴 중 오류가 발생했습니다. 관리자에게 문의 바랍니다.');
      }
    }
  };

  // Detect Auth Provider for premium badge
  const getProviderBadge = () => {
    const user = auth.currentUser;
    if (!user) return '그린비 작가';
    const providerId = user.providerData[0]?.providerId;
    if (providerId === 'google.com') return '구글 간편 작가 🌐';
    if (providerId === 'password' && currentUser.email.includes('kakao')) return '카카오 간편 작가 💛';
    if (currentUser.email === 'grieenbi@example.com') return '그린비 명예 작가 👑';
    return '그린비 이메일 작가 ✉️';
  };

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
          <h2 className="serif-title" style={styles.modalTitle}>내 작업실 프로필 설정</h2>
          <p style={styles.modalSubtitle}>그린비 스튜디오에서 활동하는 소중한 님을 가꾸는 공간입니다.</p>
        </div>

        {/* Brand Badge */}
        <div style={styles.badgeContainer}>
          <div className="badge badge-orange" style={{ alignSelf: 'center' }}>
            <Award size={12} />
            <span>{getProviderBadge()}</span>
          </div>
        </div>

        {/* Form Settings */}
        <form onSubmit={handleUpdateProfile} style={styles.form}>
          {/* Email Info (Read Only) */}
          <div style={styles.inputGroup}>
            <label style={styles.inputLabel}>
              <Mail size={12} />
              <span>로그인 이메일 (변경 불가)</span>
            </label>
            <div style={styles.readOnlyInput}>
              {currentUser.email}
            </div>
          </div>

          {/* Nickname Modify */}
          <div style={styles.inputGroup}>
            <label style={styles.inputLabel}>
              <User size={12} />
              <span>작가 필명 (닉네임)</span>
            </label>
            <div style={styles.inputWrapper}>
              <input
                type="text"
                value={nickname}
                onChange={(e) => setNickname(e.target.value)}
                style={styles.inputField}
                maxLength={12}
                placeholder="새로운 필명 입력..."
              />
            </div>
          </div>

          {/* Bio Settings */}
          <div style={styles.inputGroup}>
            <label style={styles.inputLabel}>
              <AlignLeft size={12} />
              <span>한 줄 작가 소개 (자기소개)</span>
            </label>
            <div style={styles.inputWrapper}>
              <textarea
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                style={styles.textareaField}
                maxLength={60}
                placeholder="독자들에게 보일 나만의 한 줄 자기소개를 입력해 주세요. (최대 60자)"
              />
            </div>
          </div>

          {/* Alerts Box */}
          {error && <p style={styles.errorText}>{error}</p>}
          {success && (
            <div style={styles.successBox}>
              <Check size={16} />
              <span>{success}</span>
            </div>
          )}

          {/* Action Row */}
          <div style={styles.actionRow}>
            <button type="submit" className="btn-primary" style={styles.submitBtn}>
              💾 설정 저장하기
            </button>
            <button type="button" onClick={onClose} style={styles.cancelBtn}>
              닫기
            </button>
          </div>
        </form>

        {/* Account Withdrawal Area */}
        <div style={styles.withdrawalBox}>
          {!showWithdrawConfirm ? (
            <div style={styles.withdrawalInfoRow}>
              <span style={styles.withdrawalText}>아쉽지만 스튜디오 작가직을 내려놓으시겠습니까?</span>
              <button
                type="button"
                onClick={() => setShowWithdrawConfirm(true)}
                style={styles.withdrawTriggerBtn}
              >
                회원 탈퇴
              </button>
            </div>
          ) : (
            <div style={styles.withdrawalConfirmCol}>
              <div style={styles.warnHeader}>
                <ShieldAlert size={16} style={{ color: 'var(--accent-orange)' }} />
                <span style={styles.warnText}>주의: 정말로 탈퇴하시겠습니까?</span>
              </div>
              <p style={styles.warnDesc}>
                탈퇴 즉시 이메일 인증 계정이 파기되며, 더 이상 동일한 정보로 로그인할 수 없습니다. 독자님이 작성하신 릴레이 에세이 조각들은 남아있게 됩니다.
              </p>
              <div style={styles.warnActionRow}>
                <button
                  type="button"
                  onClick={handleWithdraw}
                  style={styles.withdrawConfirmBtn}
                >
                  ⚠️ 네, 탈퇴하겠습니다
                </button>
                <button
                  type="button"
                  onClick={() => setShowWithdrawConfirm(false)}
                  style={styles.withdrawCancelBtn}
                >
                  취소
                </button>
              </div>
            </div>
          )}
        </div>
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
    zIndex: 1000,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '1rem',
  },
  modalCard: {
    backgroundColor: 'var(--bg-primary)',
    border: '1px solid var(--grid-line)',
    borderRadius: '16px',
    boxShadow: '0 20px 50px rgba(10, 17, 40, 0.25)',
    width: '100%',
    maxWidth: '460px',
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
    gap: '0.375rem',
    textAlign: 'center',
  },
  modalTitle: {
    fontSize: '1.4rem',
    color: 'var(--text-primary)',
  },
  modalSubtitle: {
    fontSize: '0.8rem',
    color: 'var(--text-secondary)',
    lineHeight: '1.4',
  },
  badgeContainer: {
    display: 'flex',
    justifyContent: 'center',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
  },
  inputGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.4rem',
  },
  inputLabel: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.3rem',
    fontSize: '0.7rem',
    fontWeight: 700,
    color: 'var(--text-secondary)',
    letterSpacing: '0.05em',
  },
  readOnlyInput: {
    width: '100%',
    padding: '0.75rem 1rem',
    backgroundColor: 'var(--bg-secondary)',
    border: '1px solid var(--grid-line)',
    borderRadius: '8px',
    fontSize: '0.85rem',
    color: 'var(--text-tertiary)',
    boxSizing: 'border-box',
  },
  inputWrapper: {
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
    width: '100%',
  },
  inputField: {
    width: '100%',
    padding: '0.75rem 1rem',
    backgroundColor: 'var(--bg-secondary)',
    border: '1px solid var(--grid-line)',
    borderRadius: '8px',
    fontSize: '0.85rem',
    color: 'var(--text-primary)',
    transition: 'var(--transition-fast)',
    boxSizing: 'border-box',
  },
  textareaField: {
    width: '100%',
    height: '80px',
    padding: '0.75rem 1rem',
    backgroundColor: 'var(--bg-secondary)',
    border: '1px solid var(--grid-line)',
    borderRadius: '8px',
    fontSize: '0.85rem',
    color: 'var(--text-primary)',
    transition: 'var(--transition-fast)',
    boxSizing: 'border-box',
    resize: 'none',
    fontFamily: 'var(--font-sans)',
    lineHeight: '1.5',
  },
  errorText: {
    color: 'var(--accent-orange)',
    fontSize: '0.75rem',
    fontWeight: 600,
    textAlign: 'center',
    lineHeight: '1.4',
  },
  successBox: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '0.5rem',
    color: '#2B4C3F',
    backgroundColor: 'rgba(43, 76, 63, 0.1)',
    padding: '0.6rem',
    borderRadius: '8px',
    fontSize: '0.8rem',
    fontWeight: 600,
  },
  actionRow: {
    display: 'flex',
    gap: '0.5rem',
    width: '100%',
  },
  submitBtn: {
    flex: 2,
    justifyContent: 'center',
    borderRadius: '8px',
  },
  cancelBtn: {
    flex: 1,
    padding: '0.65rem 1.5rem',
    fontSize: '0.85rem',
    fontWeight: 700,
    backgroundColor: 'transparent',
    border: '1px solid var(--grid-line)',
    color: 'var(--text-secondary)',
    borderRadius: '8px',
    cursor: 'pointer',
    transition: 'var(--transition-fast)',
  },
  withdrawalBox: {
    marginTop: '0.5rem',
    paddingTop: '1rem',
    borderTop: '1px dashed var(--grid-line)',
    width: '100%',
  },
  withdrawalInfoRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
  },
  withdrawalText: {
    fontSize: '0.7rem',
    color: 'var(--text-tertiary)',
  },
  withdrawTriggerBtn: {
    fontSize: '0.7rem',
    fontWeight: 700,
    color: 'var(--text-tertiary)',
    backgroundColor: 'transparent',
    border: 'none',
    textDecoration: 'underline',
    cursor: 'pointer',
  },
  withdrawalConfirmCol: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem',
    textAlign: 'left',
    width: '100%',
  },
  warnHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.3rem',
  },
  warnText: {
    fontSize: '0.75rem',
    fontWeight: 700,
    color: 'var(--accent-orange)',
  },
  warnDesc: {
    fontSize: '0.7rem',
    color: 'var(--text-secondary)',
    lineHeight: '1.4',
    wordBreak: 'keep-all',
  },
  warnActionRow: {
    display: 'flex',
    gap: '0.5rem',
    marginTop: '0.25rem',
  },
  withdrawConfirmBtn: {
    fontSize: '0.7rem',
    fontWeight: 700,
    color: '#FFFFFF',
    backgroundColor: 'var(--accent-orange)',
    border: 'none',
    padding: '0.35rem 0.75rem',
    borderRadius: '4px',
    cursor: 'pointer',
  },
  withdrawCancelBtn: {
    fontSize: '0.7rem',
    fontWeight: 700,
    color: 'var(--text-secondary)',
    backgroundColor: 'transparent',
    border: '1px solid var(--grid-line)',
    padding: '0.35rem 0.75rem',
    borderRadius: '4px',
    cursor: 'pointer',
  },
};
