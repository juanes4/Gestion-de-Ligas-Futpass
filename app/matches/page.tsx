import { redirect } from "next/navigation"

// El calendario público vive ahora en la portada.
export default function MatchesPage() {
  redirect("/#calendario")
}
