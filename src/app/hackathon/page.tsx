import { permanentRedirect } from "next/navigation";

export default function HackathonPage() {
  permanentRedirect("/retreats/retreat-001/rules#hackathon");
}
