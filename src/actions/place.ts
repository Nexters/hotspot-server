import { Request, Response } from 'express'
import fetch from 'node-fetch'
import { KAKAO_SEARCH_KEY } from '../config'

import { HttpError } from '../middlewares/error'

const KAKAO_SEARCH_API_BASE_URL = 'https://dapi.kakao.com'

export async function searchPlace(req: Request, res: Response) {
  const { search_keyword: searchQuery } = req.query
  const encodeQuery = encodeURI(searchQuery)

  const response = await fetch(
    `${KAKAO_SEARCH_API_BASE_URL}/v2/local/search/keyword.json?query=${encodeQuery}`,
    {
      headers: {
        Authorization: `KakaoAK ${KAKAO_SEARCH_KEY}`,
      },
    },
  )
  const jsonPlaceList = await response.json()
  const placeList = jsonPlaceList.documents.map((place: any) => {
    return {
      kakaoId: place.id,
      kakaoUrl: place.place_url,
      placeName: place.place_name,
      addressName: place.address_name,
      roadAddressName: place.road_address_name || null,
      x: place.x,
      y: place.y,
    }
  })

  return res.send(placeList)
}
