import { executeQuery } from "./DatabaseController"

export interface IItem {
    item_id?: number
    item_name: string,
    item_type: string,
    item_desc?: string,
    item_attrib?: string,
    damage?: string,
    armor_value?: number | null,
    effect?: string,
    item_price: number,
    large_item: boolean,
    artifact?: boolean,
    artifact_owner: number | null
}


export const getAllItems = async (artifact: string, priceAscending: string, type: string) => {
    try {
        let params = [String(artifact)]
        let query = "SELECT * FROM Item WHERE artifact = ($1)"
        if (type !== "") {
            query += " AND item_type = ($2)"
            params = params.concat(type.toLocaleLowerCase())
        }
        if (priceAscending === "ASC"){
            query += " ORDER BY item_price ASC"
        } else if (priceAscending === "DESC") {
            query += " ORDER BY item_price DESC"
        }
        const result = await executeQuery(query, params)
 
        console.log("result:" ,result.rows)
        return result.rows as Array<IItem>
    } catch (error) {
        throw new Error("Error whle fetching items")
    }
}

export const getSingleItems = async (item_id: number) => {
    try {
        const params = [item_id]
        const query = "SELECT * FROM Item WHERE item_id = $1"
        const result = await executeQuery(query, params)
        return result.rows[0]
    } catch (_) {
        throw new Error("Error while fetching item")
    }
}
// Create item
export const createItem = async (item: IItem) => {
    try {
        const { item_name, item_type, item_desc, item_attrib, damage, armor_value, effect, item_price, large_item, artifact, artifact_owner } = item
        const query = `
            INSERT INTO 
                item (
                    item_name,
                    item_type,
                    item_desc,
                    item_attrib,
                    damage,
                    armor_value,
                    effect,
                    item_price,
                    large_item,
                    artifact,artifact_owner
                ) 
                VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11 ) 
            RETURNING *;`
        const params = [ item_name, item_type, item_desc, item_attrib, damage, armor_value, effect, item_price, large_item, artifact, artifact_owner] 
        // TODO: fix this ts error
        const result = await executeQuery(query, params)
        return result.rows[0] as IItem
    } catch (error) {
        throw new Error("Error while creating Item")
    }
}

export const updateItem = async (item: IItem) => {
    try {
        const { item_id, item_name, item_type, item_desc, item_attrib, damage, armor_value, effect, item_price, large_item, artifact, artifact_owner } = item
        const query = `
            UPDATE Item SET
                item_name = ($1), 
                item_type = ($2), 
                item_desc = ($3), 
                item_attrib = ($4), 
                damage = ($5), 
                armor_value = ($6), 
                effect = ($7), 
                item_price = ($8), 
                large_item = ($9), 
                artifact = ($10), 
                artifact_owner = ($11)
            WHERE item_id = ($12)
            RETURNING *;`
        const params = [ item_name, item_type, item_desc, item_attrib, damage, armor_value, effect, item_price, large_item, artifact, artifact_owner, item_id ] 
        // TODO: fix this ts error
        console.log()
        const result = await executeQuery(query, params)
        console.log( result.rows)
        return result.rows[0] as IItem
    } catch (error) {
        throw new Error("Error while creating Item")
    }
}

export const updateCarriedItem = async (character_id: number, ids: Array<number>, uuid: string) => {
    const query = `
        INSERT INTO CarriedItem ( item_id, character_id )
        SELECT $1, $2
        WHERE EXISTS (
                SELECT ci.item_id, ci.character_id FROM CarriedItem ci
                    INNER JOIN Character c ON ci.character_id = c.character_id
                    INNER JOIN Warband w ON c.warband_id = w.warband_id
                WHERE ci.item_id = $1 
                AND ci.character_id = $2
                AND w.owner_uuid = $3
            )
        RETURNING *
    `
    for(let round = 0; round <= ids.length; round++){
        const params = [String(ids[round]), String(character_id), uuid]
        await executeQuery(query, params)
    }   
}

export const removeCarriedItem = async (character_id: number, item_id: number, uuid: string) => {
    try{
        const query = `
            DELETE FROM CarriedItem ci
            USING  Character c, Warband w
            WHERE ci.character_id = $1 
            AND ci.id = $2 
            AND w.owner_uuid = $3
            RETURNING * 
        `
        const params = [String(character_id), String(item_id), uuid]
        const result = await executeQuery(query, params)
        return result.rows[0]
    } catch (error) {
        throw new Error("Error while deleting carried item")
    }
    
}

// get all items - include parameter filtering for artifacts
// modigy item by id - include artifact ownership
// delete item by id

export const deleteItem =async (item_id: number) => {
    const query = `
        DELETE FROM Item WHERE item_id = ($1) RETURNING item_name `
    const params = [item_id]
    const result = await executeQuery(query, params)
    return result.rows[0]
}

