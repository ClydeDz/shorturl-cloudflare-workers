const statusCode = 301

async function getRedirectURL(pathname) {
  let value = await SHORTURLS.get(pathname)
  return value || "/";
}

async function handleRequest(request) {
  const url = new URL(request.url)
  const { pathname } = url

  if (pathname === "/") {
    return new Response("Hello worker!", {
      headers: { "content-type": "text/plain" }
    })
  }

  const redirectURL = await getRedirectURL(pathname.replace(/^\//, ""))
  if (redirectURL === "/") {
    return new Response("Not redirect URL found", {
      headers: { "content-type": "text/plain" }
    })
  }

  return Response.redirect(redirectURL, statusCode)
}

addEventListener("fetch", event => {
  event.respondWith(handleRequest(event.request))
})