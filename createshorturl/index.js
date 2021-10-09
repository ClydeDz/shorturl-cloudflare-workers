async function getRedirectURL(uniqueKey) {
  const value = await SHORTURLS.get(uniqueKey)
  return value || "";
}

async function createRedirectURL(uniqueKey, website) {
  await SHORTURLS.put(uniqueKey, website)
}

async function createShortUrl(shortUrlRequest) {
  const existingWebsite = await getRedirectURL(shortUrlRequest.uniqueKey)
  if(existingWebsite) {
    return "A short URL has already been configured using this unique key"
  }
  await createRedirectURL(shortUrlRequest.uniqueKey, shortUrlRequest.website)
  return "Short URL created"
}

async function readRequestBody(request) {
  const { headers } = request
  const contentType = headers.get("content-type") || ""

  if (contentType.includes("application/json")) {
    const requestBody = JSON.stringify(await request.json())
    const parsedRequestBody = JSON.parse(requestBody)
    return createShortUrl(parsedRequestBody)
  }

  return `Sorry, couldn't parse your request at the moment.`;
}

async function handleRequest(request) {
  const requestBody = await readRequestBody(request)
  return new Response(`${requestBody}`)
}

addEventListener("fetch", event => {
  const { request } = event 

  if (request.method === "POST") {
    return event.respondWith(handleRequest(request))
  }

  event.respondWith(new Response(
    `Please supply a uniqueKey and a website in the request body to create a short URL`))
})