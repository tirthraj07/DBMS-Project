const express = require('express');
const auth_router = express.Router();
const Cryptography = require('../lib/crypto_utils')
const JSON_WEB_TOKEN = require('../lib/jwt_utils')
const { query } = require('../configuration/database')

auth_router.post('/signup', async(req, res)=>{
    const { customer_full_name, customer_email, customer_password, customer_phone } = req.body;

    try{
        if(!customer_full_name || !customer_email || !customer_password || !customer_phone){
            return res.status(400).json({error: "Insufficient Payload"})
        }

        const cryptography = new Cryptography()
        const hashedPassword = cryptography.generateSaltHash(customer_password)

        const result = await query("INSERT INTO customers (customer_full_name,customer_email,customer_password,customer_phone) VALUES (?,?,?,?)",[customer_full_name,customer_email,hashedPassword,customer_phone])

        const newUser = await query('SELECT customer_id, customer_email FROM customers WHERE customer_id = ?', 
            [result.insertId]);

        const jwt = new JSON_WEB_TOKEN();
        
        const jwt_payload = {
            customer_id: newUser[0].customer_id,  // newUser is an array, use newUser[0]
            customer_email: newUser[0].customer_email
        };

        const token = jwt.createToken(jwt_payload)

        res.cookie('userToken', token, {
            httpOnly: true,      
            secure: process.env.NODE_ENV === 'production', 
            maxAge: 7 * 24 * 60 * 60 * 1000 
        });

        return res.json({ "success": "Signup successful" });
    }
    catch(error){
        res.status(500).json({ "error": error.message });
    }

})

auth_router.post('/login', async(req,res)=>{
    const { customer_email, customer_password } = req.body

    try{

        if(!customer_email || !customer_password) {
            res.status(401).json({error: "Insufficient Payload"});
        }

        const [ user ] = await query("SELECT customer_id, customer_password FROM customers WHERE customer_email = ?",[customer_email])

        if(!user){
            res.status(404).json({ error: "User not found" });
        }

        const dbPassword = user.customer_password;

        const cryptography = new Cryptography()

        if(!cryptography.verifyPassword(customer_password, dbPassword)){
            res.send(401).json({error:"Incorrect Password"})
        }

        const jwt = new JSON_WEB_TOKEN();
        
        const jwt_payload = {
            customer_id: user.customer_id,
            customer_email: customer_email
        }

        const token = jwt.createToken(jwt_payload)

        res.cookie('userToken', token, {
            httpOnly: true,      
            secure: process.env.NODE_ENV === 'production', 
            maxAge: 7 * 24 * 60 * 60 * 1000 
        });

        res.json({ "success": "Login successful" });

    }

    catch(error){
        res.status(500).json({error: error.message });
    }

})

auth_router.post('/logout', async (req, res) => {
    try {
        // Clear the userToken cookie
        res.clearCookie('userToken', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production'
        });

        return res.json({ "success": "Logout successful" });
    } catch (error) {
        return res.status(500).json({ "error": "Failed to logout" });
    }
});

module.exports = auth_router;