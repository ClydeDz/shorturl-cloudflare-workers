const statusCode = 301

const urls = {
  "google": "https://www.google.com",
  "facebook": "https://www.facebook.com",
}

function getRedirectURL(pathname) {
  return urls[pathname] || "/";
}

async function handleRequest(request) {
  const url = new URL(request.url)
  const { pathname } = url

  if (pathname === "/") {
    return new Response("Hello worker!", {
      headers: { "content-type": "text/plain" }
    })
  }

  const redirectURL = getRedirectURL(pathname.replace(/^\//, ""))
  if (redirectURL === "/") {
    return new Response("Hello worker!", {
      headers: { "content-type": "text/plain" }
    })
  }

  return Response.redirect(redirectURL, statusCode)
}

addEventListener("fetch", event => {
  event.respondWith(handleRequest(event.request))
})