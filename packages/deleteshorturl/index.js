const deleteUrl = async key => {
  const value = await THEE.get(key)
  if (value) {
    await THEE.delete(key)
    return new Response(
      `Successfully Deleted ${JSON.stringify({
        key,
        value,
      })}`,
    )
  }
  return new Response(
    'Content Not Found - Provide a valid short url to delete',
    { status: 404 },
  )
}

addEventListener('fetch', event => {
  const { request } = event
  const url = new URL(request.url)

  if (request.method == 'DELETE') {
    const newUrl = url.pathname.replace(/^\/|\/$/gi, '')
    const noWordsRegex = /\W/gi
    if (newUrl && !noWordsRegex.test(newUrl))
      return event.respondWith(deleteUrl(newUrl))
  }

  event.respondWith(new Response('Content Not Found', { status: 404 }))
})
