const express = require('express');
const api_router = express.Router();
const v1_router = require("./v1")

api_router.use('/v1', v1_router);

module.exports = api_router;