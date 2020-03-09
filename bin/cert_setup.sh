#!/bin/bash

if [ -z $1 ]; then
  for d in certs/*/ ; do
    echo "Decrypting $d"
    docker-compose run --rm rails openssl aes-256-cbc -salt -pass file:config/credentials/development.key -in "$d"privkey.enc -out "$d"privkey.pem -pbkdf2 -a -d
  done
elif [ $1 = "e" ]; then
  for d in certs/*/ ; do
    echo "Encrypting $d"
    docker-compose run --rm rails openssl aes-256-cbc -salt -pass file:config/credentials/development.key -out "$d"privkey.enc -in "$d"privkey.pem -pbkdf2 -a -e
  done
fi
