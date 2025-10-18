import { usePetState } from "../state/usePetState";

export default function Pet() {
  const pet = usePetState();

  const moodEmoji =
    pet.happiness > 70
      ? "🌕"
      : pet.happiness > 40
      ? "🌓"
      : "🌑";

  return (
    <div className="flex flex-col items-center space-y-2">
      <div className="text-7xl">{moodEmoji}</div>
      <div className="text-sm text-gray-600">
        Happiness: {pet.happiness} | Growth: {pet.growth} | Energy: {pet.energy}
      </div>
    </div>
  );
}
