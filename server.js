// to run this on postman, insert this command
// - npm run start // not npm run dev. we need to use nodemon
import express from 'express'
import { v4 as uuidv4 } from 'uuid';
import bcrypt from 'bcrypt-nodejs'
import cors from 'cors'
import knex from 'knex'

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
    "origin" : "*"
}))

// routings
app.post("/signin", (req, res) => {
    console.log("req.body", req.body);
    const {email, password} = req.body
    if (req.body.email === "" || req.body.password === "") {
        return res.json("failed to login with appropriate info");
    }
    
    db.select("email", "hash").from("login").where(
        "email", "=", email
    ).then(data => {
        console.log(data)
        const isValid = bcrypt.compareSync(password, data[0].hash)
        if (isValid){
            db.select("*").from("users").where("email", "=", email).then(user => {
                return res.json(user[0])
            }).catch(() => {
                return res.status(400).json("login failed")
            })
        } else{
            return res.status(400).json("login failed")
        }
    }).catch(() => {
        return res.status(400).json("login failed")
    })
});

app.post("/register", (req, res) => {
    console.log("/register --> req.body", req.body)
    const {email, name, password} = req.body
    if (req.body.email === "" || req.body.password === ""){
        return res.json("unable to register")
    }

    const hash = bcrypt.hashSync(password)
    db.transaction(trx => {
        trx.insert({
            hash: hash,
            email: email
        }).into("login").returning("email").then(loginEmail => {
            trx("users").returning('*').insert({
                email: loginEmail[0].email,
                name: name,
                joined: new Date()
            }).then(response => {
                return res.json(response[0])
            }).catch(_ => res.status(400).json("unable to register"))
        }).then(trx.commit).catch(() => {
            trx.rollback
            return res.status(400).json("unable to register")
        })
    })
})

app.listen(port, () => {
    console.log("app is running on port", port)
})

app.get("/profile/:id", (req, res) => {
    // console.log("req.body", req.body)
    console.log("req.param", req.params)
    const { id } = req.params
    db.select("*").from("users").where({
        id: id
    }).then(response => {
        console.log("printing get users: ", response, "response.length: ", response.length)
        if (response.length != 1){
            return res.status(400).json("unable to get profile")
        }
        return res.json(response)
    }).catch(_ => res.status(400).json("unable to get profile"))

    // const acc = getUserByID(id)
    // // console.log("acc in the listening", acc)
    // if (acc){
    //     return res.json(acc)
    // } else {
    //     return res.status(404).json("no such user")
    // }
    // res.json(acc)
})

app.put("/image", (req, res) => {
    // console.log("req.body", req.body)
    // console.log("req.param", req.params)
    const { id } = req.body
    // console.log("id: ", id, typeof(id))
    db("users").where({
        id: id
    }).increment("entries", 1).returning("entries").then(data => {
        // console.log(data)
        return res.json(data[0])
    }).catch(err => {
        return res.json("failed to update rank")
    })
    
    // .then(response => {
    //     console.log("printing get users: ", response, "response.length: ", response.length)
    //     if (!response.length){
    //         return res.status(400).json("unable to get profile")
    //     }
    //     return res.json(response)
    // }).catch(_ => res.status(400).json("unable to get profile"))
    // const acc = getUserByID(id)


    // console.log("acc in the listening", acc)
    // if (acc){
    //     acc.entries += 1
    //     return res.json(acc.entries)
    // } else {
    //     return res.status(404).json("no such user")
    // }
    // res.json(acc)
})

// planning for the routes
// - /SignIn --> POST: as you're sending sensitive info; post = success // fail -- done
// - /AccountRegistration --> POST: new user -- done
// - /HomeApp --> 
// - /?profile/:userId --> GET = user -- done
// - /image --> PUT: 