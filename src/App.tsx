import { useEffect, useState } from "react";
import { packs } from "./data/packs";

const freePacks = packs.filter((pack) => !pack.locked);
const matchTileCount = 4;

type GameMode = "flashcards" | "match";

type MatchTile = {
  id: string;
  pairId: string;
  label: string;
  solved: boolean;
};

function shuffleTiles<T>(items: T[]) {
  const nextItems = [...items];

  for (let index = nextItems.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(Math.random() * (index + 1));
    const current = nextItems[index];

    nextItems[index] = nextItems[swapIndex];
    nextItems[swapIndex] = current;
  }

  return nextItems;
}

function createMatchTiles(
  pack: (typeof freePacks)[number],
): MatchTile[] {
  return shuffleTiles(
    pack.cards.slice(0, matchTileCount).flatMap((card) => [
      {
        id: `${card.id}-a`,
        pairId: card.id,
        label: card.emoji,
        solved: false
      },
      {
        id: `${card.id}-b`,
        pairId: card.id,
        label: card.emoji,
        solved: false
      }
    ]),
  );
}

export default function App() {
  const [selectedPackId, setSelectedPackId] = useState(freePacks[0]?.id ?? "");
  const [gameMode, setGameMode] = useState<GameMode>("flashcards");
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [matchTiles, setMatchTiles] = useState<MatchTile[]>([]);
  const [flippedTileIds, setFlippedTileIds] = useState<string[]>([]);
  const [matchMoves, setMatchMoves] = useState(0);

  const selectedPack =
    packs.find((pack) => pack.id === selectedPackId) ?? freePacks[0];

  const currentCard = selectedPack.cards[currentCardIndex];
  const canGoBack = currentCardIndex > 0;
  const canGoForward = currentCardIndex < selectedPack.cards.length - 1;
  const solvedCount = matchTiles.filter((tile) => tile.solved).length;
  const matchComplete = solvedCount === matchTiles.length && matchTiles.length > 0;

  useEffect(() => {
    setCurrentCardIndex(0);
    setFlippedTileIds([]);
    setMatchMoves(0);
    setMatchTiles(createMatchTiles(selectedPack));
  }, [selectedPack]);

  const handleSelectPack = (packId: string) => {
    setSelectedPackId(packId);
  };

  const handleSelectMode = (mode: GameMode) => {
    setGameMode(mode);

    if (mode === "flashcards") {
      setCurrentCardIndex(0);
      return;
    }

    setFlippedTileIds([]);
    setMatchMoves(0);
    setMatchTiles(createMatchTiles(selectedPack));
  };

  const handlePrevious = () => {
    if (canGoBack) {
      setCurrentCardIndex((index) => index - 1);
    }
  };

  const handleNext = () => {
    if (canGoForward) {
      setCurrentCardIndex((index) => index + 1);
    }
  };

  const handleResetMatchGame = () => {
    setFlippedTileIds([]);
    setMatchMoves(0);
    setMatchTiles(createMatchTiles(selectedPack));
  };

  const handleTileClick = (tileId: string) => {
    if (flippedTileIds.length === 2) {
      return;
    }

    const tile = matchTiles.find((entry) => entry.id === tileId);

    if (!tile || tile.solved || flippedTileIds.includes(tileId)) {
      return;
    }

    const nextFlippedTileIds = [...flippedTileIds, tileId];
    setFlippedTileIds(nextFlippedTileIds);

    if (nextFlippedTileIds.length < 2) {
      return;
    }

    setMatchMoves((moves) => moves + 1);

    const [firstId, secondId] = nextFlippedTileIds;
    const firstTile = matchTiles.find((entry) => entry.id === firstId);
    const secondTile = matchTiles.find((entry) => entry.id === secondId);

    if (!firstTile || !secondTile) {
      setFlippedTileIds([]);
      return;
    }

    if (firstTile.pairId === secondTile.pairId && firstTile.id !== secondTile.id) {
      setMatchTiles((currentTiles) =>
        currentTiles.map((entry) =>
          entry.pairId === firstTile.pairId ? { ...entry, solved: true } : entry,
        ),
      );
      setFlippedTileIds([]);
      return;
    }

    window.setTimeout(() => {
      setFlippedTileIds([]);
    }, 700);
  };

  return (
    <div className="app-shell">
      <header className="hero">
        <p className="eyebrow">Kid-friendly MVP</p>
        <h1>Playful first words for little learners</h1>
        <p className="hero-copy">
          A simple browser-first learning app with flashcards and a first
          matching game built from the same learning packs.
        </p>
      </header>

      <main className="layout">
        <section className="panel">
          <div className="section-heading">
            <h2>Choose a pack</h2>
            <p>Start with free packs. Premium packs stay visible but locked.</p>
          </div>

          <div className="pack-grid">
            {packs.map((pack) => {
              const isActive = pack.id === selectedPackId;

              return (
                <button
                  key={pack.id}
                  className={`pack-card${isActive ? " active" : ""}`}
                  onClick={() => !pack.locked && handleSelectPack(pack.id)}
                  type="button"
                  disabled={pack.locked}
                >
                  <span className="pack-title-row">
                    <span>{pack.title}</span>
                    {pack.locked ? <span className="pill">Premium</span> : null}
                  </span>
                  <span className="pack-description">{pack.description}</span>
                </button>
              );
            })}
          </div>

          <div className="section-heading mode-heading">
            <h2>Choose a game</h2>
            <p>Keep the game loop simple and switch modes without leaving the page.</p>
          </div>

          <div className="mode-toggle" role="tablist" aria-label="Game mode">
            <button
              className={`mode-button${gameMode === "flashcards" ? " active" : ""}`}
              onClick={() => handleSelectMode("flashcards")}
              type="button"
            >
              Flashcards
            </button>
            <button
              className={`mode-button${gameMode === "match" ? " active" : ""}`}
              onClick={() => handleSelectMode("match")}
              type="button"
            >
              Pair match
            </button>
          </div>
        </section>

        <section className="panel flashcard-panel">
          <div className="section-heading">
            <h2>
              {selectedPack.title} {gameMode === "flashcards" ? "flashcards" : "pair match"}
            </h2>
            <p>
              {gameMode === "flashcards"
                ? "Step through the words one by one with a calm, guided flow."
                : "Match the same emoji pairs using the selected pack content."}
            </p>
          </div>

          {gameMode === "flashcards" ? (
            <>
              <article className="flashcard">
                <div className="flashcard-emoji" aria-hidden="true">
                  {currentCard.emoji}
                </div>
                <div className="flashcard-word">{currentCard.name}</div>
                <div className="flashcard-progress">
                  Card {currentCardIndex + 1} of {selectedPack.cards.length}
                </div>
              </article>

              <div className="flashcard-actions">
                <button onClick={handlePrevious} type="button" disabled={!canGoBack}>
                  Back
                </button>
                <button onClick={handleNext} type="button" disabled={!canGoForward}>
                  Next
                </button>
              </div>
            </>
          ) : (
            <>
              <div className="match-status">
                <div>
                  <strong>{selectedPack.title}</strong> matching board
                </div>
                <div>
                  {solvedCount / 2} of {matchTiles.length / 2} pairs found
                </div>
                <div>{matchMoves} moves</div>
              </div>

              <div className="match-grid">
                {matchTiles.map((tile) => {
                  const isFlipped =
                    tile.solved || flippedTileIds.includes(tile.id);

                  return (
                    <button
                      key={tile.id}
                      className={`match-tile${isFlipped ? " flipped" : ""}`}
                      onClick={() => handleTileClick(tile.id)}
                      type="button"
                      disabled={tile.solved}
                    >
                      <span className="match-tile-face match-tile-front">?</span>
                      <span className="match-tile-face match-tile-back">
                        {tile.label}
                      </span>
                    </button>
                  );
                })}
              </div>

              <div className="match-footer">
                <p>
                  Find the two matching emoji tiles. The board resets when you
                  change packs.
                </p>
                <button onClick={handleResetMatchGame} type="button">
                  Shuffle again
                </button>
              </div>

              {matchComplete ? (
                <div className="match-success">
                  Nice work. You matched every pair in {matchMoves} moves.
                </div>
              ) : null}
            </>
          )}
        </section>

        <section className="panel roadmap-panel">
          <div className="section-heading">
            <h2>Next slices</h2>
            <p>Keep the roadmap visible, but stay disciplined about scope.</p>
          </div>

          <ul className="roadmap-list">
            <li>Tap-to-hear pronunciation audio</li>
            <li>Optional harder mode with emoji-to-word matching later</li>
            <li>Animated success feedback for correct matches</li>
            <li>Premium unlock flow for extra packs</li>
            <li>iOS wrapper after web engagement is proven</li>
          </ul>
        </section>
      </main>
    </div>
  );
}
