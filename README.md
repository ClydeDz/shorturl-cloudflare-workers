# Short URL service using Cloudflare Workers

Demo app created for a Medium article to demonstrate [Cloudflare Workers](https://workers.cloudflare.com/) and [Cloudflare KV storage](https://developers.cloudflare.com/workers/learning/how-kv-works). This app is a short URL service like bit.ly and the likes. We're also automatically deploying this Cloudflare Worker using GitHub Actions.

## Creating a short URL
Once you deploy both workers to your Cloudflare account, make a POST request to `https://createshorturl.<worker domain>.workers.dev/` with a `application/json` body like below.

```json
{
    "uniqueKey": "git",
    "website": "https://github.com"
}
```

## Testing the redirect
Now, if you head over to `https://shorturl.<worker domain>.workers.dev/git`, it will redirect you to https://github.com because the website that matches the `uniquekey` "git" supplied earlier and stored in the KV storage.

See the About section of this repo for the link to the Medium article.

Follow me on Medium [@ClydeDz](https://clydedz.medium.com/).