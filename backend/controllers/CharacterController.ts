import { executeQuery } from "./DatabaseController"

export interface ICharacter {
    character_id?: number,
    character_name: string,
    hp: number,
    armor_tier: number,
    str: string,
    agi: string,
    pre: string,
    tou: string,
    eq_slots: number,
}
// create Character. This creates from 1 to 5 characters to single warband
export const createCharacter = async (warband_id: number, uuid: string, characters: Array<ICharacter> ) => {    
    console.log("Character meta data: ",warband_id, uuid, characters)
    const warbandSize: number = await getWarbandSizeById(warband_id)
    console.log(warbandSize)
    console.log("characters.length:" ,characters.length)
    if (warbandSize+characters.length > 5){
        console.log(warbandSize)
        switch (warbandSize) {
        case 5:
            throw new Error("Inserting too many characters to Warband. No places left")
        default:
            throw new Error(`Inserting too many characters to Warband. ${5-warbandSize} places left`)
        }
    } else {
        const query = `
        INSERT INTO Character (character_name, hp, armor_tier, str, agi, pre, tou, eq_slots, warband_id) 
        VALUES (($1), ($2), ($3), ($4), ($5), ($6), ($7), ($8), ($9))
        `
        characters.forEach( async (char) =>  {
            const character_parameters = Object.values(char)
            character_parameters.push(warband_id)
            console.log("character_parameters", character_parameters)
            await executeQuery(query, character_parameters)
        })
    }
}


// get character by userID
export const getAllCharacters = async () => { // we want to add here optional parameters: "warband id", "character_id" and "user id". Also change name to "getCharacters"
    const query = `
        SELECT character_id, character_name, hp, armor_tier, str, agi, pre, tou, eq_slots, c.warband_id, w.warband_name FROM Character c JOIN Warband w ON c.warband_id = w.warband_id WHERE w.public = True`
    const result = await executeQuery(query) 
    const fromatted_result = result.rows.map(row => {
        const { character_name, hp, armor_tier, str, agi, pre, tou, eq_slots, warband_id, warband_name } = row;
        const entry = {
            name: character_name,
            hp: hp,
            armor_tier: armor_tier,
            attributes: {
                str: str,
                agi: agi,
                pre: pre,
                tou: tou
            },
            eq_slots: eq_slots,
            warband: {
                warband_id: warband_id,
                warband_name: warband_name
            } 
        }
        return entry
    });
    return fromatted_result
}

// get character by userID
export const getCharactersByWarband = async (warband_id: number, uuid: string) => { // we want to add here optional parameters: "warband id", "character_id" and "user id". Also change name to "getCharacters"
    const query = `
        SELECT character_id, character_name, hp, armor_tier, str, agi, pre, tou, eq_slots, w.warband_name FROM Character c JOIN Warband w ON c.warband_id = w.warband_id WHERE w.public = True AND w.warband_id = ($1) AND w.owner_uuid = ($2)`
    const params = [String(warband_id), uuid]
    const result = await executeQuery(query, params)
    if (result.rows.length === 0) {
        return 0
    }

    // NOw we need items for this warband
    const itemQuery = `
        SELECT * FROM Item i JOIN CarriedItem ci ON i.item_id = ci.item_id  WHERE ci.warband_id = ($1)
    `
    const items = await executeQuery(itemQuery, [String(warband_id)])
    console.log("Items of this warband: ",items.rows)
    const fromatted_result = {
        warband_id: warband_id,
        warband_name: result.rows[0].warband_name,
        warband_stash: [
            items.rows.filter((item) => item.warband_id == warband_id && item.character_id == null).map( (item) => {
                const formatted_item = {
                    item_name: item.item_name,
                    item_type: item.item_type,
                    item_desc: item.item_desc,
                    large_item: item.large_item,
                    item_attrib: item.item_attrib ? item.item_attrib : undefined,
                    artifact: item.artifact ? item.artifact : undefined,
                    damage: item.damage ? item.damage : undefined,
                    armor_value: item.armor_value ? item.armor_value : undefined,
                    effect: item.effect ? item.effect : undefined,
                    item_price: item.item_price ? item.item_price : undefined,
                }
                return formatted_item
            })
        ],
        members: 
            result.rows.map(row => {
                const { character_id, character_name, hp, armor_tier, str, agi, pre, tou, eq_slots } = row;
                console.log("Characeter ID: ",character_id)
                const entry = {
                    id: character_id,
                    name: character_name,
                    hp: hp,
                    armor_tier: armor_tier,
                    attributes: {
                        str: str,
                        agi: agi,
                        pre: pre,
                        tou: tou
                    },
                    eq_slots: eq_slots,
                    inventory: [ 
                        items.rows.filter((item) => item.character_id == character_id).map( (item) => {
                            const formatted_item = {
                                item_name: item.item_name,
                                item_type: item.item_type,
                                item_desc: item.item_desc,
                                large_item: item.large_item,
                                item_attrib: item.item_attrib ? item.item_attrib : undefined,
                                artifact: item.artifact ? item.artifact : undefined,
                                damage: item.damage ? item.damage : undefined,
                                armor_value: item.armor_value ? item.armor_value : undefined,
                                effect: item.effect ? item.effect : undefined,
                                item_price: item.item_price ? item.item_price : undefined,
                            }
                            return formatted_item
                        })
                        // firgure out how to access all of the properties of an Item
                    ], // we print here all items from CarriedItem table that share the character_id and warband_id AND those that are not stashed.
                }
                return entry
            })
    }
    return fromatted_result
}

const getWarbandSizeById = async (warband_id: number) => {
    const query = `
        SELECT COUNT(*) FROM Character WHERE warband_id = ($1)`
    const params = [String(warband_id)]
    const result = await executeQuery(query, params)
    console.log("Warband size: ",result.rows[0].count)
    return Number(result.rows[0].count)
}

export const updateCharacter =async (character: ICharacter) => {
    const { character_id, character_name, hp, armor_tier, str, agi, pre, tou, eq_slots } = character
    // maybe we should first implement the items for the characters since we need them here
    
}
// modify character (character id). This takes in only single character
// kill character - basically a modification 
// delete character

// const characterQuery = ` WITH Character_query as (
//     INSERT INTO Character (warband_id, character_name, hp, armor_tier, str, agi, pre, tou, eq_slots) VALUES (($1), ($2), ($3), ($4), ($5), ($6), ($7), ($8), ($9)) RETURNING character_id
// )`
