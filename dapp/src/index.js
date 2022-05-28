import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import App from './App'
import reportWebVitals from './reportWebVitals'
import { MoralisProvider } from 'react-moralis'

const ID = 'xstDCksGRBa48R82OMBuHv7mAZfV4CWtfsSyHBSK'
const URL = 'https://wfadi11lk1u3.usemoralis.com:2053/server'

const root = ReactDOM.createRoot(document.getElementById('root'))
root.render(
  <React.StrictMode>
    <MoralisProvider appId={ID} serverUrl={URL}>
      <App />
    </MoralisProvider>
  </React.StrictMode>,
)

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals()
