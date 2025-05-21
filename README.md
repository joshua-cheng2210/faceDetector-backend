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
