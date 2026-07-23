import './MainLayout.scss'
import Header from "../Header"
import Slidebar from "../Slidebar";
import { Outlet } from 'react-router-dom';
import { useState } from 'react';
import { useAppSelector } from '../../store/hooks';

function MainLayout() {

  const [slidebar, setSlidebar] = useState<boolean>(false);
  const authCheckError = useAppSelector(state => state.auth.authCheckError);

  return (
    <>
      <div style={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
        <Header setSlidebar={setSlidebar} />
        {authCheckError && (
          <div className='auth-error-banner'>
            <p>{authCheckError}</p>
          </div>
        )}
        <main className='main-app'>
          <Slidebar setSlidebar={setSlidebar} slidebar={slidebar} />
          <div className='outlet-wrapper'>
            <Outlet />
          </div>
        </main> 
      </div>
      
    </>
  )

}

export default MainLayout