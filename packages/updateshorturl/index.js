const getValue = async key => {
  const value = await THEE.get(key)
  return value
}

const updateUrl = async (requestBody, url) => {
  const getValue = await THEE.get(url)
  if (!getValue) {
    return new Response('Content not found: No such short url exits', {
      status: 404,
    })
  }
  if (requestBody?.uniqueKey && requestBody?.website) {
    if (requestBody.uniqueKey != url || requestBody.website != getValue) {
      await THEE.delete(url)
      await THEE.put(requestBody.uniqueKey, requestBody.website)
      return new Response(
        `Successfully updated - ${JSON.stringify(requestBody)}`,
      )
    }
  }
  return new Response(
    'Bad Request - Provide both a uniqueKey and a website property in your request body',
    { status: 400 },
  )
}

const readRequestBody = async request => {
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
  })
}

addEventListener('fetch', event => {
  const { request } = event
  const url = new URL(request.url)

  if (request.method == 'PUT') {
    const newUrl = url.pathname.replace(/^\/|\/$/gi, '')
    const noWordsRegex = /\W/gi
    if (newUrl && !noWordsRegex.test(newUrl)) {
      return event.respondWith(handleRequest(request, newUrl))
    }
  }

  event.respondWith(new Response('Content Not Found', { status: 404 }))
})
