#!/bin/sh
echo "please set GOOGLE_API_KEY environment variable"
docker run \
 --publish 8000:80 \
 --rm \
 hsmtkk/restaurant_review:nodejs

