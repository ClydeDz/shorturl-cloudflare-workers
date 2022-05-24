const destinationUrl = 'https://dilmahtea.nl'
const statusCode = 301

const getOne = async (key) => {
  const urlKeyValue = await getValuePair(key)
  return new Response.redirect(urlKeyValue, statusCode)
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
        Allow: 'GET, OPTIONS',
      },
    })
  }
}

const handleRequest = () => {
  return new Response.redirect(destinationUrl, statusCode)
}

addEventListener('fetch', (event) => {
  const { request } = event
  const url = new URL(request.url)

  if (request.method === 'OPTIONS') {
    return event.respondWith(handleOptions(request))
  }
  if (request.method == 'GET') {
    if (url.pathname == '/') {
      return event.respondWith(handleRequest(request))
    } else {
      const subDirRegex = /\W/gi
      const newUrl = url.pathname.replace(/^\/|\/$/gi, '')
      if (subDirRegex.test(newUrl)) {
        return event.respondWith(
          new Response(
            'Bad Request - Your short url should only have lettes and numbers',
            { status: 400 },
          ),
        )
      }
      return event.respondWith(getOne(newUrl))
    }
  }
  return event.respondWith(
    new Response(`Method Not Allowed`, { headers, status: 405 }),
  )
})
