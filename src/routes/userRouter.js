var express = require('express');
var router = express.Router();
var Oauth = require('../middleware/OauthSocial');

/* ROUTER FOR USER */
const userController = require("../controllers/userController.js")

router.get('/:id', userController.findUser);

router.get('/', userController.findAll);

router.post('/', userController.create);

router.put('/:id', userController.update);

router.delete('/:id', userController.delete);

router.post('/authenticate', userController.authenticate);

router.get('/auth/google',
    Oauth.authenticate('google', {
        scope: ['email', 'profile']
    }));

router.get('/auth/google/callback',
    Oauth.authenticate('google', {
        failureRedirect: '/user/auth/google/failure'
    }),
    userController.authenticateByGoogle
);

module.exports = router;