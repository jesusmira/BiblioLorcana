"use client";

import { useEffect, useMemo, useState } from "react";
import type { UsePaginationReturn } from "../types";

export default function usePagination<T>(
  items: T[] = [],
  pageSize: number = 16,
  deps: unknown[] = []
): UsePaginationReturn<T> {
  const [visibleCount, setVisibleCount] = useState<number>(pageSize);

  useEffect(() => {
    setVisibleCount(pageSize);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pageSize, ...deps]);

  const visibleItems = useMemo(
    () => items.slice(0, visibleCount),
    [items, visibleCount]
  );

  const canLoadMore = visibleCount < items.length;
  const loadMore = () => setVisibleCount((prev) => prev + pageSize);

  return {
    visibleCount,
    visibleItems,
    canLoadMore,
    loadMore,
  };
}
