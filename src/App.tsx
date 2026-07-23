import './App.scss'
import MainLayout from './components/Pages/MainLayout'
import TripsSection from './components/Trips/TripsSection'
import Hero from './components/Hero'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Account from './components/Login/Account'
import { useEffect } from 'react'
import ResetPasswordPage from './components/Login/ResetPasswordPage'
import ForgotPasswdPage from './components/Pages/ForgotPasswdPage'
import VerificationPage from './components/Login/VerificationPage'
import LoginPage from './components/Pages/LoginPage'
import ProtectedRoute from './components/ProtectedRoute'
import PublicRoute from './components/PublicRoute'
import NotFoundPage from './components/Pages/NotFoundPage'

function App() {

  useEffect(() => {

    const hash = window.location.hash;

    if (hash.includes('type=recovery')) {
      window.location.href = '/reset-password' + hash
    } else if (hash.includes('type=signup')) {
      window.location.href = '/verification' + hash
    }

  }, []);

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route element={<MainLayout />}>
            <Route index element={<Hero/>}/>

            <Route element={<ProtectedRoute />}>
              <Route path='plans' element={<TripsSection/>} />
              <Route path='account' element={<Account/>} />
            </Route>
            
          </Route>

          <Route element={<PublicRoute />}>
            <Route path='login' element={<LoginPage/>}/>
            <Route path='login/forgot-password' element={<ForgotPasswdPage/>}/>
          </Route>

          <Route path='reset-password' element={<ResetPasswordPage/>}/>
          <Route path='verification' element={<VerificationPage/>}/>

          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </BrowserRouter>
    </>
  )

}

export default App
