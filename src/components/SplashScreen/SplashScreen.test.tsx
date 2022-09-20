import { render, screen } from "@testing-library/react";

import SplashScreen from "./SplashScreen";

describe("Rendering", () => {
  test("Renders succesfully", () => {
    render(<SplashScreen />);
    const title = screen.getByText(/risk/i)
    expect(title).toBeInTheDocument()
  });
});
