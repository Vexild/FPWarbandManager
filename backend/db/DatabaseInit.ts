import argon2 from "argon2"
import { executeQuery } from "../controllers/DatabaseController"

export const InitializeDatabase = async () =>{
    const dummyUser = "admin"
    const dummyEmail = "admin@fp.com"
    const dummyPass = await argon2.hash("admin")
    const creationQuery =`

    DROP TABLE IF EXISTS Character CASCADE;
    DROP TABLE IF EXISTS Item CASCADE;
    DROP TABLE IF EXISTS Warband CASCADE;
    DROP TABLE IF EXISTS Users CASCADE;

    CREATE TABLE IF NOT EXISTS Users (
        id serial PRIMARY KEY,
        user_name VARCHAR (50) NOT NULL,
        user_password VARCHAR (255) NOT NULL,
        email VARCHAR (255) UNIQUE NOT NULL,
        created TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL
    );

    CREATE TABLE IF NOT EXISTS Warband (
        warband_id serial PRIMARY KEY,
        warband_name VARCHAR (80) NOT NULL,
        public BOOLEAN NOT NULL,
        resources SMALLINT,
        owner_id INTEGER REFERENCES Users(user_id),
        created TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL
    );

    CREATE TABLE IF NOT EXISTS Character (
        character_id serial PRIMARY KEY,
        warband_id INTEGER REFERENCES Warband(warband_id) NOT NULL,
        character_name VARCHAR (80) NOT NULL,
        hp SMALLINT NOT NULL,
        armor_tier SMALLINT NOT NULL,
        str VARCHAR(3) NOT NULL,
        agi VARCHAR(3) NOT NULL,
        pre VARCHAR(3) NOT NULL,
        tou VARCHAR(3) NOT NULL,
        eq_slots SMALLINT NOT NULL,
        created TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL
    );
    
    CREATE TABLE IF NOT EXISTS Item (
        item_id serial PRIMARY KEY,
        item_name VARCHAR (50) NOT NULL,
        item_type VARCHAR (50) NOT NULL,
        item_desc VARCHAR (255),
        iteam_attrib VARCHAR(5),
        damage VARCHAR (5),
        armor_value SMALLINT,
        effect VARCHAR (255),
        item_price SMALLINT,
        large_item BOOLEAN NOT NULL,
        artifact BOOLEAN NOT NULL,
        artifact_owner INTEGER REFERENCES Users(user_id),
        created TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL
    );
    `

    const populateUsers = `
        INSERT INTO Users(user_name, user_password, email) VALUES ($1, $2, $3) ON CONFLICT DO NOTHING
    `
    const populateWarbands = [    
        "INSERT INTO Warband(warband_name, public, resources, owner_id) VALUES ('Doom Scourgers', 'true', 50, ( SELECT user_id from users where user_id ='1' )) ON CONFLICT DO NOTHING;",
        "INSERT INTO Warband(warband_name, public, resources, owner_id) VALUES ('Crypt Delwers', 'true', 50, ( SELECT user_id from users where user_id ='1' )) ON CONFLICT DO NOTHING;",
        "INSERT INTO Warband(warband_name, public, resources, owner_id) VALUES ('Night Blinkers', 'true', 50, ( SELECT user_id from users where user_id ='1' )) ON CONFLICT DO NOTHING;"
    ]
    const populateCharacters = `    
        INSERT INTO Character(warband_id, character_name, hp, armor_tier, str, agi, pre, tou, eq_slots ) 
            VALUES ( (SELECT warband_id from warband where warband_id ='1'), 'Prince Delulu', '12', '1', '+2', '+2', '-2', '-1', '7') ON CONFLICT DO NOTHING;
    `
    const populateItems = [    
        "INSERT INTO item(item_name, item_type, item_desc, iteam_attrib, damage, armor_value, effect, item_price, large_item, artifact, artifact_owner) VALUES ('Short sword', 'Weapon', 'Dull but agile sword', 'agi', 'D6', null, null, '2', 'false', 'false', null ) ON CONFLICT DO NOTHING;",
        "INSERT INTO item(item_name, item_type, item_desc, iteam_attrib, damage, armor_value, effect, item_price, large_item, artifact, artifact_owner) VALUES ('Warhammer', 'Weapon', 'Mighty tool of war', 'str', 'D12', null, null, '10', 'true', 'false', null ) ON CONFLICT DO NOTHING;",
        "INSERT INTO item(item_name, item_type, item_desc, iteam_attrib, damage, armor_value, effect, item_price, large_item, artifact, artifact_owner) VALUES ('Light Armor', 'Armor', 'Dull but agile sword', 'agi', null, '1', null, '10', 'false', 'false', null ) ON CONFLICT DO NOTHING;",
        "INSERT INTO item(item_name, item_type, item_desc, iteam_attrib, damage, armor_value, effect, item_price, large_item, artifact, artifact_owner) VALUES ('Gorgaring', 'Item', 'Toothring of an ancient troll shaman', null, null, null, 'Wielder only dies when they hit negative 6 hitpoints.', '20', 'false', 'True', 1 ) ON CONFLICT DO NOTHING;",
    ]

    console.log("INITIALIZE DB TABLES")
    try{
        await executeQuery(creationQuery)
        console.log("POPULATE TABLES: Users")
        await executeQuery(populateUsers, [dummyUser, dummyPass, dummyEmail])
        const vexword = await argon2.hash("TestiPassu")
        await executeQuery(populateUsers, ["Vexi", vexword, "vexi@mail.com"])
        console.log("POPULATE TABLES: Warband")
        populateWarbands.forEach( async (warband) => {
            await executeQuery(warband)
        })
        console.log("POPULATE TABLES: Character")
        await executeQuery(populateCharacters)
        console.log("POPULATE TABLES: Item")
        populateItems.forEach( async (item) => {
            await executeQuery(item)
        })
        console.log("INITIALIZATION COMPLETED")
    } catch (error){
        console.log("DB INIT ERROR\n",error)
    }
    
    
}