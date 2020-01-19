import { Request, Response } from 'express'
import fetch from 'node-fetch'
import uuidv4 from 'uuid/v4'

import { HttpError } from '../middlewares/error'
import { User } from '../models/user'

function generateAccessToken() {
  return [...Array(5)]
    .map((_) =>
      Math.random()
        .toString(36)
        .substring(2, 15),
    )
    .join('')
}

const KAKAO_USER_API_BASE_URL = 'https://kapi.kakao.com'

export default async function loginKakao(req: Request, res: Response) {
  const { kakao_access_token: kakaoAccessToken } = req.body

  const response = await fetch(`${KAKAO_USER_API_BASE_URL}/v2/user/me`, {
    headers: {
      Authorization: `Bearer ${kakaoAccessToken}`,
    },
  })

  if (!response.ok) {
    if (response.status === 401) {
      throw new HttpError(401, 'Invalid Kakao Access Token')
    }

    throw new HttpError(503, 'kakao API failure')
  }

  const {
    id: kakaoId,
    properties: { nickname, profile_image: ProfileImage },
    kakao_account: {
      has_email: hasEmail,
      email,
      has_age_range: hasAgeRange,
      age_range: ageRange,
      has_gender: hasGender,
      gender,
    },
  } = await response.json()

  const existingUser = await User.findOne({
    'social_account.kakao.id': kakaoId,
  })

  // 이미 해당 카카오 id로 가입되어있는 유저가 있을 때
  if (existingUser) {
    if (!existingUser.accessToken) {
      existingUser.accessToken = generateAccessToken()

      await existingUser.save()
    }

    return res.send({
      access_token: existingUser.accessToken,
      new_sign_up: false,
    })
  }

  // 신규 가입
  const newUser = new User({
    _id: uuidv4(),
    accessToken: generateAccessToken(),
    social_account: {
      kakao: {
        id: kakaoId,
        nickname,
        profileImage: ProfileImage,
        email: hasEmail ? email : null,
        ageRange: hasAgeRange ? ageRange : null,
        gender: hasGender ? gender : null,
      },
    },
  })

  await newUser.save()

  res.send({
    access_token: newUser.accessToken,
    new_sign_up: true,
  })
}
