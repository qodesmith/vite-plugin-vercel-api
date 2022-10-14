import {useMemo} from 'react'
import {CarType} from '../../api/cars'
import './CarSearch.css'
import {carSearchSelectionsAtom} from '../state/recoilState'
import {useRecoilState} from 'recoil'

type CarSearchProps = {
  data: CarType[]
}

export default function CarSearch({data}: CarSearchProps) {
  const [searchState, setSearchState] = useRecoilState(carSearchSelectionsAtom)
  const {make, model, year} = searchState
  // const [make, setMake] = useRecoilState(carMakeAtom)
  // const [model, setModel] = useRecoilState(carModelAtom)
  // const [year, setYear] = useRecoilState(carYearAtom)

  const makes = useMemo(() => {
    return Array.from(new Set(data.map(car => car.make))).sort()
  }, [data])

  const models = useMemo(() => {
    if (!make) return []

    const carModels = data.reduce((acc, car) => {
      if (car.make === make) acc.add(car.model)
      return acc
    }, new Set([] as string[]))

    return Array.from(carModels).sort()
  }, [make, data])

  const years = useMemo(() => {
    if (!model) return []

    const carYears = data.reduce((acc, car) => {
      if (car.make === make && car.model === model) acc.add(car.year)
      return acc
    }, new Set([] as number[]))

    return Array.from(carYears).sort((a, b) => a - b)
  }, [make, model, data])

  return (
    <div className="car-search-container">
      {/* MAKE - /api/cars/:make */}
      <section>
        <label htmlFor="make">Make</label>
        <select
          id="make"
          onChange={e => {
            setSearchState({
              make: e.target.value,
              model: '',
              year: '',
            })
          }}>
          <option value="">--Select a make--</option>
          {makes.map(make => {
            return (
              <option key={make} value={make}>
                {make}
              </option>
            )
          })}
        </select>
      </section>

      {/* MODEL /api/cars/:make/:model */}
      <section>
        <label htmlFor="model">Model</label>
        <select
          id="model"
          onChange={e => {
            setSearchState(prevState => ({
              model: e.target.value,
              make: prevState.make,
              year: '',
            }))
          }}
          disabled={models.length === 0}>
          <option value="">--Select a model--</option>
          {models.map(model => {
            return (
              <option key={model} value={model}>
                {model}
              </option>
            )
          })}
        </select>
      </section>

      {/* YEAR /api/cars/:make/:model/:year */}
      <section>
        <label htmlFor="year">Year</label>
        <select
          id="year"
          onChange={e => {
            setSearchState(prevState => ({...prevState, year: e.target.value}))
          }}
          disabled={years.length === 0}>
          <option value="">--Select a year--</option>
          {years.map(year => {
            return (
              <option key={year} value={year}>
                {year}
              </option>
            )
          })}
        </select>
      </section>
    </div>
  )
}
