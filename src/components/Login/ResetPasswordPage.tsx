import './ResetPasswordPage.scss'
import { useState, useEffect } from 'react'
import { useAppDispatch, useAppSelector } from '../../store/hooks'
import { resetPasswordThunk, signOutThunk } from '../../store/auth/authSlice'
import { useNavigate } from 'react-router-dom'

function ResetPasswordPage() {

    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const status = useAppSelector(state => state.auth.status);
    const isLoading = status === 'loading';
    const [viewPasswd, setViewPasswd] = useState<boolean>(false);
    const [localError, setLocalError] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState<string>('');
    const [isSuccess, setIsSuccess] = useState(false);
    const [accessToken, setAccessToken] = useState('');

    useEffect(() => {
        const hash = window.location.hash
        const params = new URLSearchParams(hash.substring(1))
        const token = params.get('access_token')

        if (!token) {
            navigate('/login');
            return
        }

        setAccessToken(token);
    }, [])

    if (!accessToken) return null

    const handleSubmit = async () => {
        if (!accessToken) return;

        setLocalError('');

        if (password !== confirmPassword) {
            setLocalError('Passwords do not match');
            return
        }

        try {
            await dispatch(resetPasswordThunk({ password, accessToken })).unwrap();
            await dispatch(signOutThunk()).unwrap();
            setIsSuccess(true);
        } catch (err: unknown) {
            if (typeof err === 'string') {
                setLocalError(err);
            } else {
                setLocalError('Something went wrong');
            }
        }
    }

    return (
        <>
            <section className='reset-passwd'>
                <div className='container'>
                    {isSuccess ? (
                        <div className='success'>
                            <h2>Password updated successfully</h2>

                            <p>
                                Your password has been changed.
                                You can now sign in with your new password.
                            </p>

                            <button onClick={() => navigate('/login')}>
                                Go back
                            </button>
                        </div>
                    ) : (
                        <>
                            <div className='txt-side'>
                                <h2>Reset Password</h2>
                                <p className='txt-part'>Change your password to keep your account secure. Your new password will be used the next time you sign in.</p>
                            </div>
                            
                            <form onSubmit={(e) => { e.preventDefault(); handleSubmit() }} className={isLoading ? 'loading' : ''}>

                                <div className='form-part'>
                                    <label htmlFor="password">New password</label>
                                    <div className='passwd'>
                                        <input
                                            onChange={(e) => setPassword(e.target.value)}
                                            value={password}
                                            type={viewPasswd ? "text" : "password"}
                                            id='password'
                                            name='password'
                                            placeholder='Password...'
                                            required
                                        />
                                        <div onClick={() => setViewPasswd(!viewPasswd)} className='eye'>
                                            <img src={viewPasswd ? "/hide.png" : "/view.png"} alt="eye" />
                                        </div>
                                    </div>
                                </div>

                                <div className='form-part'>
                                    <label htmlFor="confirm-password">Confirm new password</label>
                                    <div className='passwd'>
                                        <input
                                            onChange={(e) => setConfirmPassword(e.target.value)}
                                            value={confirmPassword}
                                            type={viewPasswd ? "text" : "password"}
                                            id='confirm-password'
                                            name='confirm-password'
                                            placeholder='Confirm password...'
                                            required
                                        />
                                    </div>
                                </div>

                                {localError && <p className='error'>{localError}</p>}
                                <button type='submit' disabled={isLoading}>{isLoading
                                        ? 'Loading...'
                                        : "Reset Password"}</button>
                            </form>
                        </>
                    )}
                </div>
            </section>
        </>
    )

}

export default ResetPasswordPage