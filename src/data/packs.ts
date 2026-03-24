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

function createLocalCardArt(
  name: string,
  colors: { background: string; accent: string; detail: string },
) {
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400" role="img" aria-label="${name}">
      <defs>
        <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stop-color="${colors.background}" />
          <stop offset="100%" stop-color="#ffffff" />
        </linearGradient>
      </defs>
      <rect width="400" height="400" rx="36" fill="url(#bg)" />
      <circle cx="92" cy="90" r="52" fill="${colors.detail}" opacity="0.22" />
      <circle cx="315" cy="82" r="44" fill="${colors.accent}" opacity="0.22" />
      <rect x="72" y="118" width="256" height="170" rx="34" fill="#ffffff" opacity="0.92" />
      <rect x="106" y="156" width="188" height="94" rx="26" fill="${colors.accent}" opacity="0.88" />
      <circle cx="138" cy="203" r="18" fill="#ffffff" opacity="0.9" />
      <rect x="166" y="185" width="94" height="14" rx="7" fill="#ffffff" opacity="0.92" />
      <rect x="166" y="211" width="66" height="14" rx="7" fill="#ffffff" opacity="0.82" />
      <rect x="86" y="306" width="228" height="48" rx="24" fill="${colors.detail}" opacity="0.92" />
      <text x="200" y="337" text-anchor="middle" font-size="30" font-family="Arial, sans-serif" font-weight="700" fill="#17324d">${name}</text>
    </svg>
  `;

  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

export const packs: Pack[] = [
  {
    id: "first-words",
    title: "First Words",
    description: "Baby-friendly everyday words like books, clothes, and furniture.",
    modes: ["flashcards"],
    cards: [
      { id: "book", name: "Book", emoji: "📚", imageUrl: createLocalCardArt("Book", { background: "#f6e3b4", accent: "#e8a63c", detail: "#f8f2dc" }) },
      { id: "shirt", name: "Shirt", emoji: "👕", imageUrl: createLocalCardArt("Shirt", { background: "#dceef9", accent: "#4da7d8", detail: "#eef8ff" }) },
      { id: "pants", name: "Pants", emoji: "👖", imageUrl: createLocalCardArt("Pants", { background: "#dce3fa", accent: "#627cd8", detail: "#f0f4ff" }) },
      { id: "shoe", name: "Shoe", emoji: "👟", imageUrl: createLocalCardArt("Shoe", { background: "#f7dfd4", accent: "#eb7d52", detail: "#fff3eb" }) },
      { id: "hat", name: "Hat", emoji: "🧢", imageUrl: createLocalCardArt("Hat", { background: "#ffe6c8", accent: "#d98f2e", detail: "#fff4e6" }) },
      { id: "sock", name: "Sock", emoji: "🧦", imageUrl: createLocalCardArt("Sock", { background: "#f0d9f8", accent: "#b062d8", detail: "#fbf1ff" }) },
      { id: "chair", name: "Chair", emoji: "🪑", imageUrl: createLocalCardArt("Chair", { background: "#f4dfcf", accent: "#c57c42", detail: "#fff4ea" }) },
      { id: "table", name: "Table", emoji: "🛋️", imageUrl: createLocalCardArt("Table", { background: "#e8dccf", accent: "#96745b", detail: "#faf5ee" }) },
      { id: "bed", name: "Bed", emoji: "🛏️", imageUrl: createLocalCardArt("Bed", { background: "#e1ecff", accent: "#6f8fd7", detail: "#f3f8ff" }) },
      { id: "lamp", name: "Lamp", emoji: "💡", imageUrl: createLocalCardArt("Lamp", { background: "#fff2bf", accent: "#edbd3b", detail: "#fff9df" }) },
      { id: "door", name: "Door", emoji: "🚪", imageUrl: createLocalCardArt("Door", { background: "#f2ddcf", accent: "#be7951", detail: "#fff3ea" }) },
      { id: "window", name: "Window", emoji: "🪟", imageUrl: createLocalCardArt("Window", { background: "#d9efff", accent: "#5eaad6", detail: "#eef9ff" }) },
      { id: "cup", name: "Cup", emoji: "🥤", imageUrl: createLocalCardArt("Cup", { background: "#ffe0dc", accent: "#e56f76", detail: "#fff2f0" }) },
      { id: "spoon", name: "Spoon", emoji: "🥄", imageUrl: createLocalCardArt("Spoon", { background: "#e8edf2", accent: "#8897aa", detail: "#f8fbff" }) },
      { id: "plate", name: "Plate", emoji: "🍽️", imageUrl: createLocalCardArt("Plate", { background: "#e8f6ef", accent: "#57b28a", detail: "#f4fff9" }) },
      { id: "apple", name: "Apple", emoji: "🍎", imageUrl: createLocalCardArt("Apple", { background: "#ffe1df", accent: "#db4d4d", detail: "#fff4f3" }) },
      { id: "banana", name: "Banana", emoji: "🍌", imageUrl: createLocalCardArt("Banana", { background: "#fff2c4", accent: "#e5bf39", detail: "#fff9df" }) },
      { id: "milk", name: "Milk", emoji: "🥛", imageUrl: createLocalCardArt("Milk", { background: "#eef5fb", accent: "#79a6d6", detail: "#ffffff" }) },
      { id: "water", name: "Water", emoji: "💧", imageUrl: createLocalCardArt("Water", { background: "#daf3ff", accent: "#45a3d9", detail: "#f1fbff" }) },
      { id: "ball", name: "Ball", emoji: "⚽", imageUrl: createLocalCardArt("Ball", { background: "#ffe0c7", accent: "#ef8e44", detail: "#fff3e8" }) },
      { id: "car", name: "Car", emoji: "🚗", imageUrl: createLocalCardArt("Car", { background: "#dce7ff", accent: "#4c73d8", detail: "#eef4ff" }) },
      { id: "teddy", name: "Teddy Bear", emoji: "🧸", imageUrl: createLocalCardArt("Teddy Bear", { background: "#edd9cb", accent: "#bc7b53", detail: "#fbf0e8" }) },
      { id: "blocks", name: "Blocks", emoji: "🧱", imageUrl: createLocalCardArt("Blocks", { background: "#fbe0d8", accent: "#da7559", detail: "#fff1ec" }) },
      { id: "puzzle", name: "Puzzle", emoji: "🧩", imageUrl: createLocalCardArt("Puzzle", { background: "#ede2ff", accent: "#8d67d6", detail: "#f8f1ff" }) },
      { id: "bath", name: "Bath", emoji: "🛁", imageUrl: createLocalCardArt("Bath", { background: "#dff4ff", accent: "#59a7cf", detail: "#f2fbff" }) },
      { id: "soap", name: "Soap", emoji: "🧼", imageUrl: createLocalCardArt("Soap", { background: "#dff7ef", accent: "#5fb999", detail: "#f3fffa" }) },
      { id: "toothbrush", name: "Toothbrush", emoji: "🪥", imageUrl: createLocalCardArt("Toothbrush", { background: "#ffe2f0", accent: "#d869a1", detail: "#fff3f9" }) },
      { id: "tree", name: "Tree", emoji: "🌳", imageUrl: createLocalCardArt("Tree", { background: "#e3f4d9", accent: "#5ea355", detail: "#f4ffef" }) },
      { id: "sun", name: "Sun", emoji: "☀️", imageUrl: createLocalCardArt("Sun", { background: "#fff0bf", accent: "#edb834", detail: "#fff9de" }) },
      { id: "moon", name: "Moon", emoji: "🌙", imageUrl: createLocalCardArt("Moon", { background: "#e3e8ff", accent: "#6f76cf", detail: "#f4f6ff" }) }
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
