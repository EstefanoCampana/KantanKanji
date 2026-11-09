"use client";

import { useNavigation } from "@/app/context/NavigationContext";

export default function BackButton({ variant = null }) {
  const { back } = useNavigation();

  const switchStyle = (variant) => {
    if (variant == null) {
      return "self-start mb-2 text-white bg-black p-1 cursor-pointer border";
    }
    if (variant === "endScreen") {
      return "w-full bg-black text-white font-bold rounded 2xl p-2 mt-2 cursor-pointer";
    }
  };

  return (
    <button onClick={back} className={switchStyle(variant)}>
      {variant == null ? "<<<<<<" : "Back"}
    </button>
  );
}
