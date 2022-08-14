#!/bin/bash

version=$(git rev-parse --short HEAD)

echo "Uploading source maps for version $version!"

domains=( "app" "testing" "testing-staging" "morazancity" "tilisi" "greenpark" "enyimba" )
for domain in "${domains[@]}"; do
	echo "$i"
  for path in $(find app/assets/builds -name "*.js"); do
    path=$(basename "$path")
    url=https://${domain}.doublegdp.com/assets/${path}
    source_map="@$path.map"

    echo "Uploading source map for $url"

    curl --silent --show-error https://api.rollbar.com/api/1/sourcemap \
      -F access_token=$1 \
      -F version=$version \
      -F minified_url=$url \
      -F source_map=$source_map
  done
done
