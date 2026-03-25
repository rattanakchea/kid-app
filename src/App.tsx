import { useEffect, useState } from "react";
import { packs } from "./data/packs";

const matchTileCount = 6;

type GameMode = "flashcards" | "match";
type PageView = "home" | "detail";

type MatchTile = {
  id: string;
  pairId: string;
  label: string;
  solved: boolean;
};

const sections: { id: GameMode; label: string }[] = [
  { id: "flashcards", label: "Flashcards" },
  { id: "match", label: "Pair Games" },
];

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

function createMatchTiles(pack: (typeof packs)[number]): MatchTile[] {
  return shuffleTiles(
    pack.cards.slice(0, matchTileCount).flatMap((card) => [
      {
        id: `${card.id}-a`,
        pairId: card.id,
        label: card.emoji,
        solved: false,
      },
      {
        id: `${card.id}-b`,
        pairId: card.id,
        label: card.emoji,
        solved: false,
      },
    ]),
  );
}

export default function App() {
  const [selectedPackId, setSelectedPackId] = useState("animals");
  const [gameMode, setGameMode] = useState<GameMode>("flashcards");
  const [pageView, setPageView] = useState<PageView>("home");
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [isFlashcardFlipped, setIsFlashcardFlipped] = useState(false);
  const [matchTiles, setMatchTiles] = useState<MatchTile[]>([]);
  const [flippedTileIds, setFlippedTileIds] = useState<string[]>([]);
  const [matchMoves, setMatchMoves] = useState(0);

  const availablePacks = packs.filter(
    (pack) => !pack.locked && (!pack.modes || pack.modes.includes(gameMode)),
  );

  const selectedPack =
    availablePacks.find((pack) => pack.id === selectedPackId) ??
    availablePacks[0];

  const currentSection =
    sections.find((section) => section.id === gameMode) ?? sections[0];

  const currentCard = selectedPack.cards[currentCardIndex];
  const canGoBack = currentCardIndex > 0;
  const canGoForward = currentCardIndex < selectedPack.cards.length - 1;
  const solvedCount = matchTiles.filter((tile) => tile.solved).length;
  const matchComplete =
    solvedCount === matchTiles.length && matchTiles.length > 0;
  const speechSynthesisSupported =
    typeof window !== "undefined" && "speechSynthesis" in window;
  const [isPronouncing, setIsPronouncing] = useState(false);

  useEffect(() => {
    if (!selectedPack) {
      return;
    }

    setCurrentCardIndex(0);
    setIsFlashcardFlipped(false);
    setFlippedTileIds([]);
    setMatchMoves(0);
    setMatchTiles(createMatchTiles(selectedPack));
  }, [selectedPack]);

  useEffect(() => {
    if (!speechSynthesisSupported) {
      return;
    }

    window.speechSynthesis.cancel();
    setIsPronouncing(false);

    return () => {
      window.speechSynthesis.cancel();
    };
  }, [currentCard, gameMode, pageView, speechSynthesisSupported]);

  const resetGameState = (packId: string) => {
    const nextPack =
      availablePacks.find((pack) => pack.id === packId) ?? availablePacks[0];

    if (!nextPack) {
      return;
    }

    setSelectedPackId(nextPack.id);
    setCurrentCardIndex(0);
    setIsFlashcardFlipped(false);
    setFlippedTileIds([]);
    setMatchMoves(0);
    setMatchTiles(createMatchTiles(nextPack));
  };

  const handleSelectMode = (mode: GameMode) => {
    setGameMode(mode);
    setPageView("home");
  };

  const handleOpenDetailPage = (mode: GameMode, packId: string) => {
    setGameMode(mode);
    resetGameState(packId);
    setPageView("detail");
  };

  const handleBackHome = () => {
    setPageView("home");
  };

  useEffect(() => {
    if (!availablePacks.some((pack) => pack.id === selectedPackId)) {
      const fallbackPack = availablePacks[0];

      if (fallbackPack) {
        resetGameState(fallbackPack.id);
      }
    }
  }, [availablePacks, selectedPackId]);

  const handlePrevious = () => {
    if (canGoBack) {
      setIsFlashcardFlipped(false);
      setCurrentCardIndex((index) => index - 1);
    }
  };

  const handleNext = () => {
    if (canGoForward) {
      setIsFlashcardFlipped(false);
      setCurrentCardIndex((index) => index + 1);
    }
  };

  const handleShuffleFlashcard = () => {
    if (selectedPack.cards.length < 2) {
      return;
    }

    let nextIndex = currentCardIndex;

    while (nextIndex === currentCardIndex) {
      nextIndex = Math.floor(Math.random() * selectedPack.cards.length);
    }

    setIsFlashcardFlipped(false);
    setCurrentCardIndex(nextIndex);
  };

  const handlePronounceCard = () => {
    if (!speechSynthesisSupported) {
      return;
    }

    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(currentCard.name);
    utterance.lang = "en-US";
    utterance.rate = 0.85;
    utterance.pitch = 1.05;
    utterance.onstart = () => {
      setIsPronouncing(true);
    };
    utterance.onend = () => {
      setIsPronouncing(false);
    };
    utterance.onerror = () => {
      setIsPronouncing(false);
    };

    window.speechSynthesis.speak(utterance);
  };

  const handleResetMatchGame = () => {
    setFlippedTileIds([]);
    setMatchMoves(0);
    setMatchTiles(createMatchTiles(selectedPack));
  };

  const handleFlipFlashcard = () => {
    setIsFlashcardFlipped((flipped) => !flipped);
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

    if (
      firstTile.pairId === secondTile.pairId &&
      firstTile.id !== secondTile.id
    ) {
      setMatchTiles((currentTiles) =>
        currentTiles.map((entry) =>
          entry.pairId === firstTile.pairId
            ? { ...entry, solved: true }
            : entry,
        ),
      );
      setFlippedTileIds([]);
      return;
    }

    window.setTimeout(() => {
      setFlippedTileIds([]);
    }, 700);
  };

  const renderGameContent = () => (
    <>
      <div className="section-heading">
        <h2>
          {selectedPack.title}{" "}
          {gameMode === "flashcards" ? "flashcards" : "pair game"}
        </h2>
        <p>
          {gameMode === "flashcards"
            ? ""
            : "Flip tiles and match the same emoji pair."}
        </p>
      </div>

      {gameMode === "flashcards" ? (
        <>
          <button
            className={`flashcard${isFlashcardFlipped ? " flipped" : ""}`}
            onClick={handleFlipFlashcard}
            type="button"
            aria-label={`Flip flashcard for ${currentCard.name}`}
          >
            <div className="flashcard-inner">
              <div className="flashcard-face flashcard-front">
                {currentCard.imageUrl ? (
                  <img
                    className="flashcard-image"
                    src={currentCard.imageUrl}
                    alt={currentCard.name}
                  />
                ) : (
                  <div className="flashcard-emoji" aria-hidden="true">
                    {currentCard.emoji}
                  </div>
                )}
                <div className="flashcard-face-note">Tap card to flip</div>
              </div>

              <div className="flashcard-face flashcard-back">
                <div className="flashcard-word">{currentCard.name}</div>
                <button
                  className="flashcard-audio-button"
                  onClick={(event) => {
                    event.stopPropagation();
                    handlePronounceCard();
                  }}
                  type="button"
                  disabled={!speechSynthesisSupported || isPronouncing}
                  aria-label={`Hear ${currentCard.name}`}
                >
                  <span aria-hidden="true">👂</span>
                  <span>Hear</span>
                </button>
                <div className="flashcard-audio-note">
                  {speechSynthesisSupported
                    ? "Tap Hear to play the word aloud."
                    : "Audio is not available in this browser."}
                </div>
              </div>
            </div>
          </button>

          <div className="flashcard-meta">
            <div className="flashcard-progress">
              Card {currentCardIndex + 1} of {selectedPack.cards.length}
            </div>
          </div>

          <div className="flashcard-actions">
            <button
              onClick={handlePrevious}
              type="button"
              disabled={!canGoBack}
              aria-label="Previous card"
            >
              ←
            </button>
            <button onClick={handleShuffleFlashcard} type="button">
              Shuffle
            </button>
            <button
              onClick={handleNext}
              type="button"
              disabled={!canGoForward}
              aria-label="Next card"
            >
              →
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
              const isFlipped = tile.solved || flippedTileIds.includes(tile.id);

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
    </>
  );

  return (
    <div className="app-shell">
      <header className="topbar">
        <div className="topbar-row">
          <div className="topbar-title-group">
            <p className="topbar-eyebrow">Little learners</p>
            <h1>
              {pageView === "home"
                ? currentSection.label
                : `${selectedPack.title} ${currentSection.label}`}
            </h1>
          </div>
          <div className="topbar-actions" aria-hidden="true"></div>
        </div>

        <nav className="section-menu" aria-label="Game sections">
          {sections.map((section) => (
            <button
              key={section.id}
              className={`section-tab${gameMode === section.id ? " active" : ""}`}
              onClick={() => handleSelectMode(section.id)}
              type="button"
            >
              {section.label}
            </button>
          ))}
        </nav>
      </header>

      {pageView === "home" ? (
        <main className="home-layout">
          <section className="card-grid-panel">
            <div className="home-card-grid">
              {availablePacks.map((pack) => {
                const footerLabel =
                  gameMode === "flashcards" ? "FLASH CARDS" : "PAIR GAMES";

                return (
                  <button
                    key={`${gameMode}-card-${pack.id}`}
                    className="home-card"
                    onClick={() => handleOpenDetailPage(gameMode, pack.id)}
                    type="button"
                  >
                    <div className={`home-card-body tint-${pack.id}`}>
                      <p className="home-card-kicker">{currentSection.label}</p>
                      <h3>{pack.title}</h3>
                      <div className="card-stack" aria-hidden="true">
                        {[
                          pack.cards[0],
                          pack.cards[1] ?? pack.cards[0],
                          pack.cards[2] ?? pack.cards[0],
                        ].map((card, index) => (
                          <span
                            key={`${pack.id}-${card.id}-${index}`}
                            className={`stack-card ${
                              index === 0
                                ? "stack-left"
                                : index === 1
                                  ? "stack-center"
                                  : "stack-right"
                            }`}
                          >
                            {card.imageUrl ? (
                              <img
                                className="stack-card-image"
                                src={card.imageUrl}
                                alt={card.name}
                              />
                            ) : (
                              card.emoji
                            )}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div className="home-card-footer">{footerLabel}</div>
                  </button>
                );
              })}
            </div>
          </section>
        </main>
      ) : (
        <main className="detail-layout">
          <section className="detail-panel">
            <div className="detail-topbar">
              <button
                className="back-button"
                onClick={handleBackHome}
                type="button"
              >
                ← Back
              </button>
              <div className="detail-pack-switcher">
                {availablePacks.map((pack) => (
                  <button
                    key={`detail-${pack.id}`}
                    className={`detail-pack-button${selectedPackId === pack.id ? " active" : ""}`}
                    onClick={() => resetGameState(pack.id)}
                    type="button"
                  >
                    {pack.title}
                  </button>
                ))}
              </div>
            </div>

            {renderGameContent()}
          </section>
        </main>
      )}
    </div>
  );
}
