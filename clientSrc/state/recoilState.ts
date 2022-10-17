import {atom, DefaultValue, selector} from 'recoil'
import {CarType} from '../../api/cars'

const initialApiRoute = '/api/cars'
const initialCarSearchSelectionsValue = {make: '', model: '', year: ''}

export const carSearchSelectionsAtom = atom({
  key: 'carSearchSelectionsAtom',
  default: initialCarSearchSelectionsValue,
})

export const carMakeSelector = selector({
  key: 'carMakeSelector',
  get({get}) {
    const {make} = get(carSearchSelectionsAtom)
    return make
  },
  set({set}, newValue) {
    // The selector is being reset.
    if (newValue instanceof DefaultValue) {
      return set(carSearchSelectionsAtom, initialCarSearchSelectionsValue)
    }

    set(carSearchSelectionsAtom, {
      ...initialCarSearchSelectionsValue,
      make: newValue,
    })
  },
})

export const carModelSelector = selector({
  key: 'carModelSelector',
  get({get}) {
    const {model} = get(carSearchSelectionsAtom)
    return model
  },
  set({get, set}, newValue) {
    const {make} = get(carSearchSelectionsAtom)

    // The selector is being reset.
    if (newValue instanceof DefaultValue) {
      return set(carSearchSelectionsAtom, {
        ...initialCarSearchSelectionsValue,
        make,
      })
    }

    set(carSearchSelectionsAtom, {make, model: newValue, year: ''})
  },
})

export const carYearSelector = selector({
  key: 'carYearSelector',
  get({get}) {
    const {year} = get(carSearchSelectionsAtom)
    return year
  },
  set({get, set}, newValue) {
    const {make, model} = get(carSearchSelectionsAtom)

    // The selector is being reset.
    if (newValue instanceof DefaultValue) {
      return set(carSearchSelectionsAtom, {
        ...initialCarSearchSelectionsValue,
        make,
        model,
      })
    }

    set(carSearchSelectionsAtom, {make, model, year: newValue})
  },
})

const initialCarsFetch = fetch('/api/cars')
  .then(res => res.json())
  .then(({data}) => data) as Promise<CarType[]>

let isFirstCarsFetch = true
export const carDataSelector = selector({
  key: 'carDataAtom',
  get({get}) {
    const route = get(carsRouteSelector)

    if (isFirstCarsFetch) {
      isFirstCarsFetch = false
      return initialCarsFetch
    }

    return fetch(route)
      .then(res => res.json())
      .then(({data}) => data) as Promise<CarType[]>
  },
})

export const carsRouteSelector = selector({
  key: 'carsRouteSelector',
  get({get}) {
    const {make, model, year} = get(carSearchSelectionsAtom)

    return `${initialApiRoute}${make ? `/${make}` : ''}${
      model ? `/${model}` : ''
    }${year ? `/${year}` : ''}`
  },
})

export const carsFullDataSelector = selector<CarType[]>({
  key: 'carsFullDataSelector',
  get() {
    return initialCarsFetch
  },
})
