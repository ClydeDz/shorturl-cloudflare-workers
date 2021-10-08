# Scripts used for this project
###############################

# General wrangler command used during development

wrangler login

wrangler dev

# Initialize a Cloudflare Worker locally using a simple template

wrangler generate shorturl https://github.com/cloudflare/worker-template

# Create a KV namespace and add seed data

wrangler kv:namespace create "SHORTURLS"

wrangler kv:key put --binding=SHORTURLS "twitter" "https://twitter.com/clydedz"

# Repeat the above steps but this time for preview environment

wrangler kv:namespace create --preview "SHORTURLS" 

wrangler kv:key put --binding=SHORTURLS "twitter" "https://twitter.com/clydedz" --preview