const headers = new Headers({
  'Content-Type': 'application/json',
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': '*',
  'Access-Control-Allow-Methods': 'OPTIONS, POST',
  'Access-Control-Max-Age': '-1',
})

const getRedirectURL = async (uniqueKey) => {
  const value = await THEE.get(uniqueKey)
  return value || ''
}

const createRedirectURL = async (uniqueKey, website) => {
  await THEE.put(uniqueKey, website)
}

const createShortUrl = async (shortUrlRequest) => {
  const existingWebsite = await getRedirectURL(shortUrlRequest.uniqueKey)
  if (existingWebsite) {
    return new Response(
      `Content Not Found - No short url has been found with your request`,
      { headers, status: 400, statusText: 'Short URL already exists' },
    )
  }
  await createRedirectURL(shortUrlRequest.uniqueKey, shortUrlRequest.website)
  return new Response(`Short URL created`, { status: 200, headers })
}

const readRequestBody = async (request) => {
  const { headers } = request
  const contentType = headers.get('content-type') || ''

  if (contentType.includes('application/json')) {
    const requestBody = JSON.stringify(await request.json())
    const parsedRequestBody = JSON.parse(requestBody)
    if (
      !parsedRequestBody ||
      !parsedRequestBody?.uniqueKey ||
      !parsedRequestBody?.website
    ) {
      return new Response(
        `Ensure you have uniqueKey and website fields in your body`,
        { headers, status: 400, statusText: 'Bad Request' },
      )
    }
    return createShortUrl(parsedRequestBody)
  }

  return new Response(null, {
    headers,
    status: 415,
    statusText: 'Unsupported Media Type',
  })
}

const handleRequest = async (request) => {
  const requestBody = await readRequestBody(request)
  return requestBody
}

const handleOptions = (request) => {
  if (
    request.headers.get('Origin') !== null &&
    request.headers.get('Access-Control-Request-Method') !== null &&
    request.headers.get('Access-Control-Request-Headers') !== null
  ) {
    // Handle CORS pre-flight request.
    return new Response(null, {
      headers,
    })
  } else {
    // Handle standard OPTIONS request.
    return new Response(null, {
      headers: {
        Allow: 'POST, OPTIONS',
      },
    })
  }
}

addEventListener('fetch', (event) => {
  const { request } = event
  const url = new URL(request.url)

  if (url.pathname == '/' && request.method === 'OPTIONS') {
    return event.respondWith(handleOptions(request))
  }
  if (url.pathname == '/' && request.method === 'POST') {
    return event.respondWith(handleRequest(request))
  }
  if (request.method != 'POST' || request.method != 'OPTIONS') {
    return event.respondWith(
      new Response(`Method Not Allowed`, { headers, status: 405 }),
    )
  }
  return event.respondWith(
    new Response(`Path Not Allowed`, { headers, status: 400 }),
  )
})
