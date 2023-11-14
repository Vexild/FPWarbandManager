/* eslint-disable @typescript-eslint/no-explicit-any */
import pg from "pg"
import "dotenv/config"

const {PG_HOST, PG_PORT, PG_USERNAME, PG_PASSWORD, PG_DATABASE} = process.env;

console.log(PG_HOST, PG_PORT, PG_USERNAME, PG_PASSWORD, PG_DATABASE)

const pool = new pg.Pool({
    host: PG_HOST,
    port: Number(PG_PORT),
    user: PG_USERNAME,
    password: String(PG_PASSWORD),
    database: PG_DATABASE,
});
  
  

export const executeQuery = async (query: string, params: string[] = []) => {
    const client = await pool.connect();
    try {
        const result = await client.query(query, params);
        return result
    } catch (error: any){
        console.error("Error: ",error.stack)
        error.name = "dberror"
        throw error
    } finally {
        client.release();
    }
}
