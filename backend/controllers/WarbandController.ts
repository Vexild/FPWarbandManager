import { executeQuery } from "./DatabaseController"

interface IItem {
    id: number,
    item_name: string,
    item_type: string,
    item_attrib: string,
    damage?: string,
    armor_value?: string,
    effect?: string,
    price?: number
}

interface ICharacter {
    character_name: string,
    hp: number,
    armor: number
    str: string,
    agi: string,
    pre: string,
    tou: string,
    eqslots: number,
    equipment: Array<IItem>
}

interface IWarband {
    id: number
    warband_name: string,
	warband_resources: number,
    public: boolean,
	owner_id?: string,
	warband_stash: Array<IItem>,
    warband_characters: Array<ICharacter>
}

export const createWarband = async (warband: IWarband, uuid: string) => {    
    try {
        console.log("Warband: ",warband)
        const query = "INSERT INTO Warband (warband_name, public, resources, owner_id, owner_uuid) VALUES (($1), ($2), ($3), ($4), ($5)) ON CONFLICT DO NOTHING RETURNING *"
        console.log( [ warband.warband_name, String(warband.public), String(warband.warband_resources), warband.owner_id, uuid ] )
        const result = await executeQuery(query, [ warband.warband_name, String(warband.public), String(warband.warband_resources), String(warband.owner_id), String(uuid) ])
        console.log("Res_",result.rows)
        return result.rows[0]
    } catch { () => {
        throw new Error("Error during adding new Warband")
    }}
}

export const getPublicWarbands = async () => {
    try {
        const query = "SELECT w.warband_id, w.warband_name, u.user_name AS owner_name, w.resources FROM Warband w JOIN Users u ON w.owner_id = u.user_id"
        const result = await executeQuery(query)
        return result.rows
    } catch { () => {
        throw new Error("Error during fetching public")
    }}
}

export const getWarbandById = async (id: number) => {
    try {
        const query = "SELECT * from Warband WHERE warband_id = ($1) AND public = true" 
        // we need a second query since we need 1 data from Warband table and up to 5 from character table
        const result = await executeQuery(query, [String(id)])
        return result.rows
            
    } catch { () => {
        throw new Error(`Error while fetching warband with id ${id}`)
    }}
}

export const modifyWarband = async (warband: IWarband, uuid: string) => {
    try {
        console.log("MOD")
        console.log([warband.warband_name, String(warband.public), String(warband.warband_resources), String(uuid), String(warband.id)])
        const query = "UPDATE Warband SET warband_name = ($1), public = ($2), resources = ($3) WHERE owner_uuid = ($4) AND warband_id = ($5) RETURNING *"
        const result = await executeQuery(query, [warband.warband_name, String(warband.public), String(warband.warband_resources), String(uuid), String(warband.id)])
        // TODO: Update doesnt work. There needs to be a check for right warband AND correct uuid
        return result.rows
    } catch { () => {
        throw new Error("Error during warband update")
    }}   
}

export const deleteWarband = async (warband_id: string, user_uuid: string) => { 
    try {
        const query = `
            DELETE FROM Warband WHERE warband_id = ($1) AND owner_uuid = ($2) RETURNING warband_name`
        const result = await executeQuery(query, [warband_id, user_uuid])
        return result.rows
    } catch { () => {
        throw new Error("Error during warband delete")
    }}
}
