import './Login.scss'
import { useLocation, useNavigate } from 'react-router-dom';
import { useState } from 'react'
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { signUpThunk, signInThunk } from '../../store/auth/authSlice';
import { Link } from 'react-router-dom';

function Login() {

    const navigate = useNavigate();
    const location = useLocation();
    const from = location.state?.from?.pathname || '/';
    const dispatch = useAppDispatch();
    const status = useAppSelector(state => state.auth.status);
    const isLoading = status === 'loading';
    const [viewPasswd, setViewPasswd] = useState<boolean>(false);
    const [loginOption, setLoginOption] = useState<"signUp" | "signIn">("signIn");
    const [email, setEmail] = useState<string>('');
    const [localError, setLocalError] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [confirmPassword, setConfirmPassword] = useState<string>('')
    const [checkEmail, setCheckEmail] = useState<boolean>(false);

    const handleLogin = () => {
        setLocalError('')
        setEmail('');
        setPassword('');
        setConfirmPassword('');
        setCheckEmail(false);
        setViewPasswd(false)
    }

    const handleSubmit = async () => {
        if (isLoading) return;

        setCheckEmail(false);
        setLocalError('');       

        if (loginOption === "signUp" && password !== confirmPassword) {
            setLocalError('Passwords do not match');
            return
        }

        try{
            if(loginOption === "signUp"){
                await dispatch(signUpThunk({ email, password })).unwrap();
                setCheckEmail(true);
            } else {
                await dispatch(signInThunk({ email, password })).unwrap();
                navigate(from, { replace: true });
            }
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
            <section className='login'>
                <div className='container'>
                    <div className='txt-side'>
                        <h2>{loginOption === "signUp" ? "Create account" : "Sign in"}</h2>
                        <p>Plan your next adventure with ease - organize destinations, build day-by-day itineraries, track budgets, and share trips with friends.</p>
                    </div>
                    <div className='login-tabs'>
                        <button className={loginOption === "signIn" ? 'active' : ''} onClick={() => {setLoginOption("signIn"); handleLogin()}}>
                            Sign In
                        </button>
                        <button className={loginOption === "signUp" ? 'active' : ''} onClick={() => {setLoginOption("signUp"); handleLogin()}}>
                            Sign Up
                        </button>
                    </div>
                    <form onSubmit={(e) => { e.preventDefault(); handleSubmit() }} className={isLoading ? 'loading' : ''}>
                        <div className='form-part'>
                            <label htmlFor="email">Email</label>
                            <input
                                onChange={(e) => setEmail(e.target.value)}
                                value={email}
                                id='email'
                                className='email'
                                name='email'
                                type='email'
                                autoComplete='email'
                                placeholder='Email...'
                                required
                            />
                        </div>
                        <div className='form-part'>
                            <label htmlFor="password">Password</label>
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

                        {loginOption === "signUp" && <div className='form-part'>
                            <label htmlFor="confirm-password">Confirm password</label>
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
                        </div>}

                        {checkEmail && <p className='check-email'>Check your email</p>}
                        {localError && <p className='error'>{localError}</p>}

                        <button type="submit" className='btn-main' disabled={isLoading}>
                            {isLoading
                                ? 'Loading...'
                                : loginOption === "signUp"
                                    ? "Sign up"
                                    : "Sign in"}
                        </button>

                        {loginOption === "signIn" && (
                            <Link to='forgot-password' className='forgot-password'>
                                Forgot password?
                            </Link>                       
                        )}
                    </form>
                </div>
            </section>
        </>
    )

}

export default Login