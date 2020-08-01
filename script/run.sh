#!/bin/sh
echo "please set GOOGLE_API_KEY environment variable"
docker run \
 --publish 3000:3000 \
 --rm \
 hsmtkk/restaurant_review:nodejs

