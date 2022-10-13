import express from 'express';
import mongoose from 'mongoose';
import accountSchema from '../schemas/account.js';
const Account = mongoose.model('Account', accountSchema);

const router = express.Router();

// GET: Get all accounts from DB
router.get('/all', (req, res, next) => {
  console.log([req.headers.auth, process.env.MKCONNECTOR_API_REQUEST_AUTH]);
  if (req.headers.auth !== process.env.MKCONNECTOR_API_REQUEST_AUTH) {
    res.status(401).send('Unauthorized');
    return;
  }

  Account.find({})
    .then((accounts) => {
      res.status(200).send(accounts);
    })
    .catch((error) => {
      console.log('Failed to load all accounts: ', error);
      res.status(500).send(error);
    });
});

// GET: Account item ID by item ID
router.get('/:id', (req, res, next) => {
  if (req.headers.auth !== process.env.MKCONNECTOR_API_REQUEST_AUTH) {
    res.status(401).send('Unauthorized');
  }

  Account.find({ _id: req.params.id })
    .then((account) => {
      res.status(200).send(account[0]);
    })
    .catch((error) => {
      res.status(500).send(error);
    });
});

// POST: Account create new
router.post('/create', (req, res, next) => {
  if (req.headers.auth !== process.env.MKCONNECTOR_API_REQUEST_AUTH) {
    res.status(401).send('Unauthorized');
  }

  const body = req.body;
  const newAccount = new Account({
    name: body.name,
    config: {
      facebookEnabled: body.config.facebookEnabled,
      twitterEnabled: body.config.twitterEnabled,
    },
    misskey: {
      instanceUrl: body.misskey.instanceUrl,
      instanceSecretKey: body.misskey.instanceSecretKey,
    },
    twitter: {
      apiKey: body.twitter.apiKey,
      apiKeySecret: body.twitter.apiKeySecret,
      accessToken: body.twitter.accessToken,
      accessTokenSecret: body.twitter.accessTokenSecret,
      clientId: body.twitter.clientId,
      clientSecret: body.twitter.clientSecret,
      apiBearerToken: body.twitter.apiBearerToken,
    },
    facebook: {
      accessToken: body.facebook.accessToken,
      albumId: body.facebook.albumId,
    },
  });

  newAccount.save({}, (error, account) => {
    if (error) {
      res.status(500).send(error);
    }

    res.status(200).send(`Account successfully created under Id: ${account._id}`);
  })
});

// PUT: Update account by ID
router.put('/:id', (req, res, next) => {
  if (req.headers.auth !== process.env.MKCONNECTOR_API_REQUEST_AUTH) {
    res.status(401).send('Unauthorized');
  }

  Account.findOneAndUpdate({ _id: req.params.id }, req.body, (error, account) => {
    if (error) {
      res.status(500).send(error);
    }

    res.status(200).send(`Account with ID ${account._id} successfully updated`);
  });
});

// DELETE: Delete account by ID
router.delete('/:id', (req, res, next) => {
  if (req.headers.auth !== process.env.MKCONNECTOR_API_REQUEST_AUTH) {
    res.status(401).send('Unauthorized');
  }

  Account.findOneAndDelete({ _id: req.params.id }, (error) => {
    if (error) {
      res.status(500).send(error);
    }

    res.status(200).send(`Account with ID ${req.params.id} has been successfully deleted`);
  });
});

export default router;
