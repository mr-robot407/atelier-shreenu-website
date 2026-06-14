export type Project = {
  slug: string;
  title: string;
  location: string;
  year: string;
  architectureImage: string;
  interiorImage: string;
};

export const projects: Project[] = [
  {
    slug: "city-house",
    title: "City House",
    location: "Gurugram",
    year: "2022",
    architectureImage: "/images/projects/city-house/city-house-architecture.jpg",
    interiorImage: "/images/projects/city-house/city-house-interior.jpg",
  },
  {
    slug: "luxury-home",
    title: "Luxury Home",
    location: "Delhi NCR",
    year: "2023",
    architectureImage: "/images/projects/luxury-home/luxury-home-architecture.jpg",
    interiorImage: "/images/projects/luxury-home/luxury-homes-interior.jpg",
  },
  {
    slug: "garden-home",
    title: "Garden Home",
    location: "Sohna, Haryana",
    year: "2023",
    architectureImage: "/images/projects/garden-home/garden-home-architecture.jpg",
    interiorImage: "/images/projects/garden-home/garden-home-interior.jpg",
  },
];
