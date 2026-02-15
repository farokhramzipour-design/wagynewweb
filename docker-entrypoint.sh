#!/bin/sh
set -eu

API_BASE="${NEXT_PUBLIC_API_BASE_URL:-}"
cat <<EOT > /app/public/runtime-config.js
window.__ENV = {
  NEXT_PUBLIC_API_BASE_URL: "${API_BASE}"
};
EOT

exec "$@"
