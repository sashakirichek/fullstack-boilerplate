#!/usr/bin/env bash
set -euo pipefail

echo "Building and starting fullstack-boilerplate..."
docker compose up --build "$@"
