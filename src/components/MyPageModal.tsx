import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, User, Mail, AlignLeft, ShieldAlert, Award, Check, BookOpen, Edit3 } from 'lucide-react';
import { updateProfile, deleteUser } from 'firebase/auth';
import { auth } from '../firebase';

interface MyPageModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: { nickname: string; email: string } | null;
  onProfileUpdate: (newNickname: string) => void;
  onWithdrawSuccess: () => void;
  existingNicknames: string[];
  mySentences: { id: string; content: string; likes: number }[];
  onEditSentence: (sentenceId: string, newContent: string) => void;
}

export const MyPageModal: React.FC<MyPageModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  onProfileUpdate,
  onWithdrawSuccess,
  existingNicknames,
  mySentences,
  onEditSentence,
}) => {
  const [nickname, setNickname] = useState('');
  const [bio, setBio] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showWithdrawConfirm, setShowWithdrawConfirm] = useState(false);
  const [showDuplicatePopup, setShowDuplicatePopup] = useState(false);
  const [editingSentenceId, setEditingSentenceId] = useState<string | null>(null);
  const [editingContent, setEditingContent] = useState('');
  const [sentenceError, setSentenceError] = useState('');

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
    setShowDuplicatePopup(false);
    setEditingSentenceId(null);
    setEditingContent('');
    setSentenceError('');
  }, [currentUser, isOpen]);

  if (!isOpen || !currentUser) return null;

  // Handle Profile Update (Nickname & Bio)
  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    const trimmedNickname = nickname.trim();

    if (!trimmedNickname) {
      setError('변경할 필명을 입력해 주세요.');
      return;
    }

    // Check duplicate nickname (excluding current user's nickname and ignoring case)
    if (
      currentUser &&
      trimmedNickname.toLowerCase() !== currentUser.nickname.toLowerCase() &&
      existingNicknames.some(name => name.toLowerCase() === trimmedNickname.toLowerCase())
    ) {
      setShowDuplicatePopup(true);
      return;
    }

    try {
      const user = auth.currentUser;
      if (user) {
        // Update display name in Firebase Auth
        await updateProfile(user, { displayName: trimmedNickname });
      }

      // Save bio in localStorage
      localStorage.setItem(`grieenbi-bio-${currentUser.email}`, bio.trim());

      // Update parent state
      onProfileUpdate(trimmedNickname);

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

        {/* Contributed Sentences Management Section */}
        <div style={styles.sentencesSection}>
          <div style={styles.sentencesHeader}>
            <BookOpen size={13} style={{ color: 'var(--accent-orange)' }} />
            <span style={styles.sentencesTitle}>내가 기고한 이야기 조각 ({mySentences.length}개)</span>
          </div>

          <div style={styles.sentencesList}>
            {mySentences.length === 0 ? (
              <p style={styles.emptySentences}>아직 릴레이 에세이에 기고한 문장이 없습니다.</p>
            ) : (
              mySentences.map((s) => (
                <div key={s.id} style={styles.sentenceItem}>
                  {editingSentenceId === s.id ? (
                    <div style={styles.editingContainer}>
                      <textarea
                        value={editingContent}
                        onChange={(e) => {
                          setEditingContent(e.target.value);
                          if (sentenceError) setSentenceError('');
                        }}
                        style={styles.editTextArea}
                        maxLength={100}
                      />
                      {sentenceError && <p style={styles.sentenceErrorText}>{sentenceError}</p>}
                      <div style={styles.editActionRow}>
                        <button
                          type="button"
                          onClick={() => {
                            const trimmed = editingContent.trim();
                            if (!trimmed) {
                              setSentenceError('이야기 조각은 공백으로 둘 수 없습니다.');
                              return;
                            }
                            const nonSpaceLength = trimmed.replace(/\s/g, '').length;
                            if (nonSpaceLength > 50) {
                              setSentenceError('문장은 최대 50자 이내(공백 제외)이어야 합니다.');
                              return;
                            }
                            onEditSentence(s.id, trimmed);
                            setEditingSentenceId(null);
                          }}
                          className="btn-primary"
                          style={styles.editSaveBtn}
                        >
                          저장
                        </button>
                        <button
                          type="button"
                          onClick={() => setEditingSentenceId(null)}
                          style={styles.editCancelBtn}
                        >
                          취소
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div style={styles.sentenceDisplayRow}>
                      <div style={styles.sentenceTextCol}>
                        <p className="serif-title" style={styles.sentenceText}>
                          "{s.content}"
                        </p>
                        <span style={styles.sentenceLikes}>
                          ❤️ {s.likes}명의 독자가 공감함
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          setEditingSentenceId(s.id);
                          setEditingContent(s.content);
                          setSentenceError('');
                        }}
                        style={styles.sentenceEditBtn}
                        title="이야기 조각 수정하기"
                      >
                        <Edit3 size={12} />
                        <span>수정</span>
                      </button>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>

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

        {/* ⚠️ Duplicate Nickname Warning Popup */}
        <AnimatePresence>
          {showDuplicatePopup && (
            <div style={styles.subModalOverlay}>
              <motion.div
                initial={{ opacity: 0, scale: 0.93, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.93, y: 10 }}
                transition={{ duration: 0.18, ease: 'easeOut' }}
                style={styles.subModalCard}
              >
                <div style={styles.subModalHeader}>
                  <ShieldAlert size={26} style={{ color: 'var(--accent-orange)' }} />
                  <h3 className="serif-title" style={styles.subModalTitle}>
                    필명 중복 안내
                  </h3>
                </div>
                
                <div style={styles.subModalBody}>
                  <p style={styles.subModalDesc}>
                    독자님, 입력하신 <strong style={{ color: 'var(--accent-orange)' }}>'{nickname}'</strong> 필명은 이미 생각의 정원을 가꾸고 있는 다른 독자 작가님이 사용 중입니다.
                  </p>
                  <p style={styles.subModalSubDesc}>
                    글을 사랑하는 이들 사이의 혼선을 방지하고, 고유한 문학적 목소리를 내기 위해 다른 개성 있는 필명을 선택해 주세요.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => setShowDuplicatePopup(false)}
                  className="btn-primary"
                  style={styles.subModalConfirmBtn}
                >
                  다른 필명 정하기
                </button>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
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
  subModalOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(4, 13, 33, 0.65)',
    backdropFilter: 'blur(5px)',
    zIndex: 1050,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: '16px',
    padding: '1.5rem',
  },
  subModalCard: {
    backgroundColor: 'var(--bg-primary)',
    border: '1px solid var(--grid-line)',
    borderRadius: '12px',
    padding: '1.75rem',
    maxWidth: '360px',
    width: '100%',
    boxShadow: '0 15px 40px rgba(10, 17, 40, 0.35)',
    display: 'flex',
    flexDirection: 'column',
    gap: '1.25rem',
    textAlign: 'center',
  },
  subModalHeader: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '0.5rem',
  },
  subModalTitle: {
    fontSize: '1.15rem',
    color: 'var(--text-primary)',
    margin: 0,
  },
  subModalBody: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.6rem',
    textAlign: 'center',
  },
  subModalDesc: {
    fontSize: '0.85rem',
    color: 'var(--text-primary)',
    lineHeight: '1.5',
    margin: 0,
    wordBreak: 'keep-all',
  },
  subModalSubDesc: {
    fontSize: '0.75rem',
    color: 'var(--text-secondary)',
    lineHeight: '1.4',
    margin: 0,
    wordBreak: 'keep-all',
  },
  subModalConfirmBtn: {
    width: '100%',
    justifyContent: 'center',
    borderRadius: '6px',
    padding: '0.6rem',
    fontSize: '0.8rem',
  },
  sentencesSection: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.75rem',
    borderTop: '1px solid var(--grid-line)',
    paddingTop: '1.25rem',
    marginTop: '0.25rem',
    textAlign: 'left',
  },
  sentencesHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.4rem',
  },
  sentencesTitle: {
    fontSize: '0.75rem',
    fontWeight: 800,
    color: 'var(--text-primary)',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
  },
  sentencesList: {
    maxHeight: '180px',
    overflowY: 'auto',
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem',
    paddingRight: '0.25rem',
  },
  emptySentences: {
    fontSize: '0.8rem',
    color: 'var(--text-tertiary)',
    fontStyle: 'italic',
    margin: 0,
  },
  sentenceItem: {
    backgroundColor: 'var(--bg-secondary)',
    border: '1px solid var(--grid-line)',
    borderRadius: '8px',
    padding: '0.75rem',
    display: 'flex',
    flexDirection: 'column',
  },
  sentenceDisplayRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: '0.75rem',
  },
  sentenceTextCol: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.25rem',
    flex: 1,
  },
  sentenceText: {
    fontSize: '0.825rem',
    color: 'var(--text-primary)',
    lineHeight: '1.4',
    margin: 0,
    wordBreak: 'keep-all',
  },
  sentenceLikes: {
    fontSize: '0.65rem',
    color: 'var(--text-tertiary)',
    fontWeight: 600,
  },
  sentenceEditBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.2rem',
    fontSize: '0.7rem',
    fontWeight: 700,
    color: 'var(--accent-orange)',
    backgroundColor: 'transparent',
    border: '1px solid var(--grid-line)',
    borderRadius: '4px',
    padding: '0.25rem 0.5rem',
    cursor: 'pointer',
    transition: 'var(--transition-fast)',
  },
  editingContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.4rem',
    width: '100%',
  },
  editTextArea: {
    width: '100%',
    height: '60px',
    padding: '0.5rem 0.75rem',
    backgroundColor: 'var(--bg-primary)',
    border: '1px solid var(--grid-line)',
    borderRadius: '6px',
    fontSize: '0.825rem',
    color: 'var(--text-primary)',
    transition: 'var(--transition-fast)',
    boxSizing: 'border-box',
    resize: 'none',
    fontFamily: 'var(--font-sans)',
    lineHeight: '1.4',
  },
  sentenceErrorText: {
    color: 'var(--accent-orange)',
    fontSize: '0.7rem',
    fontWeight: 600,
    margin: 0,
  },
  editActionRow: {
    display: 'flex',
    gap: '0.4rem',
    justifyContent: 'flex-end',
  },
  editSaveBtn: {
    padding: '0.25rem 0.75rem',
    fontSize: '0.75rem',
    borderRadius: '4px',
  },
  editCancelBtn: {
    padding: '0.25rem 0.75rem',
    fontSize: '0.75rem',
    backgroundColor: 'transparent',
    border: '1px solid var(--grid-line)',
    color: 'var(--text-secondary)',
    borderRadius: '4px',
    cursor: 'pointer',
    transition: 'var(--transition-fast)',
  },
};
