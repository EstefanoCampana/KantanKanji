"use client";

import { useCallback, useState } from "react";

export function useMenuNavigation(itemCount, initialIndex = 0) {
  const [selected, setSelected] = useState(initialIndex);

  const moveSelection = useCallback(
    (direction) => {
      if (itemCount <= 0) return;

      setSelected((prev) => {
        if (direction === "up" || direction === "left") {
          return (prev - 1 + itemCount) % itemCount;
        }

        if (direction === "down" || direction === "right") {
          return (prev + 1) % itemCount;
        }

        return prev;
      });
    },
    [itemCount],
  );

  return {
    selected,
    setSelected,
    moveSelection,
  };
}
