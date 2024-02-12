import { executeQuery } from "./DatabaseController"
import { IItem } from "./ItemController"

// Add item
export const getStashedItems = async (warband_id: string) => {
    try {
        const query = `
            SELECT * FROM item AS i
            JOIN Stash AS s ON i.item_id = s.item_id
            JOIN Warband AS w ON w.warband_id = s.warband_id
            AND w.warband_id = ($1)
            `
        // const query = `
        //     SELECT * FROM item AS i
        //     JOIN Stash AS s ON i.item_id = s.item_id
        //     JOIN Warband AS w ON w.warband_id = s.warband_id
        //     AND w.warband_id = ($1)
        //     AND w.owner_uuid = ($2)    
        //     `
        const params = [ warband_id] 
        const result = await executeQuery(query, params)
        console.log(result)    
        return result.rows

    } catch (error) {
        throw new Error("Error while getting items from stash")
    }
}

// Add item
export const addStashedItem = async (warband_id: number, item_ids: Array<number>, uuid: string) => {
    try {
        const added_items = await Promise.all(item_ids.map( async (item) => {
            const query = `
                INSERT INTO Stash (item_id, warband_id) 
                SELECT $1, $2
                WHERE EXISTS (
                    SELECT item_id FROM Item
                    WHERE item_id = ($1)
                )  
                AND EXISTS (
                    SELECT warband_id FROM Warband
                    WHERE warband_id = ($2)
                    AND owner_uuid = ($3)
                )
                ON CONFLICT DO NOTHING
                RETURNING item_id`
            const params = [ String(item), String(warband_id), uuid] 
            console.log(params)
            const result = await executeQuery(query, params)       
            return result.rows[0]
        }))
        let result = added_items.filter( i=> typeof(i) !== "undefined")
        result = result.map((i) =>  Object.values(i)).map((i) =>  i[0])
        return result
    } catch (error) {
        throw new Error("Error while adding item to stash")
    }
}

// Remove item
export const removeStashedItem = async (warband_id: number, stashed_item_index_ids: Array<number>, uuid: string) => {
    try {
        const removed_items = await Promise.all(stashed_item_index_ids.map( async (stash_id) => {
            const query = `
                DELETE FROM Stash 
                WHERE stash_index_id = $1 
                AND warband_id = $2 
                AND EXISTS (
                    SELECT warband_id FROM Warband
                    WHERE warband_id = $2
                    AND owner_uuid = ($3)
                )

                RETURNING stash_index_id`
            const params = [ String(stash_id), String(warband_id), uuid]
            const result = await executeQuery(query, params)
            return result.rows[0]
        }))
        let result = removed_items.filter( i=> typeof(i) !== "undefined")
        result = result.map((i) =>  Object.values(i)).map((i) =>  i[0])
        return result
    } catch (error) {
        throw new Error("Error while removing item from stash")
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
