const headers = new Headers({
  'Content-Type': 'application/json',
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': '*',
  'Access-Control-Allow-Methods': 'OPTIONS, DELETE',
  'Access-Control-Max-Age': '-1',
})

const deleteUrl = async (key) => {
  const value = await THEE.get(key)
  if (value) {
    await THEE.delete(key)
    return new Response(
      `Successfully Deleted ${JSON.stringify({
        key,
        value,
      })}`,
      { status: 200, headers },
    )
  }
  return new Response('Bad Request - Provide a valid short url to delete', {
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
        Allow: 'DELETE, OPTIONS',
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
  if (request.method == 'DELETE') {
    const newUrl = url.pathname.replace(/^\/|\/$/gi, '')
    const noWordsRegex = /\W/gi
    if (newUrl && !noWordsRegex.test(newUrl))
      return event.respondWith(deleteUrl(newUrl))
    return event.respondWith(
      new Response(`Bad Request, Check delete path`, { headers, status: 400 }),
    )
  }
  return event.respondWith(
    new Response(`Method Not Allowed`, { headers, status: 405 }),
  )
})
