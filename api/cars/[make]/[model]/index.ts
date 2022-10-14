import type {VercelRequest, VercelResponse} from '@vercel/node'
import {cars} from '../../carsDataModule'

export default function handler(req: VercelRequest, res: VercelResponse) {
  const {make, model} = req.query
  const data = cars.filter(car => car.make === make && car.model === model)

  res.json({data})
}
