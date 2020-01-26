import { Request, Response } from 'express'
import fetch from 'node-fetch'

import { HttpError } from '../middlewares/error'

const KAKAO_SEARCH_API_BASE_URL = 'https://dapi.kakao.com'

export async function searchPlace(req: Request, res: Response) {
    const { search_query: query } = req.body;
    let encodeQuery = encodeURI(query);
    const response = await fetch(`${KAKAO_SEARCH_API_BASE_URL}/v2/local/search/keyword.json?query=${encodeQuery}`, {
        headers: {
            Authorization: `KakaoAK ${process.env.KAKAO_SEARCH_KEY}`
        }
    })
    
    let jsonPlaceList = await response.json();
    
    let placeList = jsonPlaceList.documents;
    
    return res.send(placeList);
}