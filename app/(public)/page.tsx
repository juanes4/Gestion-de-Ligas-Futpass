import type { Metadata } from "next"
import { Barlow_Condensed } from "next/font/google"
import { PublicHome } from "@/components/public/public-home"

const display = Barlow_Condensed({
  subsets: ["latin"],
  weight: ["600", "700", "800"],
  variable: "--font-display-face",
})

export const metadata: Metadata = {
  title: "FootPass · Copa oficial",
  description: "Resultados, partidos destacados, calendario y clasificación de la copa.",
}

export default function InicioPage() {
  return (
    <div className={display.variable}>
      <PublicHome />
    </div>
  )
}
