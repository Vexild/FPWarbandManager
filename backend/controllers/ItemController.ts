
export interface IItem {
    item_name: string,
    item_type: string,
    item_desc?: string,
    item_attrib?: string,
    damage?: string,
    armor_value?: number,
    effect?: string,
    price: number,
    large_item: boolean
}
// Create item
// get all items - include parameter filtering for artifacts
// modigy item by id - include artifact ownership
// delete item by id

// const itemQuery = `
//     INSERT INTO Item (item_name, item_type, item_desc, item_attrib, damage, armor_value, effect, item_price, large_item, artifact, artifact_owner) VALUES
//         ( ($1), ($2), ($3), ($4), ($5), ($6), ($7), ($8), ($9), ($10), ($11))
// )`
