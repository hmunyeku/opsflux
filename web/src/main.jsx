import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import '@ui5/webcomponents/dist/Assets.js'
import '@ui5/webcomponents-fiori/dist/Assets.js'
import '@ui5/webcomponents-icons/dist/AllIcons.js'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
