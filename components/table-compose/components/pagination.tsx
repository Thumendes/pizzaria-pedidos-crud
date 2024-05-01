import { useCallback, useState } from "react";
import { Button } from "../../ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../ui/select";
import { ChevronLeftIcon, ChevronRightIcon, DoubleArrowLeftIcon, DoubleArrowRightIcon } from "@radix-ui/react-icons";

interface TablePaginationProps {
  onLimitChange?: (limit: number) => void;
  onPageChange?: (page: number) => void;
  limitOptions?: number[];
  limit?: number;
  page?: number;
  totalPages?: number;
}

export function TablePagination({
  onLimitChange,
  onPageChange,
  limitOptions,
  limit,
  page,
  totalPages,
}: TablePaginationProps) {
  const [currentLimit, setCurrentLimit] = useState(limit);

  const handleChangeTake = useCallback(
    (value: string) => {
      setCurrentLimit(Number(value));
      onLimitChange?.(Number(value));
    },
    [onLimitChange]
  );

  const handleChangePage = useCallback(
    (direction: number) => {
      return () => {
        if (typeof page !== "number") return;
        onPageChange?.(page + direction);
      };
    },
    [page, onPageChange]
  );

  const isReady = typeof page === "number" && typeof totalPages === "number";

  return (
    <div className="p-4">
      <div className="flex justify-between items-center">
        <div></div>

        <div className="flex items-center space-x-6 lg:space-x-8">
          {limitOptions && (
            <div className="flex items-center space-x-2">
              <Select value={String(currentLimit)} onValueChange={handleChangeTake}>
                <SelectTrigger className="h-8 w-[70px]">
                  <SelectValue placeholder={String(currentLimit)} />
                </SelectTrigger>
                <SelectContent side="top">
                  {limitOptions.map((pageSize) => (
                    <SelectItem key={pageSize} value={`${pageSize}`}>
                      {pageSize}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          <div className="flex w-[100px] items-center justify-center text-sm font-medium">
            Page {page} of {totalPages}
          </div>

          {isReady && (
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                className="hidden h-8 w-8 p-0 lg:flex"
                onClick={() => onPageChange?.(1)}
                disabled={page <= 1}
              >
                <span className="sr-only">Go to first page</span>
                <DoubleArrowLeftIcon className="h-4 w-4" />
              </Button>

              <Button variant="outline" className="h-8 w-8 p-0" onClick={handleChangePage(-1)} disabled={page <= 1}>
                <span className="sr-only">Go to previous page</span>
                <ChevronLeftIcon className="h-4 w-4" />
              </Button>

              <Button
                variant="outline"
                className="h-8 w-8 p-0"
                onClick={handleChangePage(+1)}
                disabled={page >= totalPages}
              >
                <span className="sr-only">Go to next page</span>
                <ChevronRightIcon className="h-4 w-4" />
              </Button>

              <Button
                variant="outline"
                className="hidden h-8 w-8 p-0 lg:flex"
                onClick={() => onPageChange?.(totalPages)}
                disabled={page >= totalPages}
              >
                <span className="sr-only">Go to last page</span>
                <DoubleArrowRightIcon className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
