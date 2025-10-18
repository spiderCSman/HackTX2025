import { useState, useEffect } from "react";
import purchases from "../data/purchases.json";

export function usePetState() {
  const [pet, setPet] = useState({ happiness: 50, growth: 50, energy: 50 });

  useEffect(() => {
    let mood = { happiness: 50, growth: 50, energy: 50 };

    purchases.forEach((p) => {
      const desc = p.description.toLowerCase();
      if (desc.includes("coffee") || desc.includes("dinner")) mood.happiness += 5;
      if (desc.includes("rent") || desc.includes("subscription")) mood.energy -= 5;
      if (desc.includes("deposit") || desc.includes("savings")) mood.growth += 8;
      if (p.amount > 100) mood.energy -= 3;
      if (desc.includes("movie")) mood.happiness += 4;
    });

    Object.keys(mood).forEach((k) => (mood[k] = Math.max(0, Math.min(100, mood[k]))));
    setPet(mood);
  }, []);

  return pet;
}
