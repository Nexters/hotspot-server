import express from 'express'

async function init() {
  const app = express()

  app.get('/', (req, res) => res.send('Hello World!'))
  app.post('/auth/login/kakao', (req, res) =>
    res.send({
      access_token: 'fake-access-token',
    }),
  )

  app.listen(3000, () => console.log(`Hotspot server listening on port 3000!`))
}

init()
