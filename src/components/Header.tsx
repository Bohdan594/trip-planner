import './Header.scss'
import { useLocation, useNavigate } from 'react-router-dom';
import { useAppSelector } from '../store/hooks';

function Header({ setSlidebar }: { setSlidebar: React.Dispatch<React.SetStateAction<boolean>> }) {

    const location = useLocation();
    const navigate = useNavigate();
    const isAuthenticated = useAppSelector(state => state.auth.isAuthenticated);

    const getPageTitle = () => {
        switch (location.pathname) {
            case '/':
                return '';
            case '/plans':
                return 'My plans';
            case '/account':
                return 'Account';
            default:
                return '';
        }
    };

    const pageTitle = getPageTitle();

    return (
        <>
            <section className='navbar'>
                <div className='container'>
                    <nav>
                        <button onClick={() => setSlidebar(true)} className='menu'><img src="/menu.png" alt="menu" /></button>
                        <p className='product-name'><span onClick={() => navigate("/")} className='app-name'>Tripquod</span>{pageTitle !== '' && (<><span>/</span><span>{pageTitle}</span></>)}</p>
                        <div className='nav-btns'>
                            <button className='right-btn'><img src="/earth-globe.png" alt="earth" /></button>
                            {isAuthenticated ? (
                                <button
                                    onClick={() => navigate("/account")}
                                    className='right-btn'
                                >
                                    <img src="/user.png" alt="user" />
                                </button>
                            ) : (
                                <button
                                    onClick={() => navigate("/login")}
                                    className='sign-btn'
                                >
                                    Sign in
                                </button>
                            )}
                        </div>
                    </nav>
                </div>
            </section>
        </>
    )
}

export default Header