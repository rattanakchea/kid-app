import { useEffect, useMemo, useState } from "react";
import { packs, type Card, type Pack } from "./data/packs";
import { appConfig } from "./lib/appConfig";
import {
  loadPremiumProducts,
  refreshEntitlements,
  type PremiumProduct,
} from "./lib/premiumUnlock";

const matchTileCount = 6;

type GameMode = "flashcards" | "match";
type PageView = "home" | "detail";

type MatchTile = {
  id: string;
  pairId: string;
  card: Card;
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

function createMatchTiles(pack: Pack): MatchTile[] {
  return shuffleTiles(
    pack.cards.slice(0, matchTileCount).flatMap((card) => [
      {
        id: `${card.id}-a`,
        pairId: card.id,
        card,
        solved: false,
      },
      {
        id: `${card.id}-b`,
        pairId: card.id,
        card,
        solved: false,
      },
    ]),
  );
}

function CardVisual({
  card,
  className = "",
  decorative = false,
}: {
  card: Card;
  className?: string;
  decorative?: boolean;
}) {
  if (card.swatch) {
    return (
      <svg
        className={`card-swatch ${className}`.trim()}
        viewBox="0 0 100 100"
        role={decorative ? undefined : "img"}
        aria-hidden={decorative ? "true" : undefined}
        aria-label={decorative ? undefined : `${card.name} color`}
      >
        <rect
          x="10"
          y="10"
          width="80"
          height="80"
          rx="22"
          fill={card.swatch.fill}
          stroke={card.swatch.stroke ?? "transparent"}
          strokeWidth="6"
        />
      </svg>
    );
  }

  if (card.imageUrl) {
    return (
      <img
        className={className}
        src={card.imageUrl}
        alt={decorative ? "" : card.name}
        aria-hidden={decorative ? "true" : undefined}
      />
    );
  }

  return (
    <div className={className} aria-hidden="true">
      {card.emoji}
    </div>
  );
}

function buildPackState(pack: Pack, hasPremiumAccess: boolean) {
  const premiumActive = appConfig.premiumUiEnabled;
  const requiresPremium = premiumActive && Boolean(pack.requiresPremium);
  const comingSoon = pack.cards.length === 0;
  const locked = requiresPremium && !hasPremiumAccess;
  const playable = !comingSoon && !locked;

  return { requiresPremium, comingSoon, locked, playable };
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
  const [hasPremiumAccess, setHasPremiumAccess] = useState(false);
  const [premiumProduct, setPremiumProduct] = useState<PremiumProduct | null>(
    null,
  );

  const speechSynthesisSupported =
    typeof window !== "undefined" && "speechSynthesis" in window;
  const [isPronouncing, setIsPronouncing] = useState(false);

  const visiblePacks = useMemo(
    () => packs.filter((pack) => !pack.modes || pack.modes.includes(gameMode)),
    [gameMode],
  );

  const playablePacks = useMemo(
    () =>
      visiblePacks.filter(
        (pack) => buildPackState(pack, hasPremiumAccess).playable,
      ),
    [hasPremiumAccess, visiblePacks],
  );

  const selectedPack =
    playablePacks.find((pack) => pack.id === selectedPackId) ??
    playablePacks[0];

  const currentSection =
    sections.find((section) => section.id === gameMode) ?? sections[0];

  const currentCard = selectedPack?.cards[currentCardIndex];
  const canGoBack = currentCardIndex > 0;
  const canGoForward =
    selectedPack && currentCardIndex < selectedPack.cards.length - 1;
  const solvedCount = matchTiles.filter((tile) => tile.solved).length;
  const matchComplete =
    solvedCount === matchTiles.length && matchTiles.length > 0;

  useEffect(() => {
    const loadStoreState = async () => {
      try {
        const [products, entitlement] = await Promise.all([
          loadPremiumProducts(),
          refreshEntitlements(),
        ]);

        setPremiumProduct(products[0] ?? null);
        setHasPremiumAccess(entitlement.hasPremiumAccess);
      } catch {
        setPremiumProduct(null);
      }
    };

    void loadStoreState();
  }, []);

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
    if (!selectedPack && playablePacks[0]) {
      setSelectedPackId(playablePacks[0].id);
      setPageView("home");
    }
  }, [playablePacks, selectedPack]);

  useEffect(() => {
    if (!speechSynthesisSupported || !currentCard) {
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
      playablePacks.find((pack) => pack.id === packId) ?? playablePacks[0];

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

  const handleOpenPack = (pack: Pack) => {
    resetGameState(pack.id);
    setPageView("detail");
  };

  const handleBackHome = () => {
    setPageView("home");
  };

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
    if (!selectedPack || selectedPack.cards.length < 2) {
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
    if (!speechSynthesisSupported || !currentCard) {
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
    if (!selectedPack) {
      return;
    }

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

  const renderGameContent = () => {
    if (!selectedPack || !currentCard) {
      return (
        <div className="empty-state">
          <h2>More packs are coming soon</h2>
          <p>
            Free packs are ready now, and more content will appear here as it
            ships.
          </p>
        </div>
      );
    }

    return (
      <>
        <div className="section-heading">
          <h2>
            {selectedPack.title}{" "}
            {gameMode === "flashcards" ? "flashcards" : "pair game"}
          </h2>
          <p>
            {gameMode === "flashcards"
              ? "Tap the card to flip between picture and word."
              : "Flip tiles and match the same color or picture pair."}
          </p>
        </div>

        {gameMode === "flashcards" ? (
          <>
            <div
              className={`flashcard${isFlashcardFlipped ? " flipped" : ""}`}
              onClick={handleFlipFlashcard}
              onKeyDown={(event) => {
                if (event.key === "Enter" || event.key === " ") {
                  event.preventDefault();
                  handleFlipFlashcard();
                }
              }}
              role="button"
              tabIndex={0}
              aria-label={`Flip flashcard for ${currentCard.name}`}
            >
              <div className="flashcard-inner">
                <div className="flashcard-face flashcard-front">
                  <CardVisual
                    card={currentCard}
                    className={
                      currentCard.swatch
                        ? "flashcard-swatch"
                        : currentCard.imageUrl
                          ? "flashcard-image"
                          : "flashcard-emoji"
                    }
                  />
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
            </div>

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
                const isFlipped =
                  tile.solved || flippedTileIds.includes(tile.id);

                return (
                  <button
                    key={tile.id}
                    className={`match-tile${isFlipped ? " flipped" : ""}`}
                    onClick={() => handleTileClick(tile.id)}
                    type="button"
                    disabled={tile.solved}
                    aria-label={
                      tile.solved ? `${tile.card.name} matched` : "Hidden tile"
                    }
                  >
                    <span className="match-tile-face match-tile-front">?</span>
                    <span className="match-tile-face match-tile-back">
                      <CardVisual
                        card={tile.card}
                        className={
                          tile.card.swatch
                            ? "match-tile-swatch"
                            : tile.card.imageUrl
                              ? "match-tile-image"
                              : "match-tile-emoji"
                        }
                        decorative
                      />
                    </span>
                  </button>
                );
              })}
            </div>

            <div className="match-footer">
              <p>
                Find the two matching pairs. The board resets when you change
                packs.
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
  };

  const renderHome = () => (
    <main className="home-layout">
      <section className="card-grid-panel">
        <div className="home-card-grid">
          {playablePacks.map((pack) => {
            const footerLabel =
              gameMode === "flashcards" ? "FLASH CARDS" : "PAIR GAMES";
            const previewCards =
              pack.cards.length > 0
                ? [
                    pack.cards[0],
                    pack.cards[1] ?? pack.cards[0],
                    pack.cards[2] ?? pack.cards[0],
                  ]
                : [];

            return (
              <button
                key={`${gameMode}-card-${pack.id}`}
                className="home-card"
                onClick={() => handleOpenPack(pack)}
                type="button"
                aria-label={`${pack.title} pack`}
              >
                <div className={`home-card-body tint-${pack.id}`}>
                  <div className="home-card-header">
                    <p className="home-card-kicker">{currentSection.label}</p>
                  </div>
                  <h3>{pack.title}</h3>
                  <p className="home-card-description">{pack.description}</p>
                  <div className="card-stack" aria-hidden="true">
                    {previewCards.length > 0 ? (
                      previewCards.map((card, index) => (
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
                          <CardVisual
                            card={card}
                            className={
                              card.swatch
                                ? "stack-card-swatch"
                                : card.imageUrl
                                  ? "stack-card-image"
                                  : "stack-card-emoji"
                            }
                            decorative
                          />
                        </span>
                      ))
                    ) : (
                      <div className="coming-soon-card">More soon</div>
                    )}
                  </div>
                </div>
                <div className="home-card-footer">{footerLabel}</div>
              </button>
            );
          })}
        </div>
      </section>
    </main>
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
                : `${selectedPack?.title ?? "Packs"} ${currentSection.label}`}
            </h1>
          </div>
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
        renderHome()
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
                {playablePacks.map((pack) => (
                  <button
                    key={`detail-${pack.id}`}
                    className={`detail-pack-button${selectedPackId === pack.id ? " active" : ""}`}
                    onClick={() => resetGameState(pack.id)}
                    type="button"
                    aria-label={`Switch to ${pack.title}`}
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
