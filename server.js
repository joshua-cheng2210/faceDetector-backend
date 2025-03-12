// to run this on postman, insert this command
// - npm run start // not npm run dev. we need to use nodemon
import express from 'express'
import { v4 as uuidv4 } from 'uuid';
import bcrypt from 'bcrypt-nodejs'
import cors from 'cors'

const app = express()
const port = 3069
app.use(express.json())
app.use(cors({
    "origin" : "*"
}))

const database = {
    users: [
        {
            id: "1",
            name: "joshua",
            email: "chengjoshua22@gmail.com",
            password: "22102003",
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

// PW management functions
function hashingPw(pw){
    console.log("inside hashingPw()", pw)
    let h;
    bcrypt.hash(pw, null, null, function(err, hash) {
        // Store hash in your password DB.
        if (err){
            console.log(err)
            return ""
        }
        console.log("hash: ", hash)
        h = hash;
    });
    return h
}

function checkHashPw(entry, hash){
    return bcrypt.compare(entry, hash, function(err, res) {
        if (err){
            return false
        } 
        if (res){
            return true
        }
    });
}

// server utility functions
function isInDatabase(email, pw = ""){
    console.log("printing from isInDatabase", email, pw)
    const user = database.users.find((acc) => {
        console.log(acc.password)
        if (acc.email === email && pw === "") {
            return true
        } else bcrypt.compare(pw, acc.password, function(err, res) {
            if (err){
                return false
            } 
            if (res){
                return true
            }
        });
        // return (acc.email === email && checkHashPw(pw, acc.password)) === true || (acc.email === email && pw === "");
    });
    return user !== undefined;
}

function getUserByID(id){
    const user = database.users.find((acc) => {
        // console.log(acc)
        return acc.id === id
    });
    if (user) {
        // console.log(user);
        return user;
    }
    return null;
}

function initDB() {
    database.users.forEach((user) => {
        bcrypt.hash(user.password, null, null, function(err, res) {
            // Store hash in your password DB.
            if (err){
                console.log(err)
                user.password = ""
            }
            if (res){
                // console.log("res: ", user.password, "-->", res)
                user.password = res
            }
        })
    })
    // console.log(database.users)
}

// routings
app.get("/", (req, res) => {
    // res.send("home is working")
    res.json(database.users)
})

app.post("/signin", (req, res) => {
    console.log("req.body", req.body);
    if (req.body.email === "" || req.body.password === "") {
        return res.json("failed to login with appropriate info");
    }
    const user = database.users.find((acc) => acc.email === req.body.email);
    
    console.log("from signin: ", user)
    if (user) {
        bcrypt.compare(req.body.password, user.password, function(err, result) {
            if (err) {
                return res.status(500).json("Error comparing passwords");
            }
            if (result) {
                user["login"] = "success"
                const { password, ...userWithoutPassword } = user;
                return res.json(userWithoutPassword);
            } else {
                return res.status(400).json("login failed");
            }
        });
    } else {
        return res.json("login failed");
    }
});

app.post("/register", (req, res) => {
    console.log("req.body", req.body)
    if (req.body.email === "" || req.body.password === ""){
        return res.json("failed to register with appropriate info")
    }
    let found = isInDatabase(req.body.email);
    
    if (found) {
        return res.json("register failed. This Email has been registered with an account")
    } else {
        // async design
        bcrypt.hash(req.body.password, null, null, function(err, hash) {
            if (err) {
                return res.status(500).json("Error hashing password");
            }
            const newAcc = {
                id: uuidv4(),
                name: req.body.name || "defaultName_shyGuy69", // You can set a default name if not provided
                email: req.body.email,
                password: hash, // Store the hashed password
                entries: 0,
                joined: new Date()
            };
            database.users.push(newAcc);
            newAcc["register"] = "success"
            // console.log("database.users", database.users);
            
            const { password, ...userWithoutPassword } = newAcc;

            // Return the new user profile without the password
            return res.json(userWithoutPassword);
        });
        // sychronous method
        // const newAcc = {
        //     id: uuidv4(),
        //     name: req.body.name || "defaultName_shyGuy69", // You can set a default name if not provided
        //     email: req.body.email,
        //     password: hashingPw(req.body.password),
        //     entries: 0,
        //     joined: new Date()
        // };
        // database.users.push(newAcc);
        // console.log("database.users", database.users)
        // return res.json("register success");
    }
})

app.listen(port, () => {
    console.log("app is running on port", port)
    initDB()
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

app.put("/image", (req, res) => {
    // console.log("req.body", req.body)
    // console.log("req.param", req.params)
    const { id } = req.body
    // console.log("id: ", id, typeof(id))
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