import { Request, Response } from 'express'
import fetch from 'node-fetch'

import { HttpError } from '../middlewares/error'

const KAKAO_SEARCH_API_BASE_URL = 'https://dapi.kakao.com'

export async function searchPlace(req: Request, res: Response) {
  const { search_keyword: searchQuery } = req.query
  const encodeQuery = encodeURI(searchQuery)

  const response = await fetch(
    `${KAKAO_SEARCH_API_BASE_URL}/v2/local/search/keyword.json?query=${encodeQuery}`,
    {
      headers: {
        Authorization: `KakaoAK ${process.env.KAKAO_SEARCH_KEY}`,
      },
    },
  )
  const jsonPlaceList = await response.json()
  const placeList = jsonPlaceList.documents

  return res.send(placeList)
}
