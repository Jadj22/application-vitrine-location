"use client";

import Image from "next/image";
import { ChevronRight } from "lucide-react";

type Props = {
  category: string;
  imageSrc: string;
};

export default function CategoryTile({ category, imageSrc }: Props) {
  const handleClick = () => {
    window.dispatchEvent(
      new CustomEvent("select-category", { detail: category })
    );
    document.getElementById("catalogue")?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <button
      onClick={handleClick}
      className="group relative block w-[250px] overflow-hidden rounded-[2rem] border border-border bg-card text-left sm:w-[290px] lg:w-[310px]"
    >
      <div className="relative aspect-[4/5] overflow-hidden">
        <Image
          src={imageSrc}
          alt={category}
          fill
          sizes="310px"
          className="object-cover transition duration-700 ease-out group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/10 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 p-6 text-white">
          <p className="text-2xl font-semibold tracking-tight">{category}</p>
          <span className="mt-3 inline-flex items-center gap-1 text-sm font-medium text-white/80 transition group-hover:text-white">
            Découvrir
            <ChevronRight className="size-4 transition-transform group-hover:translate-x-1" />
          </span>
        </div>
      </div>
    </button>
  );
}
