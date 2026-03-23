import { useState } from "react";
import { packs } from "./data/packs";

const freePacks = packs.filter((pack) => !pack.locked);

export default function App() {
  const [selectedPackId, setSelectedPackId] = useState(freePacks[0]?.id ?? "");
  const [currentCardIndex, setCurrentCardIndex] = useState(0);

  const selectedPack =
    packs.find((pack) => pack.id === selectedPackId) ?? freePacks[0];

  const currentCard = selectedPack.cards[currentCardIndex];
  const canGoBack = currentCardIndex > 0;
  const canGoForward = currentCardIndex < selectedPack.cards.length - 1;

  const handleSelectPack = (packId: string) => {
    setSelectedPackId(packId);
    setCurrentCardIndex(0);
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

  return (
    <div className="app-shell">
      <header className="hero">
        <p className="eyebrow">Kid-friendly MVP</p>
        <h1>Playful first words for little learners</h1>
        <p className="hero-copy">
          A simple browser-first learning app with flashcards today and matching
          games next.
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
        </section>

        <section className="panel flashcard-panel">
          <div className="section-heading">
            <h2>{selectedPack.title} flashcards</h2>
            <p>
              Step through the first vertical slice of the app: pack selection
              and flashcard play.
            </p>
          </div>

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
        </section>

        <section className="panel roadmap-panel">
          <div className="section-heading">
            <h2>Next slices</h2>
            <p>Keep the roadmap visible, but do not build it yet.</p>
          </div>

          <ul className="roadmap-list">
            <li>Pair matching game using the same pack data</li>
            <li>Tap-to-hear pronunciation audio</li>
            <li>Premium unlock flow for extra packs</li>
            <li>iOS wrapper after web engagement is proven</li>
          </ul>
        </section>
      </main>
    </div>
  );
}
