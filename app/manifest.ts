import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "DevX — Red social para desarrolladores",
    short_name: "DevX",
    description:
      "Red social para desarrolladores: comparte código, proyectos, preguntas, tutoriales y noticias.",
    start_url: "/",
    display: "standalone",
    background_color: "#000000",
    theme_color: "#0ea5e9",
    icons: [
      { src: "/icon-192.png", sizes: "192x192", type: "image/png" },
      { src: "/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
  };
}