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
