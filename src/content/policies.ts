import { SITE } from "./site";

// Outlines only. Every "to confirm" line needs a real answer (and, for privacy/terms,
// a proper legal review) before the shop takes its first order.
export type Policy = {
  slug: string;
  title: string;
  intro: string;
  sections: { heading: string; items: string[] }[];
};

export const POLICIES: Policy[] = [
  {
    slug: "shipping",
    title: "Shipping",
    intro: "We'll publish full shipping details before the shop opens. Here's what this page will cover.",
    sections: [
      { heading: "Where we ship", items: ["Countries and regions: to confirm"] },
      { heading: "How long it takes", items: ["Order processing time: to confirm", "Delivery times by region: to confirm"] },
      { heading: "What it costs", items: ["Shipping rates: to confirm", "Free shipping threshold, if any: to confirm"] },
      { heading: "Tracking", items: ["Every order gets a tracking link by email."] },
    ],
  },
  {
    slug: "returns",
    title: "Returns",
    intro: "Our returns policy goes live with the shop. Here's what it will cover.",
    sections: [
      { heading: "Return window", items: ["Number of days to return an item: to confirm"] },
      { heading: "What can be returned", items: ["Condition items need to be in: to confirm", "Items that can't be returned for hygiene reasons: to confirm"] },
      { heading: "How refunds work", items: ["Refund method and timing: to confirm", "Who pays return shipping: to confirm"] },
    ],
  },
  {
    slug: "privacy",
    title: "Privacy",
    intro: "Right now the only personal data we collect is the email you give us to hear about our launch.",
    sections: [
      { heading: "What we collect today", items: ["Your email address, if you join the launch list."] },
      { heading: "What we use it for", items: ["One email when the shop opens, plus occasional news if you stay subscribed."] },
      { heading: "Your choices", items: ["Unsubscribe from any email, or ask us to delete your address by writing to us."] },
      { heading: "Before launch", items: ["Full privacy policy covering orders, payments and cookies: to confirm"] },
    ],
  },
  {
    slug: "terms",
    title: "Terms",
    intro: "Our terms of sale will be published before the shop takes its first order.",
    sections: [
      { heading: "Who operates Mint & Paw", items: [SITE.operatorStatement] },
      { heading: "What this page will cover", items: [ "Pricing and payment: to confirm", "Product safety and use: to confirm", "Governing law: to confirm"] },
    ],
  },
];

export const policyBySlug = (slug: string) => POLICIES.find((p) => p.slug === slug);
