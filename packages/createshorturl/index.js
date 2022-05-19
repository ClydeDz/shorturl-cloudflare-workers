const getRedirectURL = async uniqueKey => {
  const value = await THEE.get(uniqueKey)
  return value || ''
}

const createRedirectURL = async (uniqueKey, website) => {
  await THEE.put(uniqueKey, website)
}

const createShortUrl = async shortUrlRequest => {
  const existingWebsite = await getRedirectURL(shortUrlRequest.uniqueKey)
  if (existingWebsite) {
    return new Response(
      `Content Not Found - No short url has been found with your request`,
      { status: 404 },
    )
  }
  await createRedirectURL(shortUrlRequest.uniqueKey, shortUrlRequest.website)
  return new Response(`Short URL created`)
}

const readRequestBody = async request => {
  const { headers } = request
  const contentType = headers.get('content-type') || ''

  if (contentType.includes('application/json')) {
    const requestBody = JSON.stringify(await request.json())
    const parsedRequestBody = JSON.parse(requestBody)
    return createShortUrl(parsedRequestBody)
  }

  return new Response(
    `Bad Request - Please supply application/json body type`,
    {
      status: 400,
    },
  )
}

const handleRequest = async request => {
  const requestBody = await readRequestBody(request)
  return requestBody
}

addEventListener('fetch', event => {
  const { request } = event
  const url = new URL(request.url)

  if (url.pathname == '/' && request.method === 'POST') {
    return event.respondWith(handleRequest(request))
  }

  event.respondWith(new Response(`Content Not Found`, { status: 404 }))
})
