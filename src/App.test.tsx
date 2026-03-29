import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import App from "./App";
import { appConfig } from "./lib/appConfig";

describe("App", () => {
  beforeEach(() => {
    window.localStorage.clear();
    Object.defineProperty(window, "SpeechSynthesisUtterance", {
      configurable: true,
      value: class {
        lang = "";
        pitch = 1;
        rate = 1;
        text: string;
        onstart: (() => void) | null = null;
        onend: (() => void) | null = null;
        onerror: (() => void) | null = null;

        constructor(text: string) {
          this.text = text;
        }
      },
    });
    Object.defineProperty(window, "speechSynthesis", {
      configurable: true,
      value: {
        cancel: vi.fn(),
        speak: vi.fn(),
      },
    });
  });

  afterEach(() => {
    cleanup();
  });

  it("shows colors as a normal playable pack", () => {
    render(<App />);

    expect(
      screen.getByRole("heading", { level: 1, name: "Emoji Flashcards" }),
    ).toBeInTheDocument();
    expect(screen.getByText("Colors")).toBeInTheDocument();
    expect(screen.queryByText("Shapes")).not.toBeInTheDocument();
  });

  it("opens colors directly without premium UI", async () => {
    render(<App />);

    fireEvent.click(screen.getAllByRole("button", { name: "Colors pack" })[0]);

    expect(
      await screen.findByRole("heading", { level: 1, name: /colors flashcards/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /flip flashcard for red/i }),
    ).toBeInTheDocument();
    expect(screen.queryByText(/unlock premium/i)).not.toBeInTheDocument();
  });

  it("keeps the hear button clickable after flipping a flashcard", async () => {
    const speak = vi.fn();

    Object.defineProperty(window, "speechSynthesis", {
      configurable: true,
      value: {
        cancel: vi.fn(),
        speak,
      },
    });

    render(<App />);

    fireEvent.click(screen.getAllByRole("button", { name: "Colors pack" })[0]);

    const flipButton = await screen.findByRole("button", {
      name: /flip flashcard for red/i,
    });

    fireEvent.click(flipButton);

    const hearButton = screen.getByRole("button", { name: /hear red/i });
    expect(hearButton).toBeEnabled();

    fireEvent.click(hearButton);

    expect(speak).toHaveBeenCalledTimes(1);
    expect(flipButton).toHaveAttribute("aria-pressed", "true");
  });

  it("keeps premium config disabled while purchase plumbing remains configured", () => {
    expect(appConfig.premiumUiEnabled).toBe(false);
    expect(appConfig.premiumDisplayPrice).toBe("$2.99");
  });
});
