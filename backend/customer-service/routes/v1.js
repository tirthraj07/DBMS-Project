const express = require('express');
const v1_router = express.Router();
const { query } = require('../configuration/database');
const Cryptography = require('../lib/crypto_utils')

v1_router.get('/customer', async (req, res) => {
    const userData = req.decodedToken;
    const customer_id = userData.customer_id;

    try {
        const customer = await query('SELECT * FROM public_customer_view WHERE customer_id = ?', [customer_id]);

        if (customer.length > 0) {
            res.json({ user: customer[0] });
        } else {
            res.status(404).json({ error: "Customer not found" });
        }
    } catch (error) {
        res.status(500).json({ error: "Database query failed" });
    }
});

v1_router.patch('/customer', async (req, res) => {
    const userData = req.decodedToken;
    const customer_id = userData.customer_id;
    
    const { customer_full_name, customer_email, customer_phone, customer_old_password, customer_new_password } = req.body;

    try {
        const cryptography = new Cryptography();
        
        if (customer_full_name || customer_email || customer_phone) {
            await query('UPDATE customers SET customer_full_name = IFNULL(?, customer_full_name), customer_email = IFNULL(?, customer_email), customer_phone = IFNULL(?, customer_phone) WHERE customer_id = ?', 
                        [customer_full_name, customer_email, customer_phone, customer_id]);
        }

        if (customer_new_password) {
            const dbResult = await query('SELECT customer_password FROM customers WHERE customer_id = ?', [customer_id]);
            const dbPassword = dbResult[0].customer_password;

            if (cryptography.verifyPassword(customer_old_password, dbPassword)) {
                const hashedPassword = cryptography.generateSaltHash(customer_new_password);

                await query('UPDATE customers SET customer_password = ? WHERE customer_id = ?', [hashedPassword, customer_id]);
            } else {
                return res.status(400).json({ error: "Old password is incorrect" });
            }
        }

        res.json({ success: "Profile updated successfully" });
    } catch (error) {
        res.status(500).json({ error: "Couldn't update profile" });
    }
});

v1_router.delete('/customer', async (req, res) => {
    const userData = req.decodedToken;
    const customer_id = userData.customer_id;

    try {
        // Delete the customer from the database
        const result = await query('DELETE FROM customers WHERE customer_id = ?', [customer_id]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: "Customer not found" });
        }

        // Log out the user by clearing the userToken cookie
        res.clearCookie('userToken', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production'
        });

        return res.json({ success: "Customer deleted and logged out successfully" });
    } catch (error) {
        return res.status(500).json({ error: "Failed to delete customer" });
    }
});

v1_router.get('/customer/bookings', async (req, res) => {
    const userData = req.decodedToken;
    const customer_id = userData.customer_id;

    try {
        const bookings = await query('SELECT * FROM booking_details WHERE customer_id = ?', [customer_id]);

        if (bookings.length > 0) {
            res.json({ bookings });
        } else {
            res.status(404).json({ bookings: [] });
        }
    } catch (error) {
        res.status(500).json({ error: "Database query failed" });
    }
});

v1_router.get('/customer/logs', async (req, res) => {
    const userData = req.decodedToken;
    const customer_id = userData.customer_id;

    try {
        const logs = await query('SELECT * FROM customer_logs WHERE customer_id = ?', [customer_id]);

        if (logs.length > 0) {
            res.json({ customer_logs: logs });
        } else {
            res.status(404).json({ error: "No logs found" });
        }
    } catch (error) {
        res.status(500).json({ error: "Database query failed" });
    }
});


module.exports = v1_router;
