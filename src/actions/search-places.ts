import { Request, Response } from 'express'
import fetch from 'node-fetch'
import { KAKAO_SEARCH_KEY } from '../config'

const KAKAO_SEARCH_API_BASE_URL = 'https://dapi.kakao.com'

export default async function searchPlaces(req: Request, res: Response) {
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
  const categories = categoryName.split(' > ')

  switch (categories[0]) {
    case '음식점': {
      if (categoryName.includes('카페')) {
        return '카페'
      } else if (categoryName.includes('술집')) {
        return '술집'
      }
      return '맛집'
    }
    case '문화,예술':
      return '문화'
    case '여행':
      return '문화'
    case '가정,생활':
      return '문화'
    default:
      return '기타'
  }
}
