export type Card = {
  id: string;
  name: string;
  emoji: string;
};

export type Pack = {
  id: string;
  title: string;
  description: string;
  locked?: boolean;
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
      { id: "penguin", name: "Penguin", emoji: "🐧" }
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
      { id: "strawberry", name: "Strawberry", emoji: "🍓" }
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
