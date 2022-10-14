import Logos from './components/Logos'
import Page from './components/Page'
import './Index.css'
import {Link} from 'react-router-dom'

export default function Index() {
  return (
    <>
      <Logos />
      <Page>
        <h1>vite-plugin-vercel-api</h1>
        <div className="plugin-explanation">
          A Vite plugin that let's you use the{' '}
          <code>
            <strong>/api</strong>
          </code>{' '}
          directory as your back end routes like Vercel for use with Vercel
          Serverless Functions.
        </div>

        <hr />

        <Link to="/cars">Cars</Link>
      </Page>
    </>
  )
}
