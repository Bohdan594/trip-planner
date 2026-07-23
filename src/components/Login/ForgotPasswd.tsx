import './ForgotPasswd.scss'
import { useState } from 'react'
import { useAppDispatch, useAppSelector } from '../../store/hooks'
import { forgotPasswordThunk } from '../../store/auth/authSlice'

function ForgotPasswd() {

    const dispatch = useAppDispatch();
    const status = useAppSelector(state => state.auth.status);
    const isLoading = status === 'loading';
    const [localError, setLocalError] = useState('');
    const [email, setEmail] = useState<string>('');
    const [checkEmail, setCheckEmail] = useState<boolean>(false);

    const handleSubmit = async () => {
        if (isLoading) return;

        setCheckEmail(false);
        setLocalError('');

        try{
            await dispatch(forgotPasswordThunk({ email })).unwrap();
            setCheckEmail(true);
        } catch(err: unknown) {
            if (typeof err === 'string') {
                setLocalError(err);
            } else {
                setLocalError('Something went wrong');
            }
        }
    };

    return (
        <div className='write-email'>
            <div className='container'>
                <div className='txt-side'>
                   <h2>Reset Password</h2>
                    <p className='txt-part'>
                        Enter your email address and check your inbox. We will send you a link to reset your password so you will need to <span>check your email</span>.
                    </p> 
                </div>

                <form onSubmit={(e) => { e.preventDefault(); handleSubmit() }} className={isLoading ? 'loading' : ''}>
                    <div>
                        <label htmlFor="email">Email</label>
                        <input
                            value={email}
                            onChange={(e) => {
                                setEmail(e.target.value),
                                setCheckEmail(false)
                            }}
                            className='email'
                            id='email'
                            name='email'
                            type="email"
                            autoComplete="email"
                            placeholder='Email...'
                            required
                            disabled={isLoading}
                        />
                    </div>

                    {checkEmail && <p className='check-email'>Check your email</p>}

                    {localError && <p className='error'>{localError}</p>}

                    <button type="submit" className='change' disabled={isLoading}>
                        {isLoading ? 'Sending...' : 'Send'}
                    </button>
                </form>
            </div>            
        </div>
    );
}

export default ForgotPasswd