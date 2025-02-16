import express from 'express'
import { v4 as uuidv4 } from 'uuid';

const app = express()
const port = 3002
app.use(express.json())

const database = {
    users: [
        {
            id: "1",
            name: "joshua",
            email: "chengjoshua22@gmail.com",
            password: "ayeaye",
            entries: 0,
            joined: new Date()
        },
        {
            id: uuidv4(),
            name: "joshua2",
            email: "joshuacheng@gmail.com",
            password: "joshua",
            entries: 0,
            joined: new Date()
        },
        {
            id: uuidv4(),
            name: "joshua3",
            email: "joshua2210@gmail.com",
            password: "ritz",
            entries: 0,
            joined: new Date()
        },
        {
            id: uuidv4(),
            name: "joshua4",
            email: "gnehcauhsoj@gmail.com",
            password: "reallymissritzsfm",
            entries: 0,
            joined: new Date()
        }
    ]
}

function isInDatabase(email, pw = ""){
    database.users.some((acc) => {
        if ((acc.email === email && acc.password === pw) || (acc.email === email && pw === "")) {
            // console.log("info matched", acc)
            return true
        }
    })
    return false
}

function isInDatabaseByID(id){
    database.users.some((acc) => {
        if (acc.id === id) {
            return true
        }
    })
    return false
}

function getUserByID(id){
    const user = database.users.find((acc) => acc.id === id);
    if (user) {
        // console.log(user);
        return user;
    }
    return null;
}

app.get("/", (req, res) => {
    // res.send("home is working")
    res.json(database.users)
})

app.post("/signin", (req, res) => {
    // res.send("loading the signing in page")
    console.log("req.body", req.body)
    // res.json("loading the signing in page")
    if (req.body.email === "" || req.body.password === ""){
        return res.json("failed to login with appropriate info")
    }
    let found = isInDatabase(req.body.email, req.body.password)
    // database.users.forEach((acc) => {
    //     if (acc.email === req.body.email && acc.password === req.body.password
    //     ) {
    //         console.log("info matched", acc)
    //         found = true
    //         return res.json("login sucess")
    //     }
    // })
    if (found) {
        return res.json("login sucess")
    } else {
        return res.json("login failed");
    }
})

app.post("/register", (req, res) => {
    console.log("req.body", req.body)
    if (req.body.email === "" || req.body.password === ""){
        return res.json("failed to register with appropriate info")
    }
    let found = isInDatabase(req.body.email);
    // database.users.forEach((acc) => {
    //     if (acc.email === req.body.email) {
    //         console.log("this email has been used", acc.email)
    //         found = true
    //         return res.json("register failed")
    //     }
    // })
    if (found) {
        return res.json("register failed. This Email has been registered with an account")
    } else {
        const newAcc = {
            id: uuidv4(),
            name: req.body.name || "defaultName_shyGuy69", // You can set a default name if not provided
            email: req.body.email,
            password: req.body.password,
            entries: 0,
            joined: new Date()
        };
        database.users.push(newAcc);
        console.log("database.users", database.users)
        return res.json("register success");
    }
})

app.listen(3002, () => {
    console.log("app is running on port", port)
})

app.get("/profile/:id", (req, res) => {
    // console.log("req.body", req.body)
    console.log("req.param", req.params)
    const { id } = req.params
    const acc = getUserByID(id)
    // console.log("acc in the listening", acc)
    if (acc){
        return res.json(acc)
    } else {
        return res.status(404).json("no such user")
    }
    // res.json(acc)
})

app.post("/image", (req, res) => {
    // console.log("req.body", req.body)
    // console.log("req.param", req.params)
    const { id } = req.params
    const acc = getUserByID(id)
    // console.log("acc in the listening", acc)
    if (acc){
        acc.entries += 1
        return res.json(acc.entries)
    } else {
        return res.status(404).json("no such user")
    }
    // res.json(acc)
})

// planning for the routes
// - /SignIn --> POST: as you're sending sensitive info; post = success // fail -- done
// - /AccountRegistration --> POST: new user -- done
// - /HomeApp --> 
// - /?profile/:userId --> GET = user -- done
// - /image --> PUT: 