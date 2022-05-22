const headers = new Headers({
  'Content-Type': 'application/json',
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': '*',
  'Access-Control-Allow-Methods': 'OPTIONS, PUT',
  'Access-Control-Max-Age': '-1',
})

const getValue = async (key) => {
  const value = await THEE.get(key)
  return value
}

const updateUrl = async (requestBody, url) => {
  const getValue = await THEE.get(url)
  if (!getValue) {
    return new Response('Content not found: No such short url exists', {
      status: 400,
      headers,
    })
  }
  if (requestBody?.uniqueKey && requestBody?.website) {
    if (requestBody.uniqueKey != url || requestBody.website != getValue) {
      await THEE.delete(url)
      await THEE.put(requestBody.uniqueKey, requestBody.website)
      return new Response(
        `Successfully updated - ${JSON.stringify(requestBody)}`,
        {
          status: 200,
          headers,
        },
      )
    }
  }
  return new Response(null, {
    headers,
    status: 415,
    statusText: 'Unsupported Media Type',
  })
}

const readRequestBody = async (request) => {
  const { headers } = request
  const contentType = headers.get('content-type') || ''

  if (contentType.includes('application/json')) {
    const requestContent = await request.json()
    return requestContent
  }
  return null
}

const handleRequest = async (request, url) => {
  const requestBody = await readRequestBody(request)
  if (requestBody) {
    const update = await updateUrl(requestBody, url)
    return update
  }
  return new Response('Bad Request - Provide a application/json body type', {
    status: 400,
    headers,
  })
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
        Allow: 'PUT, OPTIONS',
      },
    })
  }
}

addEventListener('fetch', (event) => {
  const { request } = event
  const url = new URL(request.url)

  if (request.method === 'OPTIONS') {
    return event.respondWith(handleOptions(request))
  }
  if (request.method == 'PUT') {
    const newUrl = url.pathname.replace(/^\/|\/$/gi, '')
    const noWordsRegex = /\W/gi
    if (newUrl && !noWordsRegex.test(newUrl)) {
      return event.respondWith(handleRequest(request, newUrl))
    }
  }
  return event.respondWith(
    new Response(`Method Not Allowed`, { headers, status: 405 }),
  )
})
