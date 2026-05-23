import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const siteUrl =
    process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/api/",
          "/login",
          "/registro",
          "/olvide-contrasena",
          "/restablecer-contrasena/",
          "/mis-mazos/",
          "/mis-cartas",
          "/perfil/",
          "/buscar-imagen",
        ],
      },
    ],
    sitemap: `${siteUrl}/sitemap.xml`,
  };
}
