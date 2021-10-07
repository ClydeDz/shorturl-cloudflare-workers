const base = "https://example.com"
const statusCode = 301

async function handleRequest(request) {
  const url = new URL(request.url)
  const { pathname } = url
  const destinationURL = base + pathname

  if (pathname === "/") {
    return new Response("Hello worker!", {
      headers: { "content-type": "text/plain" }
    })
  }

  return Response.redirect(destinationURL, statusCode)
}

addEventListener("fetch", event => {
  event.respondWith(handleRequest(event.request))
})