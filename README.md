# Misskey Connector
## Node.js automatic client to one-way repost your notes from Misskey to Twitter
***Note:*** *this repository is under active development, try to keep updating. I'm actively fixing bugs and adding new features*

### Simple one account usage:
- For one account support switch to branch master-single-account
- Convert .env to .env.development and .env.production, if you will use this script only as-is, your main file is .env.production
- Fill up your .env.production file with desired credentials
- Change bash script privilegies to be executable, `sudo chmod +x prod-run.sh`
- Run with ./prod-run.sh

### Usage:
- Pull this repository
- Convert .env to .env.development and .env.production, if you will use this script only as-is, your main file is .env.production
- Write down your credentials into .env.files
- For best results with MongoDB migrations install npm package https://github.com/seppevs/migrate-mongo
  - `npm i -g migrate-mongo`
  - Use files in migrations folder, migrate-mongo-config.js need to fillup your MongoDB address for connection
  - Run migrate-mongo create
  - Copy body of example-migration.js to new created migration file and edit your imported data to MongoDB.
- You could use MongoDB Compass for document creation.
- Facebook pages requires to generate non-expiring page token via Graph API Explorer and Graph API token debugger
- Change bash script privilegies to be executable, `sudo chmod +x prod-run.sh`
- Deploy edited repository to server, set prod-run.sh to executable and run prod-run.sh bash script
- NOTE: Never share your MKCONNECTOR_API_REQUEST_AUTH bearer token from .env file. You could be nasty hacked by API requests...
- NOTE: If you wouldn't like to use migrations, feel free to use API endpoints

### Development:
- Pull this repository
- Convert .env into .env.development
- Run codebase with `npm run docker-compose`

### Roadmap
- Add Twitter V2 API OAUTH support
- ~~Add support for Facebook connection, conversion notes to FB posts~~
  - Posting directly to FB is not possible ATM due the API restrictions
- Add MongoDB database for managing multiple accounts - ***DONE***
- Add Misskey multiaccount support - ***DONE***
- Add support for Facebook pages API - ***DONE***
- Enable twitter threading - ***DONE***
- Add support for Instagram Business API ***Coming soon later this year***
- Add support for Twitter user polls ***Coming soon later this year***
- ~~Refactor codebase to OOP classes~~
- Simple config admin dashboard for service endpoints - ***Coming soon later***
- Make out of box docker container support for easy server installation
- Add Github CI/CD support out of box

### Used technology:
- Docker
- MongoDB
- NodeJS
- Express
- Twitter 1 API
- Facebook Graph API
- Official Misskey API library

### For any questions contact me on my Fediverse account - @johnny@chatsubo.cbrpnk.dev. Feel free to fork this repository. Issues are welcome only for critical problems with security.

### Warning
Never share to repository your credential data from social sites API!

![MK Mascot](https://i.pinimg.com/564x/0e/38/46/0e3846c009b086f106ea98cf82c9a653.jpg)
