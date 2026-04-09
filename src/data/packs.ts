export type Card = {
  id: string;
  name: string;
  emoji: string;
  imageUrl?: string;
  swatch?: {
    fill: string;
    stroke?: string;
  };
};

export type Pack = {
  id: string;
  title: string;
  description: string;
  locked?: boolean;
  requiresPremium?: boolean;
  modes?: ("flashcards" | "match")[];
  cards: Card[];
};

function svgDataUrl(svg: string) {
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

function createIllustrationCard({
  id,
  name,
  color,
  markup,
  emoji,
}: {
  id: string;
  name: string;
  color: string;
  markup: string;
  emoji: string;
}): Card {
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 240 240" role="img" aria-label="${name}">
      <rect width="240" height="240" rx="48" fill="#fff8ea" />
      <rect x="20" y="20" width="200" height="200" rx="40" fill="#ffffff" stroke="#f2e4c2" stroke-width="8" />
      <g fill="${color}" stroke="${color}" stroke-width="6" stroke-linejoin="round" stroke-linecap="round">
        ${markup}
      </g>
    </svg>
  `;

  return {
    id,
    name,
    emoji,
    imageUrl: svgDataUrl(svg),
  };
}

const shapeCards: Card[] = [
  createIllustrationCard({
    id: "circle",
    name: "Circle",
    color: "#ef4444",
    emoji: "🔴",
    markup: '<circle cx="120" cy="120" r="56" />',
  }),
  createIllustrationCard({
    id: "square",
    name: "Square",
    color: "#3b82f6",
    emoji: "🟦",
    markup: '<rect x="64" y="64" width="112" height="112" rx="12" />',
  }),
  createIllustrationCard({
    id: "triangle",
    name: "Triangle",
    color: "#22c55e",
    emoji: "🔺",
    markup: '<polygon points="120,54 184,174 56,174" />',
  }),
  createIllustrationCard({
    id: "rectangle",
    name: "Rectangle",
    color: "#f97316",
    emoji: "▭",
    markup: '<rect x="48" y="78" width="144" height="84" rx="12" />',
  }),
  createIllustrationCard({
    id: "oval",
    name: "Oval",
    color: "#a855f7",
    emoji: "🟣",
    markup: '<ellipse cx="120" cy="120" rx="70" ry="48" />',
  }),
  createIllustrationCard({
    id: "star",
    name: "Star",
    color: "#facc15",
    emoji: "⭐",
    markup:
      '<polygon points="120,46 140,92 190,96 152,128 164,178 120,150 76,178 88,128 50,96 100,92" />',
  }),
  createIllustrationCard({
    id: "heart",
    name: "Heart",
    color: "#ec4899",
    emoji: "💗",
    markup:
      '<path d="M120 184 C54 142 44 100 44 78 C44 52 64 36 88 36 C104 36 116 44 120 56 C124 44 136 36 152 36 C176 36 196 52 196 78 C196 100 186 142 120 184 Z" />',
  }),
  createIllustrationCard({
    id: "diamond",
    name: "Diamond",
    color: "#14b8a6",
    emoji: "🔷",
    markup: '<polygon points="120,42 186,120 120,198 54,120" />',
  }),
  createIllustrationCard({
    id: "hexagon",
    name: "Hexagon",
    color: "#8b5cf6",
    emoji: "⬡",
    markup: '<polygon points="84,54 156,54 192,120 156,186 84,186 48,120" />',
  }),
  createIllustrationCard({
    id: "crescent",
    name: "Crescent",
    color: "#0ea5e9",
    emoji: "🌙",
    markup:
      '<path d="M144 50 C104 50 72 82 72 122 C72 162 104 194 144 194 C117 182 98 154 98 122 C98 90 117 62 144 50 Z" />',
  }),
];

const bodyPartCards: Card[] = [
  { id: "head", name: "Head", emoji: "🙂" },
  { id: "eyes", name: "Eyes", emoji: "👀" },
  { id: "ears", name: "Ears", emoji: "👂" },
  { id: "nose", name: "Nose", emoji: "👃" },
  { id: "mouth", name: "Mouth", emoji: "👄" },
  { id: "hands", name: "Hands", emoji: "👐" },
  { id: "arms", name: "Arms", emoji: "💪" },
  { id: "legs", name: "Legs", emoji: "🦵" },
  { id: "feet", name: "Feet", emoji: "🦶" },
  { id: "hair", name: "Hair", emoji: "💇" },
];

export const packs: Pack[] = [
  {
    id: "first-words",
    title: "First Words",
    description:
      "Baby-friendly everyday words like books, clothes, and furniture.",
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
      { id: "moon", name: "Moon", emoji: "🌙" },
    ],
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
      { id: "chicken", name: "Chicken", emoji: "🐔" },
    ],
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
    ],
  },
  // {
  //   id: "farm-animals",
  //   title: "Farm Animals",
  //   description: "Premium pack coming soon with a farm animal vocabulary set.",
  //   requiresPremium: true,
  //   cards: [],
  // },
];
