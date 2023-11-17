import { executeQuery } from "./DatabaseController"
import { IItem } from "./ItemController"

interface ICharacter {
    character_name: string,
    hp: number,
    armor_tier: number,
    str: string,
    agi: string,
    pre: string,
    tou: string,
    eq_slots: number,
    equipment: Array<IItem>,
    artifact: boolean,
    artifact_owner: number
}
// create Character
export const createCharacter = async (character: ICharacter, warband_id: string) => {
    const { character_name, hp, armor_tier, str, agi, pre, tou, eq_slots } = character
    const query = `
        INSERT INTO Character (warband_id, character_name, hp, armor_tier, str, agi, pre, tou, eq_slots) VALUES (($1), ($2), ($3), ($4), ($5), ($6), ($7), ($8), ($9) ) RETURNING character_id, character_name`
    const params = [String(warband_id), character_name, String(hp), String(armor_tier), str, agi, pre, tou, String(eq_slots)]
    const result = await executeQuery(query, params)
    console.log(result.rows)
    return result.rows
}


// get character by userID
export const getAllCharacters = async () => { // we want to add here optional parameters: "warband id", "character_id" and "user id". Also change name to "getCharacters"
    const query = `
        SELECT character_id, character_name, hp, armor_tier, str, agi, pre, tou, eq_slots, c.created, c.warband_id, w.warband_name FROM Character c JOIN Warband w ON c.warband_id = w.warband_id WHERE w.public = True`
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
            inventory: [],
            warband: {
                warband_id: warband_id,
                warband_name: warband_name
            } 
        }
        return entry
    });
    return fromatted_result
}


// modify character (character id)
// kill character - basically a modification 
// delete character

// const characterQuery = ` WITH Character_query as (
//     INSERT INTO Character (warband_id, character_name, hp, armor_tier, str, agi, pre, tou, eq_slots) VALUES (($1), ($2), ($3), ($4), ($5), ($6), ($7), ($8), ($9)) RETURNING character_id
// )`
