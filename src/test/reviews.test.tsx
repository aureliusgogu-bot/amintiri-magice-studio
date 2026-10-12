import { render, screen, cleanup } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { ReviewCard } from "@/features/reviews/reviews";

afterEach(cleanup);
const review = {
  author: "Client de test",
  event: "Nuntă și botez",
  quote:
    "Prima parte a recenziei.\n\nTextul complet rămâne exact la fel, inclusiv toate rândurile și semnele: ♥!",
};

describe("Review cards", () => {
  it("keeps exact text, author and event in compact cards", () => {
    const { container } = render(<ReviewCard review={review} variant="compact" />);
    expect(container.querySelector("blockquote")?.textContent).toBe(review.quote);
    expect(container.querySelector("blockquote")).toHaveClass("line-clamp-5");
    expect(screen.getByText(review.author)).toBeVisible();
    expect(screen.getByText(review.event)).toBeVisible();
    expect(screen.getByRole("button", { name: "Citește mai mult" })).toBeVisible();
  });
  it("does not truncate full-page review text", () => {
    const { container } = render(<ReviewCard review={review} />);
    expect(container.querySelector("blockquote")?.textContent).toBe(review.quote);
    expect(container.querySelector("blockquote")).not.toHaveClass("line-clamp-5");
    expect(screen.queryByRole("button", { name: "Citește mai mult" })).not.toBeInTheDocument();
  });
});
