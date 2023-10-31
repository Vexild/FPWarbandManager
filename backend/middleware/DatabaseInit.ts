import { executeQuery } from "../controllers/DatabaseController"

export const InitializeDatabase = async () =>{
    console.log("Creating database tables")
    const query =`
    CREATE TABLE IF NOT EXIST user (
        id serial PRIMARY KEY,
        userName VARCHAR (50) NOT NULL,
        userPassword VARCHAR (80) NOT NULL,
        email VARCHAR (255) UNIQUE NOT NULL,
        created TIMESTAMP NOT NULL;
        )`
    console.log("Database Initialization")
    console.log(query)

    await executeQuery(query)

}