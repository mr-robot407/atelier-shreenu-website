"use client";

import { useRouter, usePathname } from "next/navigation";

export function AdminShell({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const isLogin = pathname === "/shreenu-editor/login" || pathname === "/shreenu-editor/login/";

  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/shreenu-editor/login");
  }

  if (isLogin) return <>{children}</>;

  return (
    <div className="min-h-screen bg-stone-50">
      <header className="sticky top-0 z-10 border-b border-stone-200 bg-white px-6 py-0 flex items-center justify-between h-14">
        <div className="flex items-center gap-6">
          <span className="font-serif text-lg text-stone-900">
            Atelier Shreenu
          </span>
          <span className="text-stone-200">|</span>
          <nav className="flex gap-1">
            <a
              href="/shreenu-editor/posts"
              className={`text-sm px-3 py-1.5 rounded transition-colors ${
                pathname.startsWith("/shreenu-editor/posts")
                  ? "bg-stone-100 text-stone-900 font-medium"
                  : "text-stone-500 hover:text-stone-900"
              }`}
            >
              Posts
            </a>
          </nav>
        </div>

        <div className="flex items-center gap-3">
          <a
            href="/blog/"
            target="_blank"
            className="text-sm text-stone-500 hover:text-stone-900 transition-colors"
          >
            View blog ↗
          </a>
          <button
            onClick={() => router.push("/shreenu-editor/posts/new")}
            className="bg-stone-900 text-white text-sm font-medium px-4 py-1.5 rounded-md hover:bg-stone-700 transition-colors"
          >
            + New post
          </button>
          <button
            onClick={handleLogout}
            className="text-sm text-stone-400 hover:text-stone-700 transition-colors ml-2"
          >
            Logout
          </button>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 py-10">{children}</main>

      {/* Floating Add Post button */}
      <button
        onClick={() => router.push("/shreenu-editor/posts/new")}
        className="fixed bottom-8 left-8 flex items-center gap-2 bg-burgundy text-white text-sm font-semibold px-5 py-3 rounded-full shadow-lg hover:bg-deep-wine active:scale-95 transition-all z-50"
      >
        <span className="text-xl leading-none">+</span>
        Add Post
      </button>
    </div>
  );
}
