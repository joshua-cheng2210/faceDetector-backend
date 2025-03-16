// to run this on postman, insert this command
// - npm run start // not npm run dev. we need to use nodemon
import express from 'express'
import bcrypt from 'bcrypt-nodejs'
import cors from 'cors'
import knex from 'knex'
import bodyParser from 'body-parser';

import { handleSignIn, handleRegister } from './controllers/logIns.js'
import { getProfile, updateUserRank, getoutput } from './controllers/appUtilities.js'

const db = knex({
    client: 'pg',
    connection: {
      host: '127.0.0.1',
      user: 'postgres',
      port: 5432,
      password: '@Jchs22102003',
      database: 'faceDetector',
    },
});
db.migrate.latest();

const app = express()
const port = 3069
app.use(express.json())
app.use(cors({
    // "origin" : "http://localhost:5173"
    "origin" : "*"
}))
app.use(bodyParser.json());

// routings
app.post("/signin", (req, res) => {return handleSignIn(req, res, db, bcrypt)});

app.post("/register", (req, res) => {return handleRegister(req, res, db, bcrypt)})

app.listen(port, () => {console.log("app is running on port", port)})

app.get("/profile/:id", (req, res) => {return getProfile(req, res, db)})

app.put("/image", (req, res) => {return updateUserRank(req, res, db)})

app.post("/promptingClarifai", (req, res) => {return getoutput(req, res)})