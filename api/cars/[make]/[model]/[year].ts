import type {VercelRequest, VercelResponse} from '@vercel/node'
import {cars} from '../../carsDataModule'

export default function handler(req: VercelRequest, res: VercelResponse) {
  const {make, model, year} = req.query
  const data = cars.filter(
    car => car.make === make && car.model === model && car.year === +year
  )

  res.json({data})
}
