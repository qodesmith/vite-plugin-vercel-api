import {Suspense, useMemo} from 'react'
import './CarSearch.css'
import {
  carMakeSelector,
  carModelSelector,
  carsFullDataSelector,
  carYearSelector,
} from '../state/recoilState'
import {useRecoilState, useRecoilValue, useSetRecoilState} from 'recoil'

function CarSearchBody() {
  const fullData = useRecoilValue(carsFullDataSelector)
  const [make, setMake] = useRecoilState(carMakeSelector)
  const [model, setModel] = useRecoilState(carModelSelector)
  const setYear = useSetRecoilState(carYearSelector)

  const makes = useMemo(() => {
    return Array.from(new Set(fullData.map(car => car.make))).sort()
  }, [fullData])

  const models = useMemo(() => {
    if (!make) return []

    const carModels = fullData.reduce((acc, car) => {
      if (car.make === make) acc.add(car.model)
      return acc
    }, new Set([] as string[]))

    return Array.from(carModels).sort()
  }, [make, fullData])

  const years = useMemo(() => {
    if (!model) return []

    const carYears = fullData.reduce((acc, car) => {
      if (car.make === make && car.model === model) acc.add(car.year)
      return acc
    }, new Set([] as number[]))

    return Array.from(carYears).sort((a, b) => a - b)
  }, [make, model, fullData])

  return (
    <div className="car-search-container">
      {/* MAKE - /api/cars/:make */}
      <section>
        <label htmlFor="make">Make</label>
        <select
          id="make"
          onChange={e => {
            setMake(e.target.value)
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
            setModel(e.target.value)
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
            setYear(e.target.value)
          }}
          disabled={years.length === 0}>
          <option value="">--Select a year--</option>
          {years.map(y => {
            return (
              <option key={y} value={y}>
                {y}
              </option>
            )
          })}
        </select>
      </section>
    </div>
  )
}

export default function CarSearch() {
  return (
    <Suspense fallback={<div>Loading car search...</div>}>
      <CarSearchBody />
    </Suspense>
  )
}
