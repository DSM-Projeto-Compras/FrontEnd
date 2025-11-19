import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import Button from "../../app/components/atoms/Button";

describe("Button component", () => {
  it("renders primary button by default", () => {
    render(<Button>Enviar</Button>);

    const button = screen.getByRole("button", { name: "Enviar" });

    expect(button).toBeInTheDocument();
    expect(button).toHaveClass("bg-blue-600");
    expect(button).toHaveAttribute("type", "button");
  });

  it("renders secondary button when variant='secondary'", () => {
    render(<Button variant="secondary">Cancelar</Button>);

    const button = screen.getByRole("button", { name: "Cancelar" });

    expect(button).toHaveClass("bg-white");
  });

  it("calls onClick when clicked", () => {
    const mockFn = jest.fn();
    render(<Button onClick={mockFn}>Clique</Button>);

    const button = screen.getByRole("button", { name: "Clique" });

    fireEvent.click(button);

    expect(mockFn).toHaveBeenCalledTimes(1);
  });

  it("uses submit type when provided", () => {
    render(<Button type="submit">Enviar</Button>);

    const button = screen.getByRole("button", { name: "Enviar" });

    expect(button).toHaveAttribute("type", "submit");
  });
});
