import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.scss'
import App from './App.tsx'
import { Provider } from 'react-redux'
import { store } from './store/index.ts'
import { bootstrap } from './botstrap.ts'
import { sessionRestored } from "./store/auth/authSlice";

async function start() {

  const result = await bootstrap();

  store.dispatch(
      sessionRestored({
          user: result.user,
          error: result.error
      })
  );

  createRoot(document.getElementById('root')!).render(
    <StrictMode>
      <Provider store={store}>
        <App />
      </Provider>
    </StrictMode>,
  )

  document.getElementById("boot-loader")?.remove();
}

start();