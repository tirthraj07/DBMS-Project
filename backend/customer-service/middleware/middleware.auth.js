const JSON_WEB_TOKEN = require('../lib/jwt_utils')

const authenticationMiddleware = async(req,res,next) => {
    if(!req.cookies.userToken){
        console.log("userToken does not exist")
        return res.status(400).send({error:"user Token does not exists"})
    }
    const validator = new JSON_WEB_TOKEN();

    const validateJWT = validator.validateUserToken(req.cookies.userToken)
    if(!validateJWT['valid']){
        console.log("Invalid JWT");
        return res.status(400).send({error:validateJWT['reason']})
    }

    req.decodedToken = validateJWT['decodedToken'];

    next();
}

module.exports = authenticationMiddleware