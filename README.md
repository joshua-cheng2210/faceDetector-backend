# sql tables
CREATE TABLE login (
    id SERIAL PRIMARY KEY,
    hash VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE
);
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    entries BIGINT DEFAULT 0,
    joined TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

# for future developments deployments:
- docker build -t facedetector-backend .
- docker tag facedetector-backend:latest joshua2210/facedetector-backend:latest
- docker push joshua2210/facedetector-backend:latest
- or do this one liner command:
```bash
docker build -t facedetector-backend .  ;docker tag facedetector-backend:latest joshua2210/facedetector-backend:latest;docker push joshua2210/facedetector-backend:latest;
```
- go to https://dashboard.render.com/web/srv-d0mcv70gjchc738eb1s0/deploys/dep-d0mj8hbuibrs73eojftg
- click Manual deploy >> deploy latest reference

# learnings
- building the backend to connect from the frontend through server.js
- connecting to the DB set up through render.com from the server.js and respond to the frontend
- server.js
    - receiving and responging http requests through (req, res) => {} 
    - using postman to test the backend connection for development process
- database
    - using pgAdmin to manage the DB
    - using knex for DB migrations (for interacting with the DB)
    - using bcrypt for hashing passwords
    - using cors to allow cross-origin requests from the frontend
    - using express to set up the server and handle routing
- hosting through render.com
    - setting up the backend hosting
        - through creating a docker image for scalaility
        - using render's environmental variables to set up the DB connection. and using process.env to access the environmental variables in my server.js
    - setting up the DB hosting
        - using knex for DB migrations (for interacting with the DB)
        - using pgAdmin for DB management UI or visualizing the DB
- Docker
    - building and image 
    - pushing the image to docker hub repo
    - figuring out the individual ports needed for the frontend docker, frontend docker hosting, backend docker, backend DB