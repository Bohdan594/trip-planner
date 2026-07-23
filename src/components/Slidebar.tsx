import './Slidebar.scss'
import { NavLink } from 'react-router-dom'
import { useState } from 'react'

function Slidebar({setSlidebar, slidebar} : {setSlidebar?: React.Dispatch<React.SetStateAction<boolean>>, slidebar?: boolean}) {

  const [closing, setClosing] = useState(false);

  const handleClose = () => {
    setClosing(true);
    setTimeout(() => {
        setSlidebar?.(false);
        setClosing(false);
    }, 350);
  };

  return (
    <>
        <section onClick={() => handleClose()} className={`slidebar ${slidebar ? 'open' : ''}`}>
          <div onClick={(e) => e.stopPropagation()} className={`slidebar-main ${closing ? 'closing' : ''}`}>
            <div className='side-part'>
              <button onClick={() => handleClose()} className='close'>
                <img src="/close.png" alt="close" />
              </button>
              <p className='paragraph'>WORKSPACE</p>
              <div className='main-part'>
                <div className='btns'>
                  <NavLink to="/" onClick={() => handleClose()}>
                    <div className='btn'>
                      <img src="/home.png" alt="home" />
                      <p>Home</p>
                    </div>
                  </NavLink>
                  <NavLink to='plans' onClick={() => handleClose()}>
                    <div className='btn'>
                      <img src="/plan.png" alt="plan" />
                      <p>My plans</p>
                    </div>
                  </NavLink>
                  <div className='btn'>
                    <img src="/earth-globe.png" alt="earth" />
                    <p>Public trips</p>
                  </div>
                </div>
              </div>
            </div>
            <div className='side-part'>
              <p className='paragraph'>ACCOUNT</p>
              <div className='main-part'>
                <div className='btns'>
                  <NavLink to='account' onClick={() => handleClose()}>
                    <div className='btn'>
                      <img src="/user.png" alt="user" />
                      <p>Account</p>
                    </div>
                  </NavLink>
                </div>
              </div>
            </div>            
          </div>
        </section>
    </>
  )

}

export default Slidebar