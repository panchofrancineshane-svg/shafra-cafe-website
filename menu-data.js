/* Item details for the pop-up on the menu page.
   If you change a price or add an item, update it here AND in menu.html. */
const MENU_ITEMS = [
  {
    "id": "pumpkin-spice-latte",
    "name": "Pumpkin Spice Latte",
    "category": "offers",
    "price": 149,
    "beans": 15,
    "old": 175,
    "image": "images/Autumn Drink.jfif",
    "tags": [
      "Limited time"
    ],
    "desc": "Real pumpkin, warm spices and silky steamed milk.",
    "long": "Our autumn favorite. Espresso blended with house-made pumpkin spice syrup, topped with steamed milk, whipped cream and a dusting of cinnamon. Available until November 30.",
    "ingredients": [
      "Espresso",
      "Steamed milk",
      "Pumpkin spice syrup",
      "Whipped cream",
      "Cinnamon"
    ],
    "allergens": [
      "Milk"
    ],
    "sizes": [
      [
        "S",
        -15
      ],
      [
        "M",
        0
      ],
      [
        "L",
        20
      ]
    ],
    "addons": [
      [
        "Extra espresso shot",
        30
      ],
      [
        "Oat milk",
        25
      ],
      [
        "Extra caramel drizzle",
        15
      ]
    ],
    "notePlaceholder": ""
  },
  {
    "id": "maple-cold-brew",
    "name": "Maple Cold Brew",
    "category": "offers",
    "price": 155,
    "beans": 14,
    "old": null,
    "image": "images/maple cold brew.jpg",
    "tags": [
      "New"
    ],
    "desc": "Slow-steeped cold brew sweetened with maple syrup.",
    "long": "Steeped slowly for 18 hours for a smooth, low-acid coffee, poured over ice and lightly sweetened with real maple syrup. Served cold.",
    "ingredients": [
      "Cold brew coffee",
      "Maple syrup",
      "Ice"
    ],
    "allergens": [],
    "sizes": [
      [
        "S",
        -15
      ],
      [
        "M",
        0
      ],
      [
        "L",
        20
      ]
    ],
    "addons": [
      [
        "Extra espresso shot",
        30
      ],
      [
        "Splash of oat milk",
        20
      ]
    ],
    "notePlaceholder": ""
  },
  {
    "id": "coffee-pastry-combo",
    "name": "Coffee + Pastry Combo",
    "category": "offers",
    "price": 199,
    "beans": 18,
    "old": null,
    "image": "images/combo.jpg",
    "tags": [
      "Limited time"
    ],
    "desc": "Any regular coffee with a croissant of your choice.",
    "long": "Pick any regular hot or iced coffee from our menu and a croissant. Tell us your choices in the notes below. Available until November 30.",
    "ingredients": [
      "Regular coffee of your choice",
      "Butter croissant or almond croissant"
    ],
    "allergens": [
      "Milk",
      "Gluten",
      "Eggs",
      "Tree nuts (almond croissant)"
    ],
    "sizes": [],
    "addons": [
      [
        "Upgrade to almond croissant",
        15
      ]
    ],
    "notePlaceholder": "Which coffee and which croissant? (for example: iced latte + butter croissant)"
  },
  {
    "id": "caramel-latte",
    "name": "Caramel Latte",
    "category": "coffee",
    "price": 145,
    "beans": 12,
    "old": null,
    "image": "images/caramel latte.jpg",
    "tags": [],
    "desc": "Espresso, steamed milk and house-made caramel.",
    "long": "Two shots of espresso with creamy steamed milk and our house-made caramel, finished with a caramel drizzle. A favorite with first-time visitors.",
    "ingredients": [
      "Espresso",
      "Steamed milk",
      "House-made caramel"
    ],
    "allergens": [
      "Milk"
    ],
    "sizes": [
      [
        "S",
        -15
      ],
      [
        "M",
        0
      ],
      [
        "L",
        20
      ]
    ],
    "addons": [
      [
        "Extra espresso shot",
        30
      ],
      [
        "Oat milk",
        25
      ],
      [
        "Extra caramel drizzle",
        15
      ]
    ],
    "notePlaceholder": ""
  },
  {
    "id": "oat-milk-flat-white",
    "name": "Oat Milk Flat White",
    "category": "coffee",
    "price": 155,
    "beans": 12,
    "old": null,
    "image": "images/oat milk flat white.jpg",
    "tags": [
      "Vegan"
    ],
    "desc": "Double espresso with silky steamed oat milk.",
    "long": "A double shot of espresso with velvety steamed oat milk. Smooth, strong and completely plant-based.",
    "ingredients": [
      "Double espresso",
      "Steamed oat milk"
    ],
    "allergens": [
      "Gluten (oat milk)"
    ],
    "sizes": [
      [
        "S",
        -15
      ],
      [
        "M",
        0
      ],
      [
        "L",
        20
      ]
    ],
    "addons": [
      [
        "Extra espresso shot",
        30
      ],
      [
        "Extra caramel drizzle",
        15
      ]
    ],
    "notePlaceholder": ""
  },
  {
    "id": "americano",
    "name": "Americano",
    "category": "coffee",
    "price": 110,
    "beans": 8,
    "old": null,
    "image": "images/americano.jfif",
    "tags": [],
    "desc": "Two shots of espresso with hot water.",
    "long": "Two shots of our house espresso topped with hot water for a clean, bold cup. Also available iced: just tell us in the notes.",
    "ingredients": [
      "Espresso",
      "Water"
    ],
    "allergens": [],
    "sizes": [
      [
        "S",
        -15
      ],
      [
        "M",
        0
      ],
      [
        "L",
        20
      ]
    ],
    "addons": [
      [
        "Extra espresso shot",
        30
      ],
      [
        "Splash of milk",
        0
      ]
    ],
    "notePlaceholder": ""
  },
  {
    "id": "matcha-latte",
    "name": "Matcha Latte",
    "category": "tea",
    "price": 160,
    "beans": 14,
    "old": null,
    "image": "images/matcha latte.jpg",
    "tags": [
      "Vegan option"
    ],
    "desc": "Ceremonial-grade matcha whisked with your choice of milk.",
    "long": "Ceremonial-grade matcha whisked until smooth and topped with your choice of milk. Choose oat milk to keep it vegan.",
    "ingredients": [
      "Matcha",
      "Milk of your choice"
    ],
    "allergens": [
      "Milk (unless you choose oat)"
    ],
    "sizes": [
      [
        "S",
        -15
      ],
      [
        "M",
        0
      ],
      [
        "L",
        20
      ]
    ],
    "addons": [
      [
        "Oat milk",
        25
      ],
      [
        "Honey",
        10
      ]
    ],
    "notePlaceholder": ""
  },
  {
    "id": "chai-latte",
    "name": "Chai Latte",
    "category": "tea",
    "price": 140,
    "beans": 11,
    "old": null,
    "image": "images/chai latte.jpg",
    "tags": [
      "Spicy"
    ],
    "desc": "Black tea with warm spices and steamed milk.",
    "long": "Black tea simmered with cinnamon, cardamom, ginger and clove, then topped with steamed milk. Gently spicy and warming.",
    "ingredients": [
      "Black tea",
      "Cinnamon",
      "Cardamom",
      "Ginger",
      "Clove",
      "Steamed milk"
    ],
    "allergens": [
      "Milk"
    ],
    "sizes": [
      [
        "S",
        -15
      ],
      [
        "M",
        0
      ],
      [
        "L",
        20
      ]
    ],
    "addons": [
      [
        "Oat milk",
        25
      ],
      [
        "Honey",
        10
      ]
    ],
    "notePlaceholder": ""
  },
  {
    "id": "chamomile-honey",
    "name": "Chamomile Honey",
    "category": "tea",
    "price": 120,
    "beans": 9,
    "old": null,
    "image": "images/chamomile honey.jpg",
    "tags": [],
    "desc": "Calming chamomile with a spoon of local honey.",
    "long": "Whole chamomile flowers steeped hot and finished with a spoon of local honey. Caffeine-free and calming.",
    "ingredients": [
      "Chamomile",
      "Local honey"
    ],
    "allergens": [],
    "sizes": [
      [
        "S",
        -15
      ],
      [
        "M",
        0
      ],
      [
        "L",
        20
      ]
    ],
    "addons": [
      [
        "Extra honey",
        10
      ],
      [
        "Slice of lemon",
        0
      ]
    ],
    "notePlaceholder": ""
  },
  {
    "id": "butter-croissant",
    "name": "Butter Croissant",
    "category": "pastries",
    "price": 95,
    "beans": 7,
    "old": null,
    "image": "images/butter croissant.jpg",
    "tags": [],
    "desc": "Flaky, golden and baked fresh every morning.",
    "long": "Laminated by hand and baked every morning until golden and crisp outside, soft and buttery inside.",
    "ingredients": [
      "Flour",
      "Butter",
      "Milk",
      "Eggs",
      "Yeast",
      "Sugar",
      "Salt"
    ],
    "allergens": [
      "Milk",
      "Gluten",
      "Eggs"
    ],
    "sizes": [],
    "addons": [
      [
        "Warm it up",
        0
      ],
      [
        "Side of butter and jam",
        20
      ]
    ],
    "notePlaceholder": ""
  },
  {
    "id": "almond-croissant",
    "name": "Almond Croissant",
    "category": "pastries",
    "price": 110,
    "beans": 9,
    "old": null,
    "image": "images/almond croissant.jpg",
    "tags": [
      "Contains nuts"
    ],
    "desc": "Buttery croissant filled with almond cream.",
    "long": "Our butter croissant filled with almond cream, topped with sliced almonds and a dusting of sugar.",
    "ingredients": [
      "Croissant",
      "Almond cream",
      "Sliced almonds",
      "Sugar"
    ],
    "allergens": [
      "Milk",
      "Gluten",
      "Eggs",
      "Tree nuts"
    ],
    "sizes": [],
    "addons": [
      [
        "Warm it up",
        0
      ]
    ],
    "notePlaceholder": ""
  },
  {
    "id": "blueberry-muffin",
    "name": "Blueberry Muffin",
    "category": "pastries",
    "price": 90,
    "beans": 7,
    "old": null,
    "image": "images/blueberry muffin.jpg",
    "tags": [],
    "desc": "Soft muffin packed with blueberries.",
    "long": "A soft, moist muffin packed with blueberries and finished with a sugar crust.",
    "ingredients": [
      "Flour",
      "Blueberries",
      "Butter",
      "Eggs",
      "Milk",
      "Sugar"
    ],
    "allergens": [
      "Milk",
      "Gluten",
      "Eggs"
    ],
    "sizes": [],
    "addons": [
      [
        "Warm it up",
        0
      ],
      [
        "Side of butter",
        10
      ]
    ],
    "notePlaceholder": ""
  },
  {
    "id": "avocado-toast",
    "name": "Avocado Toast",
    "category": "meals",
    "price": 210,
    "beans": 20,
    "old": null,
    "image": "images/avocado toast.jpg",
    "tags": [
      "Spicy"
    ],
    "desc": "Sourdough, smashed avocado, chili flakes and a poached egg.",
    "long": "Toasted sourdough topped with smashed avocado, a poached egg, chili flakes and a squeeze of lemon.",
    "ingredients": [
      "Sourdough",
      "Avocado",
      "Poached egg",
      "Chili flakes",
      "Lemon"
    ],
    "allergens": [
      "Gluten",
      "Eggs"
    ],
    "sizes": [],
    "addons": [
      [
        "Extra poached egg",
        35
      ],
      [
        "Side salad",
        45
      ],
      [
        "Less spicy (no chili)",
        0
      ]
    ],
    "notePlaceholder": ""
  },
  {
    "id": "chicken-pesto-panini",
    "name": "Chicken Pesto Panini",
    "category": "meals",
    "price": 240,
    "beans": 22,
    "old": null,
    "image": "images/chicken pesto panini.jpg",
    "tags": [
      "Contains nuts"
    ],
    "desc": "Grilled chicken, basil pesto and mozzarella.",
    "long": "Grilled chicken, basil pesto and melted mozzarella pressed in toasted ciabatta. Served hot.",
    "ingredients": [
      "Ciabatta",
      "Grilled chicken",
      "Basil pesto (pine nuts)",
      "Mozzarella"
    ],
    "allergens": [
      "Milk",
      "Gluten",
      "Tree nuts (pine nuts)"
    ],
    "sizes": [],
    "addons": [
      [
        "Side salad",
        45
      ],
      [
        "Extra cheese",
        25
      ]
    ],
    "notePlaceholder": ""
  }
];

