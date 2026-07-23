import './VerificationPage.scss'
import { useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'

function VerificationPage() {

    const navigate = useNavigate();
    const [isValid, setIsValid] = useState(false)

    useEffect(() => {
        const hash = window.location.hash
        const params = new URLSearchParams(hash.substring(1))

        const token = params.get('access_token')
        const type = params.get('type')

        if (!token || type !== 'signup') {
            navigate('/login')
            return
        }

        setIsValid(true);
    }, [])

    if (!isValid) return null

  return (
    <>
        <section className="verification">
            <div className="container">

                <h2>Email verified successfully</h2>

                <p>
                    Your email has been confirmed.
                    You can now sign in to your account.
                </p>

                <button onClick={() => navigate('/login')}>
                    Go to Login
                </button>

            </div>
        </section>
    </>
  )

}

export default VerificationPage