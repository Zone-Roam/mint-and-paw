import ClawMachine from "@/components/ClawMachine";
import Hero from "@/components/Hero";
import { PetWall, ToyOfTheMonth } from "@/components/HomeSections";
import JoinPack from "@/components/JoinPack";
import { MOODS } from "@/content/moods";

export default function Home() {
  return (
    <>
      <Hero />
      <ClawMachine moods={MOODS} />
      <ToyOfTheMonth />
      <PetWall />
      <JoinPack />
    </>
  );
}
