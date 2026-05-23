import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Button } from "@/components/ui/Button";

describe("Button", () => {
  it("renderiza el texto del children", () => {
    render(<Button>Guardar mazo</Button>);
    expect(screen.getByRole("button", { name: "Guardar mazo" })).toBeInTheDocument();
  });

  it("aplica la variante solid por defecto", () => {
    render(<Button>Texto</Button>);
    const btn = screen.getByRole("button");
    expect(btn.className).toContain("bg-[var(--accent)]");
  });

  it("aplica la variante ghost cuando se indica", () => {
    render(<Button variant="ghost">Texto</Button>);
    const btn = screen.getByRole("button");
    expect(btn.className).toContain("bg-transparent");
  });

  it("llama al onClick al hacer clic", async () => {
    const onClick = vi.fn();
    render(<Button onClick={onClick}>Clic</Button>);
    await userEvent.click(screen.getByRole("button"));
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it("está deshabilitado y no dispara onClick cuando disabled=true", async () => {
    const onClick = vi.fn();
    render(<Button disabled onClick={onClick}>Deshabilitado</Button>);
    const btn = screen.getByRole("button");

    expect(btn).toBeDisabled();
    await userEvent.click(btn);
    expect(onClick).not.toHaveBeenCalled();
  });

  it("acepta className adicional", () => {
    render(<Button className="mi-clase-extra">Texto</Button>);
    expect(screen.getByRole("button").className).toContain("mi-clase-extra");
  });
});
