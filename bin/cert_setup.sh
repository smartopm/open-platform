#!/bin/bash

if [ -z $1 ]; then
  docker-compose run --rm rails openssl aes-256-cbc -salt -pass file:config/credentials/development.key -in certs/dev.dgdp.site/privkey.enc -out certs/dev.dgdp.site/privkey.pem -pbkdf2 -a -d
  docker-compose run --rm rails openssl aes-256-cbc -salt -pass file:config/credentials/development.key -in certs/vpn.dgdp.site/privkey.enc -out certs/vpn.dgdp.site/privkey.pem -pbkdf2 -a -d
  docker-compose run --rm rails openssl aes-256-cbc -salt -pass file:config/credentials/development.key -in certs/olivier.dgdp.site/privkey.enc -out certs/olivier.dgdp.site/privkey.pem -pbkdf2 -a -d
elif [ $1 = "e" ]; then
  docker-compose run --rm rails openssl aes-256-cbc -salt -pass file:config/credentials/development.key -out certs/dev.dgdp.site/privkey.enc -in certs/dev.dgdp.site/privkey.pem -pbkdf2 -a -e
  docker-compose run --rm rails openssl aes-256-cbc -salt -pass file:config/credentials/development.key -out certs/vpn.dgdp.site/privkey.enc -in certs/vpn.dgdp.site/privkey.pem -pbkdf2 -a -e
  docker-compose run --rm rails openssl aes-256-cbc -salt -pass file:config/credentials/development.key -out certs/olivier.dgdp.site/privkey.enc -in certs/olivier.dgdp.site/privkey.pem -pbkdf2 -a -e
fi
