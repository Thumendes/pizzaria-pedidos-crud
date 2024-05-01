import { useSearchParams as _useSearchParams, useRouter, usePathname } from "next/navigation";

export function useSearchParams() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = _useSearchParams();

  function updateSearch(callback: (searchParams: URLSearchParams) => void) {
    const urlSearchParams = new URLSearchParams(searchParams);
    callback(urlSearchParams);
    router.push(`${pathname}?${urlSearchParams.toString()}`);
  }

  return [searchParams, updateSearch] as const;
}
