// import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Provider } from 'react-redux'
import { HashRouter } from 'react-router-dom'
import './index.css'
import App from './App.tsx'
import {store} from './app/store.ts'

createRoot(document.getElementById('root')!).render(
  <HashRouter>
    <Provider store={store}>
      {/* <StrictMode> */}
        <App />
      {/* </StrictMode> */}
    </Provider>
  </HashRouter>
)
