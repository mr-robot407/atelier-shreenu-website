import { Contact } from "@/components/sections/Contact";
import { BlogNav } from "@/components/blog/BlogNav";
import { BlogFooter } from "@/components/blog/BlogFooter";

export default function BlogLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <BlogNav />
      {children}
      <Contact />
      <BlogFooter />
    </>
  );
}
