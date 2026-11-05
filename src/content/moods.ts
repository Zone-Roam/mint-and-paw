import { IMG } from "./images";

export type Product = {
  name: string;
  image?: string; // no image = "coming later" card
  materials: string;
  availability: string;
};

// The shop is sorted by what a pet is doing, not by product type.
// Each mood is one capsule in the claw machine and one category page.
export type Mood = {
  slug: string;
  name: string;
  color: string;
  ink: string;
  capsuleImage: string;
  capsuleCover?: boolean; // crop the capsule photo from the top (pet photos)
  blurb: string;
  points: string[];
  products: Product[];
};

export const MOODS: Mood[] = [
  {
    slug: "zoomies",
    name: "Zoomies",
    color: "#FF93B9",
    ink: "#1D1A2C",
    capsuleImage: IMG.ropeMouseBrick,
    blurb: "Squeakers, fetch balls, wands and chews for the 9 pm sprint.",
    points: ["Squeakers and fetch balls", "Rope toys and wands", "Chews for big biters"],
    products: [
      { name: "Rope Mouse, brick", image: IMG.ropeMouseBrick, materials: "Cotton rope · catnip", availability: "At launch" },
      { name: "Stripy Mouse", image: IMG.ropeMouseMoss, materials: "Cotton rope · crinkle tail", availability: "At launch" },
    ],
  },
  {
    slug: "snooze",
    name: "Snooze",
    color: "#7B61FF",
    ink: "#FFFFFF",
    capsuleImage: IMG.catHouse,
    blurb: "Beds, hideouts and blankets worth stealing.",
    points: ["Beds and hideouts", "Blankets worth stealing", "Covers that wash clean"],
    products: [
      { name: "The Hideaway House", image: IMG.catHouse, materials: "Plush shell · sisal posts", availability: "At launch" },
      { name: "The Low Bed", image: IMG.lowBed, materials: "Walnut frame · washable cover", availability: "At launch" },
    ],
  },
  {
    slug: "snacks",
    name: "Snacks",
    color: "#E4F35A",
    ink: "#1D1A2C",
    capsuleImage: IMG.sunsetBowl,
    blurb: "Bowls, lick mats and treat jars for twice a day, every day.",
    points: ["Ceramic bowls", "Lick mats for slow eaters", "Treat jars with a snap lid"],
    products: [
      { name: "The Sunset Bowl", image: IMG.sunsetBowl, materials: "Stoneware · 500 ml", availability: "At launch" },
      { name: "The Mint Bowl", image: IMG.mintBowl, materials: "Stoneware · 350 ml", availability: "At launch" },
    ],
  },
  {
    slug: "sniffs",
    name: "Sniffs",
    color: "#A7E8B0",
    ink: "#1D1A2C",
    capsuleImage: IMG.dachshund,
    capsuleCover: true,
    blurb: "Leads, harnesses and bags for the long way round.",
    points: ["Leads and harnesses", "Poop bags that don't tear", "Collars with a name tag"],
    products: [
      { name: "Lead & collar set", image: IMG.dachshund, materials: "Webbing · brass clip", availability: "After launch" },
      { name: "More walk gear", materials: "Still being tested on real walks", availability: "Coming later" },
    ],
  },
];

export const moodBySlug = (slug: string) => MOODS.find((m) => m.slug === slug);
