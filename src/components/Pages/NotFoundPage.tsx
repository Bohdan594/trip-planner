import './NotFoundPage.scss'
import { useNavigate } from 'react-router-dom'

function NotFoundPage() {
const navigate = useNavigate()
  return (
    <>
      <section className="not-found">
            <div className="container">
                <span className="code">404</span>
                <h1>Page not found</h1>
                <p>The page you're looking for doesn't exist or has been moved.</p>
                <button onClick={() => navigate('/')}>Back to Home</button>
            </div>
        </section>
    </>
  )

}

export default NotFoundPage