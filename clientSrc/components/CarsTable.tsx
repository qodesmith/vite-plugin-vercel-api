import {
  createColumnHelper,
  type SortingState,
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  flexRender,
} from '@tanstack/react-table'
import {Suspense, useState} from 'react'
import {useRecoilValue} from 'recoil'
import type {CarType} from '../../api/cars'
import {carDataSelector} from '../state/recoilState'

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

function CarsTableBody() {
  const data = useRecoilValue(carDataSelector)
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
  )
}

export default function CarsTable() {
  return (
    <Suspense fallback={<div>Lodaing cars table...</div>}>
      <CarsTableBody />
    </Suspense>
  )
}
