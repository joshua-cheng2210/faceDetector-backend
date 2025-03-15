// to run this on postman, insert this command
// - npm run start // not npm run dev. we need to use nodemon
import express from 'express'
import bcrypt from 'bcrypt-nodejs'
import cors from 'cors'
import knex from 'knex'
import bodyParser from 'body-parser';

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
            }).catch(() => {res.status(400).json("unable to register")})
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
    }).catch(() => {res.status(400).json("unable to get profile")})

})

app.put("/image", (req, res) => {
    const { id } = req.body
    db("users").where({
        id: id
    }).increment("entries", 1).returning("entries").then(data => {
        // console.log(data)
        return res.json(data[0])
    }).catch(() => {
        return res.json("failed to update rank")
    })
})

// planning for the routes
// - /SignIn --> POST: as you're sending sensitive info; post = success // fail -- done
// - /AccountRegistration --> POST: new user -- done
// - /HomeApp --> 
// - /?profile/:userId --> GET = user -- done
// - /image --> PUT: 

// trying to use the API

const PAT = '1165295fdb9c481aacbfc38c59efc702';
const USER_ID = 'chen7647';
const APP_ID = 'my-first-application-ddxi3q';
const MODEL_ID = 'face-detection';
const MODEL_VERSION_ID = '6dc7e46bc9124c5c8824be4822abe105';

const getClarifyRequest = ((imageURL) => {
    const raw = JSON.stringify({
      "user_app_id": {
        "user_id": USER_ID,
          "app_id": APP_ID
        },
      "inputs": [
        {
          "data": {
            "image": {
              "url": imageURL
            }
          }
        }
      ]
    });
    // console.log("body: ", JSON.parse(raw))
  
    const requestOptions = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            // 'Accept': 'application/json',
            'Authorization': 'Key ' + PAT,
            // 'Access-Control-Allow-Origin' : "*",
            // "origin" : "*"
        },
        body: raw
    };
  
    return requestOptions
})

app.post("/promptingClarifai", (req, res) => {
    // https://www.shutterstock.com/image-photo/happy-businessman-enjoying-home-office-600nw-2257033579.jpg
    console.log("req.body: ", req.body)
    const { imgURL } = req.body

    const requestOptions = getClarifyRequest(imgURL);
    const url = "https://api.clarifai.com/v2/models/" + MODEL_ID + "/versions/" + MODEL_VERSION_ID  + "/outputs";

    fetch(url, requestOptions)
    .then((response) => {
        console.log("response: ", response)
        return response.json()
    }).then(data => {
        // console.log("\n\n------------------------\n\n")
        // console.log("data: ", data);
        console.log("data.status.code: ", data.status.code);
        // console.log("\n\ndata.outputs[0].regions: ", data.outputs[0].data.regions);
        // console.log("\n\ndata.outputs[0].regions.region_info: ", data.outputs[0].data.regions[0].region_info);
        // console.log("\n\ndata.outputs[0].regions.data: ", data.outputs[0].data.regions[0].data);
        
        res.status(200).json(data);
    }).catch(error => {
        // console.log("\n\n---------------there is an error----------\n\n")
        console.log('error', error)
        return res.status(500).json(error)
    });

    
    // .then(result => {
    //   console.log("result:", result)
    // //   this.getBoundingBoxes(result.outputs[0].data.regions);
    // //   this.updateNumEntries()
    // })

    // try {
    //     const response = await fetch(url, requestOptions);
    //     const data = await response.json();
    //     console.log("data: ", data)
    //     console.log("\n\ndata.outputs[0]: ", data.outputs[0].data.regions)
    //     res.json(data); // Send the Clarifai API response back to the frontend
    // } catch (error) {
    //     console.error('Error communicating with Clarifai API:', error);
    //     res.status(500).json({ error: 'Failed to fetch data from Clarifai API' });
    // }
})