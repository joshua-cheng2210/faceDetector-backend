
export const handleSignIn = (req, res, db, bcrypt) => {
    // console.log("req.body", req.body);
    const {email, password} = req.body
    if (req.body.email === "" || req.body.password === "") {
        return res.json("failed to login with appropriate info");
    }
    
    db.select("email", "hash").from("login").where(
        "email", "=", email
    ).then(data => {
        // console.log(data)
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
}


export const handleRegister = (req, res, db, bcrypt) => {
    // console.log("/register --> req.body", req.body)
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
}