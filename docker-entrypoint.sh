#!/bin/sh
set -eu

API_BASE="${NEXT_PUBLIC_API_BASE_URL:-}"
cat <<EOT > /tmp/runtime-config.js
window.__ENV = {
  NEXT_PUBLIC_API_BASE_URL: "${API_BASE}"
};
EOT
cp /tmp/runtime-config.js /app/public/runtime-config.js

exec "$@"
