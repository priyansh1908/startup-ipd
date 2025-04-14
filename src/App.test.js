import { render, screen } from "@testing-library/react";
import App from "./App";
import { MemoryRouter } from "react-router-dom";

test("renders HomePage by default", () => {
  render(
    <MemoryRouter>
      <App />
    </MemoryRouter>
  );
  const heading = screen.getByText(/Welcome to Your/i);
  expect(heading).toBeInTheDocument();
});

test("renders StartupPage on /startup route", () => {
  render(
    <MemoryRouter initialEntries={["/startup"]}>
      <App />
    </MemoryRouter>
  );
  const heading = screen.getByText(/Welcome to Your Startup Dashboard!/i);
  expect(heading).toBeInTheDocument();
});