import { executeQuery } from "./DatabaseController"

export interface IItem {
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
 
         
        return result.rows as Array<IItem>
    } catch (error) {
        throw new Error("Error whle fetching items")
    }
}

// Create item
export const createItem = async (item: IItem) => {
    try {
        const { item_name, item_type, item_desc, item_attrib, damage, armor_value, effect, item_price, large_item, artifact, artifact_owner } = item
        const query = "INSERT INTO item(item_name, item_type, item_desc, item_attrib, damage, armor_value, effect, item_price, large_item, artifact, artifact_owner) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11 ) RETURNING *;"
        const params = [ item_name, item_type, item_desc, item_attrib, damage, armor_value, effect, item_price, large_item, artifact, artifact_owner] 
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

// const itemQuery = `
//     INSERT INTO Item (item_name, item_type, item_desc, item_attrib, damage, armor_value, effect, item_price, large_item, artifact, artifact_owner) VALUES
//         ( ($1), ($2), ($3), ($4), ($5), ($6), ($7), ($8), ($9), ($10), ($11))
// )`
