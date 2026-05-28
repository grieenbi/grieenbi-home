import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { X, Mail, Lock, User, Check, Eye, EyeOff } from 'lucide-react';
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  updateProfile,
  signInWithPopup
} from 'firebase/auth';
import { auth, googleProvider } from '../firebase';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAuthSuccess: (nickname: string, email: string) => void;
}

type AuthMode = 'login' | 'signup';

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, onAuthSuccess }) => {
  const [mode, setMode] = useState<AuthMode>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [nickname, setNickname] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  if (!isOpen) return null;

  const handleSocialLogin = async (platform: 'google' | 'kakao') => {
    setError('');
    setSuccessMsg('');

    if (platform === 'google') {
      try {
        const result = await signInWithPopup(auth, googleProvider);
        const user = result.user;
        const displayName = user.displayName || '구글 작가';
        const userEmail = user.email || '';

        setSuccessMsg(`구글 간편 로그인에 성공했습니다!`);
        setTimeout(() => {
          onAuthSuccess(displayName, userEmail);
          setSuccessMsg('');
          onClose();
        }, 1200);
      } catch (err: any) {
        console.error(err);
        if (err.code === 'auth/popup-closed-by-user') {
          setError('로그인 팝업이 닫혔습니다.');
        } else {
          setError('구글 로그인에 실패했습니다. 다시 시도해 주세요.');
        }
      }
    } else {
      try {
        const Kakao = (window as any).Kakao;
        if (!Kakao) {
          setError('카카오 SDK가 준비되지 않았습니다. 잠시 후 다시 시도해 주세요.');
          return;
        }

        // Initialize Kakao SDK if not already done
        if (!Kakao.isInitialized()) {
          Kakao.init("4f4d8048cfa96dab2135106cc0ab38d9");
        }

        Kakao.Auth.login({
          success: () => {
            // Retrieve Kakao user profile details
            Kakao.API.request({
              url: '/v2/user/me',
              success: async (res: any) => {
                const kakaoId = res.id;
                const nickname = res.properties?.nickname || '카카오 작가';
                const email = res.kakao_account?.email || `kakao_${kakaoId}@grieenbi-kakao.com`;
                
                // Silent backend-less Firebase Auth matching
                const silentPassword = `kakao_pwd_secure_${kakaoId}`;

                try {
                  // Attempt silent login
                  const userCredential = await signInWithEmailAndPassword(auth, email, silentPassword);
                  const user = userCredential.user;
                  setSuccessMsg(`카카오 간편 로그인에 성공했습니다!`);
                  setTimeout(() => {
                    onAuthSuccess(user.displayName || nickname, user.email || email);
                    setSuccessMsg('');
                    onClose();
                  }, 1200);
                } catch (loginErr: any) {
                  // If the user doesn't exist yet, silently sign them up in Firebase Auth
                  if (loginErr.code === 'auth/user-not-found' || loginErr.code === 'auth/invalid-credential') {
                    try {
                      const userCredential = await createUserWithEmailAndPassword(auth, email, silentPassword);
                      await updateProfile(userCredential.user, {
                        displayName: nickname
                      });
                      setSuccessMsg(`카카오 간편 회원가입에 성공했습니다!`);
                      setTimeout(() => {
                        onAuthSuccess(nickname, email);
                        setSuccessMsg('');
                        onClose();
                      }, 1200);
                    } catch (signUpErr: any) {
                      console.error(signUpErr);
                      setError('카카오 계정 등록에 실패했습니다.');
                    }
                  } else {
                    console.error(loginErr);
                    setError('카카오 로그인 인증 중 오류가 발생했습니다.');
                  }
                }
              },
              fail: (err: any) => {
                console.error(err);
                setError('카카오 프로필 정보를 가져오지 못했습니다.');
              }
            });
          },
          fail: (err: any) => {
            console.error(err);
            setError('카카오 간편 로그인창이 닫혔거나 취소되었습니다.');
          }
        });
      } catch (err: any) {
        console.error(err);
        setError('카카오톡 로그인 실행 중 오류가 발생했습니다.');
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');

    if (!email.trim() || !password.trim()) {
      setError('이메일과 비밀번호를 입력해주세요.');
      return;
    }

    if (mode === 'signup' && !nickname.trim()) {
      setError('필명을 입력해주세요.');
      return;
    }

    try {
      if (mode === 'signup') {
        // Sign Up with Firebase
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        
        // Update user display name (nickname) in Firebase Auth
        await updateProfile(userCredential.user, {
          displayName: nickname
        });

        setSuccessMsg('축하합니다! 회원가입이 완료되었습니다.');
        setTimeout(() => {
          onAuthSuccess(nickname, email);
          setSuccessMsg('');
          setEmail('');
          setPassword('');
          setNickname('');
          onClose();
        }, 1500);
      } else {
        // Log In with Firebase
        // Default Admin/Author mock account for testing convenience (local bypass)
        if (email === 'grieenbi@example.com' && password === 'Totoro0127@') {
          setSuccessMsg('작가님, 환영합니다!');
          setTimeout(() => {
            onAuthSuccess('그린비 작가', 'grieenbi@example.com');
            setSuccessMsg('');
            onClose();
          }, 1200);
          return;
        }

        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;
        const userNickname = user.displayName || '그린비 독자';

        setSuccessMsg(`${userNickname}님, 반가워요!`);
        setTimeout(() => {
          onAuthSuccess(userNickname, user.email || email);
          setSuccessMsg('');
          setEmail('');
          setPassword('');
          onClose();
        }, 1200);
      }
    } catch (err: any) {
      console.error(err);
      switch (err.code) {
        case 'auth/email-already-in-use':
          setError('이미 등록된 이메일 주소입니다.');
          break;
        case 'auth/invalid-email':
          setError('유효하지 않은 이메일 형식입니다.');
          break;
        case 'auth/weak-password':
          setError('비밀번호가 너무 취약합니다. (6자 이상 필요)');
          break;
        case 'auth/user-not-found':
        case 'auth/wrong-password':
        case 'auth/invalid-credential':
          setError('이메일 혹은 비밀번호가 일치하지 않습니다.');
          break;
        default:
          setError('로그인/회원가입 중 오류가 발생했습니다. 다시 시도해 주세요.');
      }
    }
  };

  return (
    <div style={styles.modalOverlay} onClick={onClose}>
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        transition={{ duration: 0.25, ease: 'easeOut' }}
        style={styles.modalCard}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button type="button" onClick={onClose} style={styles.closeBtn}>
          <X size={18} />
        </button>

        {/* Modal Header */}
        <div style={styles.modalHeader}>
          <h2 className="serif-title" style={styles.modalTitle}>
            {mode === 'login' ? 'GRIEENBI STUDIO 로그인' : 'GRIEENBI STUDIO 회원가입'}
          </h2>
          <p style={styles.modalSubtitle}>
            {mode === 'login' 
              ? '스튜디오의 생각들을 탐독하고 당신의 감성을 이어보세요.' 
              : '필명을 만들고 생각의 정원에 소속되어 활동해 보세요.'}
          </p>
        </div>

        {/* Social Authentication Options */}
        <div style={styles.socialContainer}>
          {/* Google Button */}
          <button 
            type="button" 
            onClick={() => handleSocialLogin('google')} 
            style={styles.googleBtn}
            className="auth-social-btn"
          >
            {/* Custom Google Logo Icon SVG */}
            <svg width="18" height="18" viewBox="0 0 18 18" style={styles.socialIcon}>
              <path fill="#4285F4" d="M17.64 9.2c0-.63-.06-1.25-.16-1.84H9v3.47h4.84a4.14 4.14 0 0 1-1.8 2.71v2.26h2.91c1.7-1.57 2.69-3.88 2.69-6.6z"/>
              <path fill="#34A853" d="M9 18c2.43 0 4.47-.8 5.96-2.2l-2.91-2.26a5.6 5.6 0 0 1-8.59-3v-2.26H.53v2.26A9 9 0 0 0 9 18z"/>
              <path fill="#FBBC05" d="M3.46 10.54a5.4 5.4 0 0 1 0-3.08V5.2H.53a9 9 0 0 0 0 7.6l2.93-2.26z"/>
              <path fill="#EA4335" d="M9 3.58c1.32 0 2.5.45 3.44 1.35L15 2A9 9 0 0 0 .53 5.2l2.93 2.26a5.4 5.4 0 0 1 5.54-3.88z"/>
            </svg>
            <span>Google 계정으로 시작</span>
          </button>

          {/* Kakao Button */}
          <button 
            type="button" 
            onClick={() => handleSocialLogin('kakao')} 
            style={styles.kakaoBtn}
            className="auth-social-btn"
          >
            {/* Custom Kakao Speech Bubble SVG */}
            <svg width="18" height="18" viewBox="0 0 24 24" style={styles.socialIcon}>
              <path fill="#3C1E1E" d="M12 3c-6.627 0-12 4.2-12 9.37 0 3.328 2.243 6.257 5.632 7.822l-1.129 4.154a.5.5 0 0 0 .723.543l4.908-3.238A12.75 12.75 0 0 0 12 21.74c6.627 0 12-4.2 12-9.37S18.627 3 12 3z"/>
            </svg>
            <span>Kakao 계정으로 시작</span>
          </button>
        </div>

        <div style={styles.divider}>
          <span style={styles.dividerLine} />
          <span style={styles.dividerText}>또는 이메일로 가입</span>
          <span style={styles.dividerLine} />
        </div>

        {/* Local Email Forms */}
        <form onSubmit={handleSubmit} style={styles.form}>
          {mode === 'signup' && (
            <div style={styles.inputWrapper}>
              <User size={16} style={styles.inputIcon} />
              <input
                type="text"
                placeholder="작가 필명 (예: 은새, 북러버)"
                value={nickname}
                onChange={(e) => setNickname(e.target.value)}
                style={styles.inputField}
                maxLength={12}
              />
            </div>
          )}

          <div style={styles.inputWrapper}>
            <Mail size={16} style={styles.inputIcon} />
            <input
              type="email"
              placeholder="이메일 주소"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={styles.inputField}
            />
          </div>

          <div style={styles.inputWrapper}>
            <Lock size={16} style={styles.inputIcon} />
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder="비밀번호 (4자 이상)"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={styles.inputField}
            />
            <button 
              type="button" 
              onClick={() => setShowPassword(!showPassword)} 
              style={styles.eyeBtn}
            >
              {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>

          {error && <p style={styles.errorText}>{error}</p>}
          
          {successMsg && (
            <div style={styles.successBox}>
              <Check size={16} />
              <span>{successMsg}</span>
            </div>
          )}

          <button type="submit" className="btn-primary" style={styles.submitBtn}>
            {mode === 'login' ? '로그인 완료하기' : '회원가입 완료하기'}
          </button>
        </form>

        {/* Form Toggle Mode Footer */}
        <div style={styles.modalFooter}>
          {mode === 'login' ? (
            <p>
              아직 회원이 아니신가요?{' '}
              <button 
                type="button" 
                onClick={() => { setMode('signup'); setError(''); }} 
                style={styles.toggleBtn}
              >
                회원가입하기
              </button>
            </p>
          ) : (
            <p>
              이미 계정이 있으신가요?{' '}
              <button 
                type="button" 
                onClick={() => { setMode('login'); setError(''); }} 
                style={styles.toggleBtn}
              >
                로그인하기
              </button>
            </p>
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
    maxWidth: '440px',
    padding: '2.5rem',
    position: 'relative',
    display: 'flex',
    flexDirection: 'column',
    gap: '1.5rem',
  },
  closeBtn: {
    position: 'absolute',
    top: '16px',
    right: '16px',
    cursor: 'pointer',
    color: 'var(--text-secondary)',
    padding: '0.25rem',
    transition: 'var(--transition-fast)',
  },
  modalHeader: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.375rem',
    textAlign: 'center',
  },
  modalTitle: {
    fontSize: '1.5rem',
    color: 'var(--text-primary)',
  },
  modalSubtitle: {
    fontSize: '0.8rem',
    color: 'var(--text-secondary)',
    lineHeight: '1.4',
  },
  socialContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.75rem',
  },
  googleBtn: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '0.75rem',
    width: '100%',
    padding: '0.75rem 1rem',
    backgroundColor: '#FFFFFF',
    border: '1px solid #DEE2E6',
    color: '#3C4043',
    fontWeight: 600,
    fontSize: '0.85rem',
    cursor: 'pointer',
    borderRadius: '8px',
    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)',
  },
  kakaoBtn: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '0.75rem',
    width: '100%',
    padding: '0.75rem 1rem',
    backgroundColor: '#FEE500',
    border: '1px solid #FEE500',
    color: '#191919',
    fontWeight: 600,
    fontSize: '0.85rem',
    cursor: 'pointer',
    borderRadius: '8px',
    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)',
  },
  socialIcon: {
    flexShrink: 0,
  },
  divider: {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
    width: '100%',
  },
  dividerLine: {
    flex: 1,
    height: '1px',
    backgroundColor: 'var(--grid-line)',
  },
  dividerText: {
    fontSize: '0.7rem',
    color: 'var(--text-tertiary)',
    fontWeight: 600,
    textTransform: 'uppercase',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.75rem',
  },
  inputWrapper: {
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
    width: '100%',
  },
  inputIcon: {
    position: 'absolute',
    left: '12px',
    color: 'var(--text-tertiary)',
  },
  inputField: {
    width: '100%',
    padding: '0.75rem 1rem 0.75rem 2.5rem',
    backgroundColor: 'var(--bg-secondary)',
    border: '1px solid var(--grid-line)',
    borderRadius: '8px',
    fontSize: '0.85rem',
    color: 'var(--text-primary)',
    transition: 'var(--transition-fast)',
  },
  eyeBtn: {
    position: 'absolute',
    right: '12px',
    cursor: 'pointer',
    color: 'var(--text-tertiary)',
    backgroundColor: 'transparent',
    border: 'none',
  },
  errorText: {
    color: 'var(--accent-orange)',
    fontSize: '0.75rem',
    fontWeight: 600,
    textAlign: 'center',
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
  submitBtn: {
    width: '100%',
    justifyContent: 'center',
    borderRadius: '8px',
    marginTop: '0.5rem',
  },
  modalFooter: {
    textAlign: 'center',
    fontSize: '0.8rem',
    color: 'var(--text-secondary)',
  },
  toggleBtn: {
    color: 'var(--accent-green)',
    fontWeight: 700,
    cursor: 'pointer',
    backgroundColor: 'transparent',
    border: 'none',
  },
};
export default AuthModal;
