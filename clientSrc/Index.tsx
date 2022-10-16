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
          A Vite plugin that parses the{' '}
          <code>
            <strong>/api</strong>
          </code>{' '}
          directory just like Vercel does in production for use with{' '}
          <a href="https://vercel.com/docs/concepts/functions/serverless-functions">
            Serverless Functions
          </a>
          . It let's you continue to spin up your Vite app locally with a back
          end - no need to run{' '}
          <code>
            <a href="https://vercel.com/docs/cli/dev">
              <strong>vercel dev</strong>
            </a>
          </code>
          .
        </div>

        <hr />

        <Link to="/cars">Cars</Link>
      </Page>
    </>
  )
}
