# Short URL service using Cloudflare Workers

Demo app created for a Medium article to demonstrate [Cloudflare Workers](https://workers.cloudflare.com/) and [Cloudflare KV storage](https://developers.cloudflare.com/workers/learning/how-kv-works). This app is a short URL service like bit.ly and the likes. That means, once you deploy this Worker, if you head over to `<worker name>/uniquekey`, it will redirect you to the website that matches this `uniquekey` provided the `uniquekey` is already entered in the KV storage. We're also automatically deploying this Cloudflare Worker using GitHub Actions.

See the About section of this repo for the link to the Medium article.

Follow me on Medium [@ClydeDz](https://clydedz.medium.com/).