const headers = new Headers({
  'Content-Type': 'application/json',
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': '*',
  'Access-Control-Allow-Methods': 'OPTIONS, GET',
  'Access-Control-Max-Age': '-1',
})

const getValuePair = async (key) => {
  const value = await THEE.get(key)
  return value ? { key, value } : null
}

const getAll = async () => {
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

const getOne = async (key) => {
  const urlKeyValue = await getValuePair(key)
  return new Response(urlKeyValue ? JSON.stringify(urlKeyValue) : `[]`, {
    status: 200,
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
        Allow: 'GET, OPTIONS',
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
  if (request.method == 'GET') {
    if (url.pathname == '/') {
      const allUrls = getAll()
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
      return event.respondWith(getOne(newUrl))
    }
  }
  return event.respondWith(
    new Response(`Method Not Allowed`, { headers, status: 405 }),
  )
})
