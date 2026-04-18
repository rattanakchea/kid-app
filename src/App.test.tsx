import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import App from "./App";
import { appConfig } from "./lib/appConfig";

describe("App", () => {
  beforeEach(() => {
    const storage = new Map<string, string>();

    Object.defineProperty(window, "localStorage", {
      configurable: true,
      value: {
        getItem: vi.fn((key: string) => storage.get(key) ?? null),
        setItem: vi.fn((key: string, value: string) => {
          storage.set(key, value);
        }),
        removeItem: vi.fn((key: string) => {
          storage.delete(key);
        }),
        clear: vi.fn(() => {
          storage.clear();
        }),
      },
    });

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

    Object.defineProperty(window, "open", {
      configurable: true,
      value: vi.fn(),
    });
  });

  afterEach(() => {
    cleanup();
  });

  it("shows all available packs without locked placeholders", () => {
    render(<App />);

    expect(screen.getByText(appConfig.appName)).toBeInTheDocument();
    expect(screen.getByText("First Words")).toBeInTheDocument();
    expect(screen.getByText("Animals")).toBeInTheDocument();
    expect(screen.getByText("Fruits")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Colors pack" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Shapes pack" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Parts of Body pack" })).toBeInTheDocument();
  });

  it("does not show locked labels or full-version messaging on the home screen", () => {
    render(<App />);

    expect(screen.queryByText(/full version/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/ask a parent/i)).not.toBeInTheDocument();
    expect(screen.queryByLabelText(/locked pack/i)).not.toBeInTheDocument();
  });

  it("shows animals in pair games and opens the matching board", async () => {
    render(<App />);

    fireEvent.click(screen.getByRole("button", { name: "Pair Games" }));
    fireEvent.click(screen.getAllByRole("button", { name: "Animals pack" })[0]);

    expect(
      await screen.findByRole("heading", { level: 1, name: /animals pair game/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        (_, element) => element?.textContent === "Animals matching board",
      ),
    ).toBeInTheDocument();
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

    fireEvent.click(screen.getAllByRole("button", { name: "Animals pack" })[0]);

    const flipButton = await screen.findByRole("button", {
      name: /flip flashcard for lion/i,
    });

    fireEvent.click(flipButton);

    const hearButton = screen.getByRole("button", { name: /hear lion/i });
    expect(hearButton).toBeEnabled();

    fireEvent.click(hearButton);

    expect(speak).toHaveBeenCalledTimes(1);
    expect(flipButton).toHaveAttribute("aria-pressed", "true");
  });

  it("keeps premium config disabled while purchase plumbing remains configured", () => {
    expect(appConfig.premiumUiEnabled).toBe(false);
    expect(appConfig.appId).toBe("com.rattanakchea.kidgames.free");
    expect(appConfig.premiumDisplayPrice).toBe(String.fromCharCode(36) + "2.99");
  });
});
