import { fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it } from "vitest";
import App from "./App";
import { appConfig } from "./lib/appConfig";

describe("App", () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it("shows colors as a normal playable pack", () => {
    render(<App />);

    expect(screen.getByText("Colors")).toBeInTheDocument();
    expect(screen.queryByText("Shapes")).not.toBeInTheDocument();
  });

  it("opens colors directly without premium UI", async () => {
    render(<App />);

    fireEvent.click(screen.getAllByRole("button", { name: "Colors pack" })[0]);

    expect(await screen.findByText(/colors flashcards/i)).toBeInTheDocument();
    expect(screen.queryByText(/unlock premium/i)).not.toBeInTheDocument();
  });

  it("keeps premium config disabled while purchase plumbing remains configured", () => {
    expect(appConfig.premiumUiEnabled).toBe(false);
    expect(appConfig.premiumDisplayPrice).toBe("$2.99");
  });
});
