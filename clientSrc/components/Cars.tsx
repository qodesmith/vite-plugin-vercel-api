import Page from './Page'
import {useLoaderData, Link} from 'react-router-dom'
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
import {useEffect, useState} from 'react'
import CarSearch from './CarSearch'
import {useRecoilValue} from 'recoil'
import {carSearchSelectionsAtom} from '../state/recoilState'

const columnHelper = createColumnHelper<CarType>()
const columns = [
  columnHelper.accessor('make', {
    cell: info => info.getValue(),
    header: () => 'Make',
  }),
  columnHelper.accessor('model', {
    cell: info => info.getValue(),
    header: () => 'Model',
  }),
  columnHelper.accessor('year', {
    cell: info => info.getValue(),
    header: () => 'Year',
  }),
  columnHelper.accessor('vin', {
    cell: info => info.getValue(),
    header: () => 'Vin',
  }),
]

export default function Cars() {
  const {data: fullData} = useLoaderData() as {data: CarType[]}
  const [dataSet, setDataSet] = useState<CarType[]>(fullData)
  const [sorting, setSorting] = useState<SortingState>([])
  const table = useReactTable({
    data: dataSet,
    columns,
    state: {sorting},
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onSortingChange: setSorting,
  })
  const {
    make: carMake,
    model: carModel,
    year: carYear,
  } = useRecoilValue(carSearchSelectionsAtom)

  let route = '/api/cars'
  if (carMake) route += `/${carMake}`
  if (carModel) route += `/${carModel}`
  if (carYear) route += `/${carYear}`

  useEffect(() => {
    if (route === '/api/cars') return setDataSet(fullData)

    // fetch(route).then(res => res.json()).then(newDataSet => {
    //   setDataSet(newDataSet)
    // })
  }, [route])

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
              <code>[...slug].ts</code> - catchAll
            </li>
            <li>
              <code>[[...slug]].ts</code> - optionalCatchAll
            </li>
          </ul>
        </div>
        <CarSearch data={fullData} />
      </div>

      <hr />

      <div className="cars-table-container">
        <div className="displayed-route">
          Current data route:{' '}
          <code>
            <strong>{route}</strong>
          </code>
        </div>
        <table className="cars-table">
          <thead>
            {table.getHeaderGroups().map(headerGroup => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map(header => {
                  const sortDir = header.column.getIsSorted() as string

                  return (
                    <th key={header.id}>
                      <div
                        onClick={header.column.getToggleSortingHandler()}
                        className={`cars-table-col-header ${sortDir}`}>
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                      </div>
                    </th>
                  )
                })}
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows.map(row => (
              <tr key={row.id}>
                {row.getVisibleCells().map(cell => (
                  <td key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Page>
  )
}
