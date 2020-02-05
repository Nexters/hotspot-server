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
    const categoryName = convertCategoryName(place.category_name)
    return {
      kakaoId: place.id,
      kakaoUrl: place.place_url,
      placeName: place.place_name,
      categoryName,
      addressName: place.address_name,
      roadAddressName: place.road_address_name || null,
      x: place.x,
      y: place.y,
    }
  })

  return res.send(placeList)
}

function convertCategoryName(categoryName: string) {
  let convertName = '기타'
  const foodPattern = /음식점/
  const culturePattern = /문화|예술|여행|가정|생활/

  if (foodPattern.test(categoryName)) {
    convertName = '맛집'
  }
  if (culturePattern.test(categoryName)) {
    convertName = '문화'
  }

  switch (convertName) {
    case '맛집':
      if (categoryName.includes('카페')) {
        convertName = '카페'
      } else if (categoryName.includes('술집')) {
        convertName = '술집'
      }
      break
  }

  return convertName
}
