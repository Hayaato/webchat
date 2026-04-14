CREATE TABLE IF NOT EXISTS users (
                                     id SERIAL PRIMARY KEY,
                                     login VARCHAR(50) UNIQUE NOT NULL,
                                     password TEXT NOT NULL
);