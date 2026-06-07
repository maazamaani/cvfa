#!/bin/sh
set -eu

mkdir -p /app/data

if [ ! -f /app/data/cv.json ]; then
  echo "cvfa: seeding /app/data/cv.json from image defaults"
  cp /app/defaults/cv.json /app/data/cv.json
fi

chown -R nextjs:nodejs /app/data 2>/dev/null || true

exec su-exec nextjs:nodejs "$@"
