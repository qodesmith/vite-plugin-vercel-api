import Logos from './components/Logos'
import './Index.css'

export default function Index() {
  return (
    <>
      <Logos />
      <div className="card">
        <p>
          Edit <code>src/App.tsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
    </>
  )
}
