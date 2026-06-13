export type Project = {
  slug: string;
  title: string;
  location: string;
  year: string;
  description: string;
  image: string;
  category: string;
};

export const projects: Project[] = [
  {
    slug: "city-house",
    title: "City House",
    location: "Gurugram",
    year: "2022",
    description: "A quiet, light-filled home where material honesty shapes every corner.",
    image: "/images/projects/apartment-interior/01.jpg",
    category: "Architecture  Interior",
  },
  {
    slug: "luxury-home",
    title: "Luxury Home",
    location: "Delhi NCR",
    year: "2023",
    description: "A tapestry of jewel tones across five thousand square feet.",
    image: "/images/projects/luxury-home/01.jpg",
    category: "Architecture  Interior",
  },
  {
    slug: "garden-home",
    title: "Garden Home",
    location: "Sohna, Haryana",
    year: "2023",
    description: "A home built to withstand disaster and carry light through every season.",
    image: "/images/projects/garden-home/01.jpg",
    category: "Architecture  Interior",
  },
];
