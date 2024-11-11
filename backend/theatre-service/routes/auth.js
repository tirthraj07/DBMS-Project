const express = require('express');
const auth_router = express.Router();
const Cryptography = require('../lib/crypto_utils')
const JSON_WEB_TOKEN = require('../lib/jwt_utils')
const { query } = require('../configuration/database')

auth_router.post('/login', async (req, res) => {
    const { theatre_user_email, theatre_user_password } = req.body;

    try {
        const [user] = await query('SELECT * FROM theatre_users WHERE theatre_user_email = ?', [theatre_user_email]);
        
        if (!user) {
            return res.status(404).json({ "error": "User not found" });
        }

        const dbPassword = user.theatre_user_password;

        const cryptography = new Cryptography()

        const isPasswordCorrect = cryptography.verifyPassword(theatre_user_password, dbPassword);

        if (isPasswordCorrect) {
            const jwt = new JSON_WEB_TOKEN();
            
            const jwt_payload = {
                theatre_user_id: user.theatre_user_id,
                theatre_user_email: user.theatre_user_email,
                theatre_id:user.theatre_id
            }

            const token = jwt.createToken(jwt_payload)

            res.cookie('userToken', token, {
                httpOnly: true,      
                secure: process.env.NODE_ENV === 'production', 
                maxAge: 7 * 24 * 60 * 60 * 1000 
            });

            res.json({ "success": "Login successful", theatre_user:jwt_payload });
        } else {
            res.status(401).json({ "error": "Invalid password" });
        }
    } catch (err) {
        // Handle database or other errors
        res.status(500).json({ "error": err.message });
    }
});


module.exports = auth_router;