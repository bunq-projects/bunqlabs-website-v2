import RotatingHeading from "./RotatingHeading";
import Sparkle from "./Sparkle";
import HeroActions from "./HeroActions";

// The home hero — the rotating headline, sparkle and pill actions. Shown when
// the view is "home"; swapped for <WorkView /> when the Work view is open.
export default function Hero() {
  return (
    <section className="hero">
      <Sparkle />
      <RotatingHeading />
      <HeroActions />
    </section>
  );
}
