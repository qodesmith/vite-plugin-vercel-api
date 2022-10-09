import type {VercelRequest, VercelResponse} from '@vercel/node'

/*
  https://github.com/vercel/community/discussions/893#discussioncomment-3756470
  The `require` syntax is needed to import Node modules.
*/
const path = require('node:path')
const fs = require('fs-extra')

export type CarType = {
  id: string
  make: string
  model: string
  year: number
  vin: string
}

export default function handler(req: VercelRequest, res: VercelResponse) {
  // https://vercel.com/guides/how-can-i-use-files-in-serverless-functions
  const pathFromProjectRootToFile = '/api/cars/carsData.json'
  const carsDataFilePath = path.join(process.cwd(), pathFromProjectRootToFile)
  const data: CarType[] = fs.readJSONSync(carsDataFilePath)

  res.json({data})
}
