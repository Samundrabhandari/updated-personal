import Link from "next/link";
import Image from "next/image";

export default function Home() {
  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start max-w-2xl text-center sm:text-left">
        <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-indigo-600">
          Personal Gallery System
        </h1>
        <p className="text-lg text-gray-600 sm:text-xl dark:text-gray-400">
          A seamless Next.js App Router gallery powered by Cloudinary and Prisma. Manage your memories effortlessly.
        </p>

        <div className="flex gap-4 items-center flex-col sm:flex-row mt-6 w-full sm:w-auto">
          <Link
            className="rounded-full border border-solid border-transparent transition-colors flex items-center justify-center bg-foreground text-background gap-2 hover:bg-[#383838] dark:hover:bg-[#ccc] text-sm sm:text-base h-12 px-8 font-medium w-full sm:w-auto"
            href="/gallery"
          >
            View Live Gallery
          </Link>
          <Link
            className="rounded-full border border-solid border-black/[.08] dark:border-white/[.145] transition-colors flex items-center justify-center hover:bg-[#f2f2f2] dark:hover:bg-[#1a1a1a] hover:border-transparent text-sm sm:text-base h-12 px-8 font-medium w-full sm:w-auto"
            href="/admin/login"
          >
            Admin Portal
          </Link>
        </div>
      </main>
    </div>
  );
}
