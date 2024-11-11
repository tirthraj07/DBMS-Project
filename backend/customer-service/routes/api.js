const express = require('express');
const api_router = express.Router();
const v1_router = require("./v1")
const authenticationMiddleware = require('../middleware/middleware.auth')

api_router.use('/v1', [authenticationMiddleware] ,v1_router);


module.exports = api_router;