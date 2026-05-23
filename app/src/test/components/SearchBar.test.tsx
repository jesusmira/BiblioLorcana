import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import SearchBar from "@/components/ui/SearchBar";

describe("SearchBar", () => {
  it("renderiza el input de búsqueda", () => {
    render(<SearchBar value="" onChange={vi.fn()} />);
    expect(screen.getByRole("searchbox")).toBeInTheDocument();
  });

  it("muestra el placeholder correcto", () => {
    render(<SearchBar value="" onChange={vi.fn()} />);
    expect(screen.getByPlaceholderText("Nombre o efecto")).toBeInTheDocument();
  });

  it("muestra el label de búsqueda", () => {
    render(<SearchBar value="" onChange={vi.fn()} />);
    expect(screen.getByText("Busqueda")).toBeInTheDocument();
  });

  it("refleja el valor pasado como prop", () => {
    render(<SearchBar value="Mickey" onChange={vi.fn()} />);
    expect(screen.getByRole("searchbox")).toHaveValue("Mickey");
  });

  it("llama a onChange al escribir", async () => {
    const onChange = vi.fn();
    render(<SearchBar value="" onChange={onChange} />);
    await userEvent.type(screen.getByRole("searchbox"), "Elsa");
    expect(onChange).toHaveBeenCalled();
  });
});
