import Link from "next/link";

export interface NavLink {
  href: string;
  label: string;
}

export const HEADER_NAV_LINKS: NavLink[] = [
  { href: "/", label: "Galeria" },
  { href: "/como-jugar", label: "Como jugar" },
];

export const HEADER_NAV_LINKS_MOBILE: NavLink[] = [
  { href: "/", label: "Galeria" },
  { href: "/como-jugar", label: "Como jugar" },
  { href: "/mis-cartas", label: "Mis cartas" },
  { href: "/mis-mazos", label: "Mis mazos" },
  { href: "/perfil", label: "Mi perfil" },
];
