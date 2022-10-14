import {atom} from 'recoil'

export const carSearchSelectionsAtom = atom({
  key: 'carSearchSelectionsAtom',
  default: {make: '', model: '', year: ''},
})
