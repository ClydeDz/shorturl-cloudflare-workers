const getValuePair = async key => {
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
  return new Response(keyValuePairs ? JSON.stringify(keyValuePairs) : `[]`)
}

const getOne = async key => {
  const urlKeyValue = await getValuePair(key)
  return new Response(urlKeyValue ? JSON.stringify(urlKeyValue) : `[]`)
}

addEventListener('fetch', event => {
  const { request } = event
  const url = new URL(request.url)

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

  event.respondWith(new Response(`Content Not Found`, { status: '404' }))
})
