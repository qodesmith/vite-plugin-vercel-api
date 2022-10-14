import type {VercelRequest, VercelResponse} from '@vercel/node'
import {cars} from '../carsDataModule'

export default function handler(req: VercelRequest, res: VercelResponse) {
  const {make} = req.query
  const data = cars.filter(car => car.make === make)

  res.json({data})
}
