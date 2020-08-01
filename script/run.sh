#!/bin/sh
docker run --env GOOGLE_API_KEY=AIzaSyCm0xvWbynLIUd_CFn-mNH7NgJrAkrfrvM \
 --publish 8000:80 \
 --rm \
 hsmtkk/restaurant_review:nodejs

