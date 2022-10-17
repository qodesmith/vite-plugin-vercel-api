import Page from './Page'
import {CarType} from '../../api/cars'
import {
  useReactTable,
  createColumnHelper,
  getCoreRowModel,
  getSortedRowModel,
  flexRender,
  type SortingState,
} from '@tanstack/react-table'
import './Cars.css'
import CarSearch from './CarSearch'
import {useRecoilValue} from 'recoil'
import {carsRouteSelector} from '../state/recoilState'
import CarsTable from './CarsTable'

export default function Cars() {
  const route = useRecoilValue(carsRouteSelector)

  return (
    <Page>
      <h1>Cars</h1>

      <hr />

      <div className="cars-search-container">
        <div>
          Using this search bar will trigger fetch calls to different endpoints
          located in the <code>/api</code> directory. This is done on purpose so
          we can test that the different api "
          <a
            href="https://nextjs.org/docs/api-routes/dynamic-api-routes"
            target="_blank">
            file types
          </a>
          " are working properly. Those file types are:
          <ul>
            <li>
              <code>cars.ts</code> - explicit
            </li>
            <li>
              <code>[carMake].ts</code> - dynamic
            </li>
            <li>
              <code>[...slug].ts</code> - <span className="red">*</span>catchAll
            </li>
            <li>
              <code>[[...slug]].ts</code> - <span className="red">*</span>
              optionalCatchAll
            </li>
            <div className="vercel-not-supported">
              <em>Not supported on Vercel outside of Next.js applications.</em>
            </div>
          </ul>
        </div>
        <CarSearch />
      </div>

      <hr />

      <div className="cars-table-container">
        <div className="displayed-route">
          Current data route:{' '}
          <code>
            <strong>{route}</strong>
          </code>
        </div>
        <CarsTable />
      </div>
    </Page>
  )
}
