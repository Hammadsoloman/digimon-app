DROP TABLE IF EXISTS digimon;

CREATE TABLE digimon(
    id SERIAL PRIMARY KEY,
    name VARCHAR(255),
    img VARCHAR(255),
    level VARCHAR(255)
)