export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full border-t border-[var(--stroke)]/20 bg-[var(--bg)]">
      <div className="mx-auto flex w-full max-w-screen-2xl flex-col items-center justify-center py-16 space-y-10 px-4">
        <div
          className="text-2xl font-serif tracking-tighter text-[var(--accent-strong)] drop-shadow-[0_0_8px_rgba(233,179,98,0.2)]"
          style={{ fontFamily: "var(--font-title)", fontStyle: "italic" }}
        >
          Archivo del Reino
        </div>

        <div className="flex flex-wrap justify-center gap-12 font-light tracking-widest text-xs uppercase">
          <a
            href="/privacidad"
            className="text-[var(--muted)]/40 transition-opacity hover:text-[var(--accent)]"
          >
            Privacidad
          </a>
          <a
            href="/terminos"
            className="text-[var(--muted)]/40 transition-opacity hover:text-[var(--accent)]"
          >
            Términos del Archivo
          </a>
          <a
            href="/contacto"
            className="text-[var(--muted)]/40 transition-opacity hover:text-[var(--accent)]"
          >
            Contacto Real
          </a>
        </div>

        <div className="font-light tracking-widest text-xs uppercase text-[var(--accent)] opacity-60">
          © {currentYear} Archivo del Reino de Lorcana. El Cronista Real
          preserva estas memorias. Hecho con ❤️ en España
        </div>
        <p className="text-xs text-muted-foreground text-[var(--accent)] opacity-60">
          Lorcana es una marca registrada de Disney. ⚠️ Fan project · Este sitio
          no está afiliado con Disney o Ravensburger.
        </p>
      </div>
    </footer>
  );
}