/* Secret-menu rewards: bought with beans only (see js/secret-menu.js) */
const SECRET_ITEMS = [
  {
    "id": "secret-pistachio-croissant",
    "name": "Pistachio Dream Croissant",
    "cost": 60,
    "desc": "Hidden-menu croissant filled with pistachio cream, with crushed pistachios and a drizzle of white chocolate.",
    "allergens": [
      "Milk",
      "Gluten",
      "Eggs",
      "Tree nuts"
    ],
    "image": "images/almond croissant.jpg",
    "long": "Our hidden-menu croissant: a butter croissant filled with pistachio cream, topped with crushed pistachios and a drizzle of white chocolate. Baked fresh, only for secret-menu members.",
    "ingredients": [
      "Butter croissant",
      "Pistachio cream",
      "Crushed pistachios",
      "White chocolate"
    ],
    "sizes": [],
    "addons": [],
    "tags": [
      "Secret menu"
    ],
    "notePlaceholder": ""
  },
  {
    "id": "secret-golden-bean-latte",
    "name": "Golden Bean Latte",
    "cost": 90,
    "desc": "A honey and brown sugar latte topped with crunchy toasted cocoa nibs. Not on the regular menu.",
    "allergens": [
      "Milk"
    ],
    "image": "images/caramel latte.jpg",
    "long": "Espresso with steamed milk, honey and brown sugar, finished with crunchy toasted cocoa nibs. Not on the regular menu. Choose any size at no extra beans.",
    "ingredients": [
      "Espresso",
      "Steamed milk",
      "Honey",
      "Brown sugar",
      "Toasted cocoa nibs"
    ],
    "sizes": [
      [
        "S",
        0
      ],
      [
        "M",
        0
      ],
      [
        "L",
        0
      ]
    ],
    "addons": [],
    "tags": [
      "Secret menu"
    ],
    "notePlaceholder": ""
  },
  {
    "id": "secret-midnight-mocha-float",
    "name": "Midnight Mocha Float",
    "cost": 120,
    "desc": "Dark chocolate mocha poured over a scoop of vanilla ice cream.",
    "allergens": [
      "Milk"
    ],
    "image": "images/maple cold brew.jpg",
    "long": "Dark chocolate mocha poured over a scoop of vanilla ice cream, served cold in a tall glass. Choose any size at no extra beans.",
    "ingredients": [
      "Espresso",
      "Dark chocolate",
      "Milk",
      "Vanilla ice cream"
    ],
    "sizes": [
      [
        "S",
        0
      ],
      [
        "M",
        0
      ],
      [
        "L",
        0
      ]
    ],
    "addons": [],
    "tags": [
      "Secret menu"
    ],
    "notePlaceholder": ""
  },
  {
    "id": "secret-free-drink-voucher",
    "name": "Free Drink of Your Choice",
    "cost": 150,
    "desc": "Any drink from the regular menu, in any size, on us.",
    "allergens": [],
    "image": "images/cafe.jpg",
    "long": "Choose any drink from the regular menu, in any size. Tell us which one in the notes below.",
    "ingredients": [
      "Any drink from the regular menu"
    ],
    "sizes": [
      [
        "S",
        0
      ],
      [
        "M",
        0
      ],
      [
        "L",
        0
      ]
    ],
    "addons": [],
    "tags": [
      "Secret menu"
    ],
    "notePlaceholder": "Which drink would you like? (for example: iced caramel latte)"
  }
];
