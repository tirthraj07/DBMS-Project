const express = require('express');
const app = express();
const cookieParser = require('cookie-parser');
const cors = require('cors');
const xss = require('xss-clean');
require('dotenv').config();


const { query } = require('./configuration/database')
const PORT = process.env.PORT;

const api_router = require("./routes/api");
const auth_router = require("./routes/auth")

app.set('json spaces', 2)
app.use(cors());
app.options('*', cors());
app.use(express.urlencoded({extended:true}))
app.use(express.json())
app.use(cookieParser());
app.use(xss());

app.use('/api', api_router);
app.use('/auth', auth_router);


app.listen(PORT, ()=>{
    console.log(`Server listening on http://localhost:${PORT}`);
})