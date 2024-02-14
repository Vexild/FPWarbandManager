
## Setup 

1. Create `.env` file with following content
	```
	SECRET
	PORt
	PG_HOST
	PG_PORT
	PG_USERNAME
	PG_PASSWORD
	PG_DATABASE
	```
2. Install all dependencies `npm i`
3. For development, make sure your a dockerized PostgreSQL container is running
4. Run development by `npm run dev`


## Api
Most of the endpoints are protected by bearer token. You'll receive hour valid token by /user/login endpoint.

### User
| Method | Endpoint | Protected | Info | Body |
|-|-|-|-|-| 
| GET | /user/all | x | Gets all user information |
| GET | /user/id/:id | x | Gets user information by their ID |
| POST | /user/login |  | Returns a bearer token to validated user |
| POSt | /user/register|  | Registers a new user |{	"userName": "username",	"password": "userpassword"} |
| PUT | /user/update | x | Updates existing user|{	"userName": "username",	"password": "userpassword",	"email": "user@mail.com" } |


### Warband
| Method | Endpoint | Protected | Info | Body |
|-|-|-|-|-| 
| GET | /warband/publicWarbands | | Gets all warbands and their meta info |
| GET | /warband/:id | | Gets all meta info for single warband |
| POST | /warband/new | x | Add new warband for the user. Optional to create characters directly | see "Warband body" below |
| PUT | /warband/modify | x | Modifies existing warband that belongs to the user  | see "Warband body" below |
| DELETE | /warband/delete/:id | x | Removes existing warband that belongs to the user  |  |


## Warband body
This only adds the warband and members, it doesn't add ANY items to stash or members
```
{
	"id": 1 <ONLY FOR PUT METHOD>
	"warband_name": "Nueva Gang",
	"warband_resources": 50,
	"owner_id": 2,
	"public": false,
	"warband_characters": [
		{
			"character_name": "Name 1",
			"hp": 5,
			"armor_tier": 1,
			"str": "+1",
			"agi": "+3",
			"pre": "0",
			"tou": "-3",
			"eq_slots": 6
		}, {
			"character_name": "Name 2",
			"hp": 5,
			"armor_tier": 1,
			"str": "+3",
			"agi": "+1",
			"pre": "0",
			"tou": "-3",
			"eq_slots": 8
		}, {
			"character_name": "Name 3",
			"hp": 11,
			"armor_tier": 1,
			"str": "+1",
			"agi": "-3",
			"pre": "0",
			"tou": "+3",
			"eq_slots": 6
		}, {
			"character_name": "Name 4",
			"hp": 8,
			"armor_tier": 1,
			"str": "+1",
			"agi": "+3",
			"pre": "-3",
			"tou": "0",
			"eq_slots": 6
		}, {
			"character_name": "Name 5",
			"hp": 9,
			"armor_tier": 1,
			"str": "-3",
			"agi": "+3",
			"pre": "0",
			"tou": "+1",
			"eq_slots": 2
		}
	]
}
```

### Character
Characters are individual members of warband
| Method | Endpoint | Protected | Info | Body |
|-|-|-|-|-| 
| GET | /character/all | | Gets all characters from all public warbands and their info |
| GET | /character/bywarband/:id | | Gets all characters by warband id, their info and equipments |
| GET | /character/single/:id | | Gets single character's  info and equipments from a public wabrand |
| POST | /character/new | x | Create up to 5 characters to existing warband. No equipments re added, only stats | See "Character body" bellow
| PUT | /character/modify | x | Modify existing character in warband belonging to the user. | {"character_id": 5,"character_name": "Malux","hp": 1,"armor_tier": 2,"str": "+1","agi": "+3","pre": "-3","tou": "-1","eq_slots": 7 }
| DELETE | /character/delete:id | x | Delete existing character whose warband belongs to the user by character id. |


#### Character body
```{
	"warband_name": "Nueva Gang",
	"warband_resources": 50,
	"owner_id": 2,
	"public": false,
	"warband_stash": [
		{
			"item_name": "sword",
			"item_type": "weapon",
			"item_attrib": "str",
			"damage": "d6",
			"price": 2
		},
		{
			"item_name": "Warhammer",
			"item_type": "weapon",
			"item_attrib": "str",
			"damage": "d12",
			"price": 10,
			"large_item": "true"
		},
		{
			"item_name": "light armor",
			"item_type": "armor",
			"armor_value": 2,
			"price": "5"
		},
		{
			"item_name": "DOOM",
			"item_type": "unclean scroll",
			"effect": "All models within 12 inch take Prec test DR 12. On fail, they take D10 damage ignoring armor"
		}
	],
	"warband_characters": [
		{
			"character_name": "Name 1",
			"hp": 5,
			"armor_tier": 1,
			"str": "+1",
			"agi": "+3",
			"pre": "0",
			"tou": "-3",
			"eq_slots": 6
		}, {
			"character_name": "Name 2",
			"hp": 5,
			"armor_tier": 1,
			"str": "+3",
			"agi": "+1",
			"pre": "0",
			"tou": "-3",
			"eq_slots": 8
		}, {
			"character_name": "Name 3",
			"hp": 11,
			"armor_tier": 1,
			"str": "+1",
			"agi": "-3",
			"pre": "0",
			"tou": "+3",
			"eq_slots": 6
		}, {
			"character_name": "Name 4",
			"hp": 8,
			"armor_tier": 1,
			"str": "+1",
			"agi": "+3",
			"pre": "-3",
			"tou": "0",
			"eq_slots": 6
		}, {
			"character_name": "Name 5",
			"hp": 9,
			"armor_tier": 1,
			"str": "-3",
			"agi": "+3",
			"pre": "0",
			"tou": "+1",
			"eq_slots": 2
		}
	]
}
```

### Items
Items exist in stash or with characters inventory
| Method | Endpoint | Protected | Info | Body |
|-|-|-|-|-| 
| GET | /item/all | x | Gets all items from in database. This endpoint is protected so no unique items can be seen outside for privacy |
| GET | /item/single/:id | x | Get info of single item |
| POST | /item/new | x | Post new item | See "Item body" bellow"
| PUT | /item/update | x | Update existing item. | See "Item body" bellow"
| DELETE | item/delete/:id | x | Delete existing item. |
| PUT | /item/updatecarried | x | Updates items carried by character. Items are targeted by item id's | {"character_id": 1, "item_ids": [ 1,2,3 ] } 
| DELETE | item/removecarried | x | Removes carried item from characeter. |{"character_id": 2, "carried_item_id": 12 }

## Item body
```
{
		"item_id": 5, <ONLY FOR PUT METHOD>
		"item_name": "Blood Soaked Greatsword",
		"item_type": "item",
		"item_desc": "Great weapon, a slab of iron. Cursed by victims of the blade.",
		"iteam_attrib": "str",
		"damage": "D20",
		"armor_value": null,
		"effect": " When wielder dies, spawn a Wraits equal max HP they had.",
		"item_price": 20,
		"large_item": true,
		"artifact": false,
		"artifact_owner": null
	}
```

## Stash
Stash holds unlimited number of items. Items can be equiped to characters of same warband.
| Method | Endpoint | Protected | Info | Body |
|-|-|-|-|-| 
| GET | /stash/get/:id  | x | Gets all stashed items by warband id. | 
| POST | /stash/add | x | Add an existing item to warbands stash. Warband id is given in body |{	"warband_id": 2,"item_ids": [2, 2, 3] }
| DELETE | /stash/delete | x | Removes any number of items from stash by indexed item id - this id is part of all item request responses | { "warband_id": 1,	"stashed_item_index_ids": [194] }

