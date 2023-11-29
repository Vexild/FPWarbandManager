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
        console.log("ASDASDASD")
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
        const query = "INSERT INTO item(item_name, item_type, item_desc, item_attrib, damage, armor_value, effect, item_price, large_item, artifact, artifact_owner) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11 ) RETURNING *;"
        const params = [ item_name, item_type, item_desc, item_attrib, damage, armor_value, effect, item_price, large_item, artifact, artifact_owner] 
        // TODO: fix this ts error
        const result = await executeQuery(query, params)
        console.log( result.rows)
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

// const itemQuery = `
//     INSERT INTO Item (item_name, item_type, item_desc, item_attrib, damage, armor_value, effect, item_price, large_item, artifact, artifact_owner) VALUES
//         ( ($1), ($2), ($3), ($4), ($5), ($6), ($7), ($8), ($9), ($10), ($11))
// )`
