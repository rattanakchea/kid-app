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

    fireEvent.click(screen.getAllByRole("button", { name: "Colors premium pack" })[0]);

    expect(await screen.findByText(/unlock premium themed packs/i)).toBeInTheDocument();
  });

  it("requires the parent gate before opening the parent area", async () => {
    render(<App />);

    fireEvent.click(screen.getAllByRole("button", { name: "Parents" })[0]);

    expect(await screen.findByRole("dialog")).toBeInTheDocument();
    expect(screen.getByText(/adult check:/i)).toBeInTheDocument();
  });
});
