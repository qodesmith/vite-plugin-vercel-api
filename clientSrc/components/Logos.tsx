import './Logos.css'
import reactLogo from '../assets/react.svg'

export default function Logos() {
  return (
    <div className="logos-container">
      <div className="logo-links">
        <a href="https://vitejs.dev" target="_blank">
          <img src="/vite.svg" className="logo" alt="Vite logo" />
        </a>
        <a href="https://reactjs.org" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
        <a href="https://vercel.com" target="_blank">
          <img
            src="/vercel-icon-light.svg"
            className="logo vercel"
            alt="Vercel logo"
          />
        </a>
      </div>
      <div>Vite + React + Vercel</div>
    </div>
  )
}
