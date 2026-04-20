import ReactDOM from 'react-dom/client'
import { BrowserRouter as Router } from 'react-router-dom'

import { AppProviders } from './app/providers/AppProviders'
import App from './App'

ReactDOM.createRoot(document.getElementById('root')).render(
  <Router>
    <AppProviders>
      <App />
    </AppProviders>
  </Router>
)
