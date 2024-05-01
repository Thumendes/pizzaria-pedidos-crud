import { useSearchParams } from "@/lib/hooks/useSearchParams";
import { z } from "zod";

export function usePagination() {
  const [searchParams, setSearchParams] = useSearchParams();

  const currentPage = z.coerce.number().parse(searchParams.get("page") ?? 1);
  const currentLimit = z.coerce.number().parse(searchParams.get("limit") ?? 10);

  function onPageChange(page: number) {
    setSearchParams((state) => state.set("page", String(page)));
  }

  function onLimitChange(page: number) {
    setSearchParams((state) => state.set("limit", String(page)));
  }

  return {
    currentPage,
    currentLimit,
    onPageChange,
    onLimitChange,
  };
}
