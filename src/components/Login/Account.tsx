import './Account.scss'
import Loader from '../../Loader';
import { useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { useAppSelector, useAppDispatch } from '../../store/hooks';
import { signOutThunk, forgotPasswordThunk, deleteAccountThunk } from '../../store/auth/authSlice';

function Account() {

    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const email = useAppSelector(state => state.auth.user?.email);
    const status = useAppSelector(state => state.auth.status);
    const [modalSignOut, setModalSignOut] = useState<boolean>(false);
    const [modalDeleteAccount, setModalDeleteAccount] = useState<boolean>(false);
    const [toast, setToast] = useState<{ message: string, type: 'success' | 'error' } | null>(null);

    const showToast = (message: string, type: 'success' | 'error') => {
        setToast({ message, type });
        setTimeout(() => setToast(null), 3000);
    }

    const handleSignOut = async () => {
        setModalSignOut(false);

        try {
            await dispatch(signOutThunk()).unwrap();
            navigate('/');
        } catch (err: unknown) {
            if (typeof err === 'string') {
                showToast(err, 'error');
            } else {
                showToast('Something went wrong', 'error');
            }
        }
    }

    const handleResetPasswd = async () => {
        if (!email) return;

        try {
            await dispatch(forgotPasswordThunk({ email })).unwrap();
            showToast(`Check your email`, 'success');
        } catch (err: unknown) {
            if (typeof err === 'string') {
                showToast(err, 'error');
            } else {
                showToast('Something went wrong', 'error');
            }
        }
    }

    const handleDeleteAccount = async () => {
        setModalDeleteAccount(false);

        try {
            await dispatch(deleteAccountThunk()).unwrap();
            navigate('/');
        } catch (err: unknown) {
            if (typeof err === 'string') {
                showToast(err, 'error');
            } else {
                showToast('Something went wrong', 'error');
            }
        }
    }

  return (
    <>
        {modalSignOut && (
            <div className='modal-window'>
                <div className='modal-content'>
                    <p>Are you sure you want to sign out?</p>
                    <div>
                        <button onClick={() => handleSignOut()} className='yes'>Yes</button>
                        <button onClick={() => setModalSignOut(false)} className='cancel'>Cancel</button>
                    </div>
                </div>
            </div>
        )}
        {modalDeleteAccount && (
            <div className='modal-window'>
                <div className='modal-content'>
                    <p>Are you sure you want to delete your account? This action cannot be undone.</p>
                    <div>
                        <button onClick={() => handleDeleteAccount()} className='yes delete'>Delete</button>
                        <button onClick={() => setModalDeleteAccount(false)} className='cancel'>Cancel</button>
                    </div>
                </div>
            </div>
        )}
        {toast && (
            <div className="toast-wrapper">
                <div className={`toast toast--${toast.type}`}>
                    <p>{toast.message}</p>
                </div>
            </div>
        )}
        {status === 'loading' && <Loader />}
        <div className='account'>
            <div className='header-acc'>
                <h2>My account</h2>
                <p>Manage your account and access settings.</p>
            </div>
            <div className='main-acc'>
                <div className='manage'>
                    <div className='man-part'>
                        <div className='left'>
                            <div className='icon'>
                                <img src="/email.png" alt="email" />
                            </div>
                            <div className='info'>
                                <p className='head'>Email address</p>
                                <p className='head-info'>{email}</p>
                            </div>
                        </div>
                        <div className='right'>
                            <img src="/badge-check.png" alt="badge" />
                            <p>Verified</p>
                        </div>
                    </div>
                    <div className='man-part'>
                        <div className='left'>
                            <div className='icon'>
                                <img src="/lock-keyhole.png" alt="lock" />
                            </div>
                            <div className='info'>
                                <p className='head'>Change password</p>
                                <p className='head-info'>Choose a strong password to secure your account.</p>
                            </div>
                        </div>
                        <button onClick={() => handleResetPasswd()} className='right passwd'>
                            <img src="/lock-keyhole.png" alt="lock" />
                            <p>Change password</p>
                        </button>
                    </div>
                    <div className='man-part'>
                        <div className='left'>
                            <div className='icon signout'>
                                <img src="/log-out.png" alt="log-out" />
                            </div>
                            <div className='info'>
                                <p className='head'>Sign out</p>
                                <p className='head-info'>Sign out from your account.</p>
                            </div>
                        </div>
                        <button onClick={() => setModalSignOut(true)} className='right signout'>
                            <img src="/log-out.png" alt="signout" />
                            <p>Sign out</p>
                        </button>
                    </div>
                    <div className='man-part'>
                        <div className='left'>
                            <div className='icon delete-acc'>
                                <img src="/trash.png" alt="trash" />
                            </div>
                            <div className='info'>
                                <p className='head'>Delete account</p>
                                <p className='head-info'>This action is permanent and cannot be undone.</p>
                            </div>
                        </div>
                        <button onClick={() => setModalDeleteAccount(true)} className='right delete-acc'>
                            <img src="/trash.png" alt="trash" />
                            <p>Delete account</p>
                        </button>
                    </div>
                </div>
                <div className='stay-safe'>
                    <div className='left'>
                        <div className='icon'>
                            <img src="/shield-check.png" alt="shield-check" />
                        </div>
                        <div className='info'>
                            <p className='head'>Stay safe and protect your account</p>
                            <p className='head-info'>Use a strong, unique password that you don't use anywhere else, and never share your personal details, login credentials, or location data with untrusted sources.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </>
  )

}

export default Account