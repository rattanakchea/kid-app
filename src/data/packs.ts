export type Card = {
  id: string;
  name: string;
  emoji: string;
  imageUrl?: string;
};

export type Pack = {
  id: string;
  title: string;
  description: string;
  locked?: boolean;
  modes?: ("flashcards" | "match")[];
  cards: Card[];
};

export const packs: Pack[] = [
  {
    id: "first-words",
    title: "First Words",
    description: "Baby-friendly everyday words like books, clothes, and furniture.",
    cards: [
      { id: "book", name: "Book", emoji: "📚" },
      { id: "shirt", name: "Shirt", emoji: "👕" },
      { id: "pants", name: "Pants", emoji: "👖" },
      { id: "shoe", name: "Shoe", emoji: "👟" },
      { id: "hat", name: "Hat", emoji: "🧢" },
      { id: "sock", name: "Sock", emoji: "🧦" },
      { id: "chair", name: "Chair", emoji: "🪑" },
      { id: "table", name: "Table", emoji: "🛋️" },
      { id: "bed", name: "Bed", emoji: "🛏️" },
      { id: "lamp", name: "Lamp", emoji: "💡" },
      { id: "door", name: "Door", emoji: "🚪" },
      { id: "window", name: "Window", emoji: "🪟" },
      { id: "cup", name: "Cup", emoji: "🥤" },
      { id: "spoon", name: "Spoon", emoji: "🥄" },
      { id: "plate", name: "Plate", emoji: "🍽️" },
      { id: "apple", name: "Apple", emoji: "🍎" },
      { id: "banana", name: "Banana", emoji: "🍌" },
      { id: "milk", name: "Milk", emoji: "🥛" },
      { id: "water", name: "Water", emoji: "💧" },
      { id: "ball", name: "Ball", emoji: "⚽" },
      { id: "car", name: "Car", emoji: "🚗" },
      { id: "teddy", name: "Teddy Bear", emoji: "🧸" },
      { id: "blocks", name: "Blocks", emoji: "🧱" },
      { id: "puzzle", name: "Puzzle", emoji: "🧩" },
      { id: "bath", name: "Bath", emoji: "🛁" },
      { id: "soap", name: "Soap", emoji: "🧼" },
      { id: "toothbrush", name: "Toothbrush", emoji: "🪥" },
      { id: "tree", name: "Tree", emoji: "🌳" },
      { id: "sun", name: "Sun", emoji: "☀️" },
      { id: "moon", name: "Moon", emoji: "🌙" }
    ]
  },
  {
    id: "animals",
    title: "Animals",
    description: "Learn everyday animal names with big, friendly flashcards.",
    cards: [
      { id: "lion", name: "Lion", emoji: "🦁" },
      { id: "elephant", name: "Elephant", emoji: "🐘" },
      { id: "monkey", name: "Monkey", emoji: "🐵" },
      { id: "rabbit", name: "Rabbit", emoji: "🐰" },
      { id: "penguin", name: "Penguin", emoji: "🐧" },
      { id: "tiger", name: "Tiger", emoji: "🐯" },
      { id: "bear", name: "Bear", emoji: "🐻" },
      { id: "koala", name: "Koala", emoji: "🐨" },
      { id: "panda", name: "Panda", emoji: "🐼" },
      { id: "fox", name: "Fox", emoji: "🦊" },
      { id: "wolf", name: "Wolf", emoji: "🐺" },
      { id: "deer", name: "Deer", emoji: "🦌" },
      { id: "horse", name: "Horse", emoji: "🐴" },
      { id: "zebra", name: "Zebra", emoji: "🦓" },
      { id: "giraffe", name: "Giraffe", emoji: "🦒" },
      { id: "hippo", name: "Hippo", emoji: "🦛" },
      { id: "rhino", name: "Rhino", emoji: "🦏" },
      { id: "cow", name: "Cow", emoji: "🐮" },
      { id: "pig", name: "Pig", emoji: "🐷" },
      { id: "goat", name: "Goat", emoji: "🐐" },
      { id: "sheep", name: "Sheep", emoji: "🐑" },
      { id: "dog", name: "Dog", emoji: "🐶" },
      { id: "cat", name: "Cat", emoji: "🐱" },
      { id: "mouse", name: "Mouse", emoji: "🐭" },
      { id: "hamster", name: "Hamster", emoji: "🐹" },
      { id: "frog", name: "Frog", emoji: "🐸" },
      { id: "turtle", name: "Turtle", emoji: "🐢" },
      { id: "fish", name: "Fish", emoji: "🐟" },
      { id: "dolphin", name: "Dolphin", emoji: "🐬" },
      { id: "whale", name: "Whale", emoji: "🐳" },
      { id: "octopus", name: "Octopus", emoji: "🐙" },
      { id: "parrot", name: "Parrot", emoji: "🦜" },
      { id: "owl", name: "Owl", emoji: "🦉" },
      { id: "duck", name: "Duck", emoji: "🦆" },
      { id: "chicken", name: "Chicken", emoji: "🐔" }
    ]
  },
  {
    id: "fruits",
    title: "Fruits",
    description: "Explore colorful fruit words with simple repetition.",
    cards: [
      { id: "apple", name: "Apple", emoji: "🍎" },
      { id: "banana", name: "Banana", emoji: "🍌" },
      { id: "grapes", name: "Grapes", emoji: "🍇" },
      { id: "orange", name: "Orange", emoji: "🍊" },
      { id: "strawberry", name: "Strawberry", emoji: "🍓" },
      { id: "pear", name: "Pear", emoji: "🍐" },
      { id: "peach", name: "Peach", emoji: "🍑" },
      { id: "cherries", name: "Cherries", emoji: "🍒" },
      { id: "watermelon", name: "Watermelon", emoji: "🍉" },
      { id: "melon", name: "Melon", emoji: "🍈" },
      { id: "pineapple", name: "Pineapple", emoji: "🍍" },
      { id: "mango", name: "Mango", emoji: "🥭" },
      { id: "lemon", name: "Lemon", emoji: "🍋" },
      { id: "coconut", name: "Coconut", emoji: "🥥" },
      { id: "kiwi", name: "Kiwi", emoji: "🥝" },
      { id: "blueberries", name: "Blueberries", emoji: "🫐" },
      { id: "tomato", name: "Tomato", emoji: "🍅" },
      { id: "green-apple", name: "Green Apple", emoji: "🍏" },
      { id: "plum", name: "Plum", emoji: "🟣" },
      { id: "papaya", name: "Papaya", emoji: "🧡" },
      { id: "guava", name: "Guava", emoji: "💚" },
      { id: "dragon-fruit", name: "Dragon Fruit", emoji: "🐉" },
      { id: "lychee", name: "Lychee", emoji: "🔴" },
      { id: "apricot", name: "Apricot", emoji: "🟠" },
      { id: "fig", name: "Fig", emoji: "🟣" },
      { id: "pomegranate", name: "Pomegranate", emoji: "❤️" },
      { id: "raspberry", name: "Raspberry", emoji: "🔴" },
      { id: "blackberry", name: "Blackberry", emoji: "⚫" },
      { id: "passion-fruit", name: "Passion Fruit", emoji: "💜" },
      { id: "star-fruit", name: "Star Fruit", emoji: "⭐" },
      { id: "tangerine", name: "Tangerine", emoji: "🟠" },
      { id: "nectarine", name: "Nectarine", emoji: "🧡" },
      { id: "cranberry", name: "Cranberry", emoji: "🟥" },
      { id: "lime", name: "Lime", emoji: "🟢" },
      { id: "date", name: "Date", emoji: "🟤" }
    ]
  },
  {
    id: "colors",
    title: "Colors",
    description: "Premium pack",
    locked: true,
    cards: []
  }
];
