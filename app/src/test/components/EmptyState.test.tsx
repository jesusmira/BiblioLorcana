import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import EmptyState from "@/components/ui/EmptyState";

describe("EmptyState", () => {
  it("renderiza el título y la descripción", () => {
    render(<EmptyState title="Sin mazos" description="Crea tu primer mazo" />);
    expect(screen.getByText("Sin mazos")).toBeInTheDocument();
    expect(screen.getByText("Crea tu primer mazo")).toBeInTheDocument();
  });

  it("renderiza el icono cuando se proporciona", () => {
    render(
      <EmptyState
        title="Sin cartas"
        description="No hay cartas"
        icon={<span data-testid="icono">★</span>}
      />
    );
    expect(screen.getByTestId("icono")).toBeInTheDocument();
  });

  it("no renderiza el contenedor de icono cuando no se proporciona", () => {
    render(<EmptyState title="Sin cartas" description="No hay cartas" />);
    expect(screen.queryByTestId("icono")).not.toBeInTheDocument();
  });

  it("renderiza la acción cuando se proporciona", () => {
    render(
      <EmptyState
        title="Sin mazos"
        description="Crea uno"
        action={<button>Crear mazo</button>}
      />
    );
    expect(screen.getByRole("button", { name: "Crear mazo" })).toBeInTheDocument();
  });

  it("aplica className adicional al contenedor", () => {
    const { container } = render(
      <EmptyState title="T" description="D" className="clase-extra" />
    );
    expect(container.firstChild).toHaveClass("clase-extra");
  });
});
