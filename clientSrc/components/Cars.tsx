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
import {useState} from 'react'

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
  const {data} = useLoaderData() as {data: CarType[]}
  const [sorting, setSorting] = useState<SortingState>([])
  const table = useReactTable({
    data,
    columns,
    state: {sorting},
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onSortingChange: setSorting,
  })

  return (
    <Page>
      <h1>Cars</h1>

      <hr />

      <div className="cars-table-container">
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
