## Enable / Disable Community Feature

To ENABLE a feature for a community run:
```
docker-compose run --rm rails bundle exec rake enable_community_feature['CommunityName','Feature'] # NB: whitespace is not allowed between arguments
```

To DISABLE a feature for a community run:
```
docker-compose run --rm rails bundle exec rake disable_community_feature['CommunityName','Feature'] # NB: whitespace is not allowed between arguments
```