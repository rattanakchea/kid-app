import { fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it } from "vitest";
import App from "./App";

describe("App", () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it("shows premium packs on the home screen", () => {
    render(<App />);

    expect(screen.getByText("Colors")).toBeInTheDocument();
    expect(screen.getByText("Shapes")).toBeInTheDocument();
  });

  it("opens the premium upsell for locked packs", async () => {
    render(<App />);

    fireEvent.click(screen.getAllByRole("button", { name: /colors/i })[0]);

    expect(await screen.findByText(/unlock premium themed packs/i)).toBeInTheDocument();
  });
});
