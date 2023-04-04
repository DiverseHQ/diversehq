import { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { method } = req
  if (method === 'GET') {
    console.log('GET /api called')
    console.log('req.query', req.query)
    // GET /api
    res.status(200).json({ name: 'John Doe' })
  } else {
    // Handle any other HTTP method
    res.setHeader('Allow', ['GET'])
    res.status(405).end(`Method ${method} Not Allowed`)
  }
}
