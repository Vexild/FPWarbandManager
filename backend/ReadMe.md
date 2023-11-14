
## Warband body
```
{
	"warband_name": "Test name",
	"warband_resources": 50,
	"orner_id": 2,
    "public": true,
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
			"armor": 1,
			"str": "+1",
			"agi": "+3",
			"pre": "0",
			"tou": "-3",
			"eqslots": 6,
			"equipment": [
				{
					"item_id": 1
				},
				{
					"item_id": 2
				}
			]
		}, {
			"character_name": "Name 2",
			"hp": 5,
			"armor": 1,
			"str": "+3",
			"agi": "+1",
			"pre": "0",
			"tou": "-3",
			"eqslots": 8,
			"equipment": []
		}, {
			"character_name": "Name 3",
			"hp": 11,
			"armor": 1,
			"str": "+1",
			"agi": "-3",
			"pre": "0",
			"tou": "+3",
			"eqslots": 6,
			"equipment": [
				{
					"item_id": 1
				}
			]
		}, {
			"character_name": "Name 4",
			"hp": 8,
			"armor": 1,
			"str": "+1",
			"agi": "+3",
			"pre": "-3",
			"tou": "0",
			"eqslots": 6,
			"equipment": []
		}, {
			"character_name": "Name 5",
			"hp": 9,
			"armor": 1,
			"str": "-3",
			"agi": "+3",
			"pre": "0",
			"tou": "+1",
			"eqslots": 2,
			"equipment": [
				{
					"item_id": 4
				}
			]
		}
	]
}

```
