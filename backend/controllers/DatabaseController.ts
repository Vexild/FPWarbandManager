import pg from "pg"
import "dotenv/config"

const {PG_HOST, PG_PORT, PG_USERNAME, PG_PASSWORD, PG_DATABASE} = process.env

console.log(PG_HOST, PG_PORT, PG_USERNAME, PG_PASSWORD, PG_DATABASE)
const pool = new pg.Pool({
    host: PG_HOST,
    port: Number(PG_PORT),
    user: PG_USERNAME,
    password: PG_PASSWORD,
    database: PG_DATABASE   
})

export const executeQuery = async (query: string, params: string[] = []) => {
    const client = await pool.connect()
    try {
        const res = await client.query(query, params)
        return res
    } catch (error){
        console.error("Error: ",error)
        throw error
    } finally {
        client.release()
    }
}
