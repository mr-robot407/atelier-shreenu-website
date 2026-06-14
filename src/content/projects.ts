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
    architectureImage: "/images/projects/city-house/City%20House%20Architecture.jpg",
    interiorImage: "/images/projects/city-house/City%20House%20Interior.jpg",
  },
  {
    slug: "luxury-home",
    title: "Luxury Home",
    location: "Delhi NCR",
    year: "2023",
    architectureImage: "/images/projects/luxury-home/Luxury%20Home%20Architecture.jpg",
    interiorImage: "/images/projects/luxury-home/Luxury%20Homes%20Interior.jpg",
  },
  {
    slug: "garden-home",
    title: "Garden Home",
    location: "Sohna, Haryana",
    year: "2023",
    architectureImage: "/images/projects/garden-home/Garden%20Home%20Architecture.jpg",
    interiorImage: "/images/projects/garden-home/Garden%20Home%20Interior.jpg",
  },
];
