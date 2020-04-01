# Development tooling and setup

In order to standardize development, we utilize Docker running on Ubuntu, and develop via VSCode remotely over SSH.

TODO: Get this running under Windows.

## Remote machine setup

We run out machines on Digital Ocean, using datacenters that are closest to the developer.

- Ensure that development machine is locked down and up to date
  - Ensure auth is only via SSH Keys, no passwords
  - Update dependencies via apt-get
- Create a new user on the machine and add their SSH Key
- Add the user to the sudoers group
- Install docker and docker-compose
- Add the user to the docker group.

## SSL and DNS setup

Every developer should be able to connect to their machine and use valid SSL certificates for it.

TODO: Eventually we should use Wireguard for this, in order to lock down the host and allow easier outside testing

- Create a DNS entry for the developer, for example mark.dgdpdev.info, add point it to their development machine IP
- Create a new SSL certificate using Certbot/LetsEncrypt, and copy it into the codebase under certs
- Run `./bin/cert_setup.sh e` to encrypt the certificate private key.