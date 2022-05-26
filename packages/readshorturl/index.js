const getHeaders = (headerOrigin) =>
  new Headers({
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin':
      headerOrigin == 'https://thee-admin.pages.dev'
        ? 'https://thee-admin.pages.dev'
        : 'https://admin.thee.it',
    'Access-Control-Allow-Headers': '*',
    'Access-Control-Allow-Methods': 'OPTIONS, GET',
    'Access-Control-Max-Age': '-1',
  })

const getValuePair = async (key) => {
  const value = await THEE.get(key)
  return value ? { key, value } : null
}

const getAll = async (headers) => {
  const allShortUrls = await THEE.list()
  let keyValuePairs = []
  if (allShortUrls?.keys) {
    for (let i = 0; i < allShortUrls.keys.length; i++) {
      keyValuePairs.push(await getValuePair(allShortUrls.keys[i].name))
    }
  }
  return new Response(keyValuePairs ? JSON.stringify(keyValuePairs) : `[]`, {
    status: 200,
    headers,
  })
}

const getOne = async (key, headers) => {
  const urlKeyValue = await getValuePair(key)
  return new Response(urlKeyValue ? JSON.stringify(urlKeyValue) : `[]`, {
    status: 200,
    headers,
  })
}

const handleOptions = (request, headers) => {
  if (
    request.headers.get('Origin') == 'https://thee-admin.pages.dev' ||
    request.headers.get('Origin') == 'https://admin.thee.it'
  ) {
    // Handle CORS pre-flight request.
    return new Response(null, {
      headers,
    })
  }
  // Handle standard OPTIONS request.
  return new Response(null, {
    status: 403,
    statusText: 'Forbidden',
  })
}

addEventListener('fetch', (event) => {
  const { request } = event
  const url = new URL(request.url)
  const headers = getHeaders(request.headers.get('Origin'))

  if (request.method === 'OPTIONS') {
    return event.respondWith(handleOptions(request, headers))
  }
  if (request.method == 'GET') {
    if (url.pathname == '/') {
      const allUrls = getAll(headers)
      return event.respondWith(allUrls)
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
      return event.respondWith(getOne(newUrl, headers))
    }
  }
  return event.respondWith(
    new Response(`Method Not Allowed`, { headers, status: 405 }),
  )
})
