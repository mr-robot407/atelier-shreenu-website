export type ApproachStep = {
  number: string;
  title: string;
  description: string;
};

export const approach: ApproachStep[] = [
  {
    number: "01",
    title: "Consultation",
    description:
      "Every project begins with a conversation. We take time to understand you, your lifestyle, aspirations, and how you envision living or working within the space. By the end, we arrive at a shared understanding of the project's ambition and how we will work together.",
  },
  {
    number: "02",
    title: "Site Analysis",
    description:
      "Before a single line is drawn, we study the site and its orientation, topography, vegetation, climate, and immediate context. This deep reading of place ensures that what we design belongs to its location, rather than being imposed upon it.",
  },
  {
    number: "03",
    title: "Concept Design",
    description:
      "Ideas take form; spatial organisation, architectural language, interior detailing, material palettes, and the experiential character of the project. Your feedback shapes and refines the concept until we arrive at a direction that resonates deeply.",
  },
  {
    number: "04",
    title: "Detail Development",
    description:
      "An inspired concept must be built on precise thinking. We resolve every junction, intersection, and proportion into fully developed technical drawings, the complete blueprint from which contractors and technicians will work.",
  },
  {
    number: "05",
    title: "Execution Guidance",
    description:
      "Design does not end on paper. We remain closely involved through construction, making regular site visits, coordinating with engineers and consultants, and ensuring the finished space carries the same integrity as the original vision.",
  },
];
