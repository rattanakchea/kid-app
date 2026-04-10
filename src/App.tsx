import { startTransition, useEffect, useMemo, useRef, useState } from "react";
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
  const promoOnly = Boolean(pack.promoOnly);
  const comingSoon = pack.cards.length === 0;
  const locked = promoOnly || (requiresPremium && !hasPremiumAccess);
  const playable = !comingSoon && !locked;

  return { requiresPremium, promoOnly, comingSoon, locked, playable };
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
  const [, setPremiumProduct] = useState<PremiumProduct | null>(null);
  const [promoPack, setPromoPack] = useState<Pack | null>(null);
  const [showParentGate, setShowParentGate] = useState(false);
  const [parentGateValue, setParentGateValue] = useState("");
  const [parentGateError, setParentGateError] = useState("");
  const touchStartXRef = useRef<number | null>(null);
  const touchStartYRef = useRef<number | null>(null);
  const suppressFlashcardTapRef = useRef(false);
  const flipBackTimeoutRef = useRef<number | null>(null);

  const speechSynthesisSupported =
    typeof window !== "undefined" && "speechSynthesis" in window;
  const [isPronouncing, setIsPronouncing] = useState(false);

  const visiblePacks = useMemo(
    () => packs.filter((pack) => !pack.modes || pack.modes.includes(gameMode)),
    [gameMode],
  );

  const packStates = useMemo(
    () =>
      visiblePacks.map((pack) => ({
        pack,
        state: buildPackState(pack, hasPremiumAccess),
      })),
    [hasPremiumAccess, visiblePacks],
  );

  const playablePacks = useMemo(
    () =>
      packStates.filter(({ state }) => state.playable).map(({ pack }) => pack),
    [packStates],
  );

  const lockedPromoPacks = useMemo(
    () =>
      packStates.filter(({ state }) => state.promoOnly).map(({ pack }) => pack),
    [packStates],
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

    resetPackProgress(selectedPack);
  }, [selectedPack]);

  useEffect(() => {
    if (!selectedPack && playablePacks[0]) {
      setSelectedPackId(playablePacks[0].id);
      setPageView("home");
    }
  }, [playablePacks, selectedPack]);

  useEffect(() => {
    return () => {
      if (flipBackTimeoutRef.current !== null) {
        window.clearTimeout(flipBackTimeoutRef.current);
      }
    };
  }, []);

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

  const clearPendingFlipBack = () => {
    if (flipBackTimeoutRef.current !== null) {
      window.clearTimeout(flipBackTimeoutRef.current);
      flipBackTimeoutRef.current = null;
    }
  };

  const resetPackProgress = (pack: Pack) => {
    clearPendingFlipBack();
    setCurrentCardIndex(0);
    setIsFlashcardFlipped(false);
    setFlippedTileIds([]);
    setMatchMoves(0);
    setMatchTiles(createMatchTiles(pack));
  };

  const resetGameState = (packId: string) => {
    const nextPack =
      playablePacks.find((pack) => pack.id === packId) ?? playablePacks[0];

    if (!nextPack) {
      return;
    }

    startTransition(() => {
      setSelectedPackId(nextPack.id);
    });
    resetPackProgress(nextPack);
  };

  const handleSelectMode = (mode: GameMode) => {
    startTransition(() => {
      setGameMode(mode);
      setPageView("home");
    });
  };

  const handleOpenPack = (pack: Pack) => {
    const packState = buildPackState(pack, hasPremiumAccess);

    if (packState.promoOnly) {
      setPromoPack(pack);
      setShowParentGate(false);
      setParentGateValue("");
      setParentGateError("");
      return;
    }

    resetGameState(pack.id);
    startTransition(() => {
      setPageView("detail");
    });
  };

  const handleBackHome = () => {
    setPageView("home");
  };

  const handleClosePromoModal = () => {
    setPromoPack(null);
    setShowParentGate(false);
    setParentGateValue("");
    setParentGateError("");
  };

  const handleContinueToParentGate = () => {
    setShowParentGate(true);
    setParentGateValue("");
    setParentGateError("");
  };

  const handleOpenFullVersion = () => {
    if (parentGateValue.trim().toUpperCase() !== appConfig.parentGateAnswer) {
      setParentGateError("Please ask a parent to type the confirmation word.");
      return;
    }

    window.open(
      appConfig.fullVersionAppStoreUrl,
      "_blank",
      "noopener,noreferrer",
    );
    handleClosePromoModal();
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

    clearPendingFlipBack();
    setFlippedTileIds([]);
    setMatchMoves(0);
    setMatchTiles(createMatchTiles(selectedPack));
  };

  const handleFlipFlashcard = () => {
    setIsFlashcardFlipped((flipped) => !flipped);
  };

  const handleFlashcardTouchStart = (event: React.TouchEvent<HTMLElement>) => {
    const touch = event.changedTouches[0];
    touchStartXRef.current = touch.clientX;
    touchStartYRef.current = touch.clientY;
  };

  const handleFlashcardTouchEnd = (event: React.TouchEvent<HTMLElement>) => {
    const touch = event.changedTouches[0];
    const startX = touchStartXRef.current;
    const startY = touchStartYRef.current;

    touchStartXRef.current = null;
    touchStartYRef.current = null;

    if (startX === null || startY === null) {
      return;
    }

    const deltaX = touch.clientX - startX;
    const deltaY = touch.clientY - startY;
    const swipeThreshold = 50;

    if (
      Math.abs(deltaX) < swipeThreshold ||
      Math.abs(deltaY) > Math.abs(deltaX)
    ) {
      return;
    }

    if (deltaX < 0 && canGoForward) {
      suppressFlashcardTapRef.current = true;
      handleNext();
      return;
    }

    if (deltaX > 0 && canGoBack) {
      suppressFlashcardTapRef.current = true;
      handlePrevious();
    }
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

    clearPendingFlipBack();
    flipBackTimeoutRef.current = window.setTimeout(() => {
      setFlippedTileIds([]);
      flipBackTimeoutRef.current = null;
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
          <h1>
            {selectedPack.title}{" "}
            {gameMode === "flashcards" ? "flashcards" : "pair game"}
          </h1>
          <p>
            {gameMode === "flashcards"
              ? "Tap the card to flip between picture and word. Swipe left or right to change cards."
              : "Flip tiles and match the same color or picture pair."}
          </p>
        </div>

        {gameMode === "flashcards" ? (
          <>
            <div className={`flashcard${isFlashcardFlipped ? " flipped" : ""}`}>
              <button
                className="flashcard-toggle"
                onClick={() => {
                  if (suppressFlashcardTapRef.current) {
                    suppressFlashcardTapRef.current = false;
                    return;
                  }

                  handleFlipFlashcard();
                }}
                onTouchStart={handleFlashcardTouchStart}
                onTouchEnd={handleFlashcardTouchEnd}
                type="button"
                aria-label={`Flip flashcard for ${currentCard.name}`}
                aria-pressed={isFlashcardFlipped}
              />
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

            <div className="flashcard-meta" aria-live="polite">
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
            <div className="match-status" aria-live="polite">
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
              <div className="match-success" aria-live="polite">
                Nice work. You matched every pair in {matchMoves} moves.
              </div>
            ) : null}
          </>
        )}
      </>
    );
  };

  const renderHome = () => (
    <main className="home-layout" id="main-content">
      {/* <section className="hero-panel" aria-labelledby="app-title">
        <p className="topbar-eyebrow">Playful learning for toddlers</p>
        <h1 id="app-title">Emoji Flashcards</h1>
        <p className="hero-copy">
          Pick a pack, flip through big visual cards, or switch to a quick
          matching game.
        </p>
      </section> */}

      <section className="card-grid-panel">
        <div className="home-card-grid">
          {[...playablePacks, ...lockedPromoPacks].map((pack) => {
            const packState = buildPackState(pack, hasPremiumAccess);
            const footerLabel = packState.promoOnly
              ? "FULL VERSION"
              : gameMode === "flashcards"
                ? "FLASH CARDS"
                : "PAIR GAMES";
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
                className={`home-card${packState.promoOnly ? " locked" : ""}`}
                onClick={() => handleOpenPack(pack)}
                type="button"
                aria-label={`${pack.title} pack${packState.promoOnly ? ", locked" : ""}`}
              >
                <div className={`home-card-body tint-${pack.id}`}>
                  <div className="home-card-header">
                    <p className="home-card-kicker">
                      {gameMode === "flashcards" ? "Flashcards" : "Pair Games"}
                    </p>
                    {packState.promoOnly ? (
                      <span className="home-card-badge">Locked</span>
                    ) : null}
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
      <a className="skip-link" href="#main-content">
        Skip to content
      </a>

      <header className="topbar">
        <div className="topbar-row">
          <p className="topbar-summary">
            <strong>{appConfig.appName}</strong>
          </p>
        </div>

        <nav className="section-menu" aria-label="Game sections">
          {sections.map((section) => (
            <button
              key={section.id}
              className={`section-tab${gameMode === section.id ? " active" : ""}`}
              onClick={() => handleSelectMode(section.id)}
              type="button"
              aria-pressed={gameMode === section.id}
            >
              {section.label}
            </button>
          ))}
        </nav>
      </header>

      {pageView === "home" ? (
        renderHome()
      ) : (
        <main className="detail-layout" id="main-content">
          <section className="detail-panel">
            <div className="detail-topbar">
              <button
                className="back-button"
                onClick={handleBackHome}
                type="button"
              >
                ← Back
              </button>
            </div>

            {renderGameContent()}
          </section>
        </main>
      )}

      {promoPack ? (
        <div className="gate-overlay" role="presentation">
          <section
            className="gate-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="locked-pack-title"
          >
            {!showParentGate ? (
              <>
                <p className="premium-kicker">Full Version</p>
                <h2 id="locked-pack-title">{promoPack.title} is locked</h2>
                <p>
                  {promoPack.title} is available in the full version of the app.
                  This free edition includes starter packs only.
                </p>
                <p>
                  Ask a parent if you want to open the App Store page for the
                  full version.
                </p>
                <div className="gate-actions">
                  <button onClick={handleClosePromoModal} type="button">
                    Not now
                  </button>
                  <button onClick={handleContinueToParentGate} type="button">
                    Ask a parent
                  </button>
                </div>
              </>
            ) : (
              <>
                <p className="premium-kicker">Parents Only</p>
                <h2 id="locked-pack-title">Open the full version</h2>
                <p>
                  To continue, type{" "}
                  <strong>{appConfig.parentGateAnswer}</strong> below and then
                  open the App Store page.
                </p>
                <input
                  className="gate-input"
                  value={parentGateValue}
                  onChange={(event) => {
                    setParentGateValue(event.target.value);
                    setParentGateError("");
                  }}
                  placeholder="Type the confirmation word"
                  aria-label="Parent confirmation word"
                />
                {parentGateError ? (
                  <p className="gate-error" aria-live="assertive">
                    {parentGateError}
                  </p>
                ) : null}
                <div className="gate-actions">
                  <button onClick={handleClosePromoModal} type="button">
                    Cancel
                  </button>
                  <button onClick={handleOpenFullVersion} type="button">
                    Open full version
                  </button>
                </div>
              </>
            )}
          </section>
        </div>
      ) : null}
    </div>
  );
}
