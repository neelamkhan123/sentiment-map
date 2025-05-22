import type { Route } from "./+types/home";
import WorldMap from "~/dashboard/WorldMap";

export function meta({}: Route.MetaArgs) {
  return [{ title: "Sentiment Map" }];
}

export default function Home() {
  return <WorldMap />;
}
