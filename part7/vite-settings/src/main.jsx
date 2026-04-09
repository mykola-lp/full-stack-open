import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)

// dev → speed (esbuild)
// prod → optimization (Rollup)

// Browsers understand standard JavaScript, but JSX is not valid JavaScript
// const element = <App />
// must be transpiled it into something the browser can run
// const element = React.createElement(App, null)

// p.s. In the old Webpack-based workflow you had to install and configure
//      Babel and related packages to transpile the JSX for the browser.
//      With esbuild, files ending in .jsx are transpiled out of the box.