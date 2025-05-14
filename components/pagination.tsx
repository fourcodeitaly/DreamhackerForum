import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  pathname: string;
}

export function Pagination({
  currentPage,
  totalPages,
  pathname,
}: PaginationProps) {
  // Generate page numbers with ellipsis for large page counts
  const getPageNumbers = () => {
    const pages = [];
    pages.push(1);

    let rangeStart = Math.max(2, currentPage - 1);
    let rangeEnd = Math.min(totalPages - 1, currentPage + 1);

    if (rangeEnd - rangeStart < 2 && totalPages > 4) {
      if (currentPage < totalPages / 2) {
        rangeEnd = Math.min(totalPages - 1, rangeStart + 2);
      } else {
        rangeStart = Math.max(2, rangeEnd - 2);
      }
    }

    if (rangeStart > 2) {
      pages.push("ellipsis-start");
    }

    for (let i = rangeStart; i <= rangeEnd; i++) {
      pages.push(i);
    }

    if (rangeEnd < totalPages - 1) {
      pages.push("ellipsis-end");
    }

    if (totalPages > 1) {
      pages.push(totalPages);
    }

    return pages;
  };

  const pageNumbers = getPageNumbers();

  return (
    <div className="flex items-center justify-center space-x-2">
      <Link
        href={`${pathname}&page=${currentPage - 1}`}
        aria-disabled={currentPage === 1}
        tabIndex={currentPage === 1 ? -1 : 0}
      >
        <Button
          variant="outline"
          size="icon"
          disabled={currentPage === 1}
          aria-label="Previous page"
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
      </Link>

      {pageNumbers.map((page, index) => {
        if (page === "ellipsis-start" || page === "ellipsis-end") {
          return (
            <span key={`ellipsis-${index}`} className="px-2">
              &hellip;
            </span>
          );
        }

        return (
          <Link
            key={`page-${page}`}
            href={`${pathname}&page=${page}`}
            aria-current={currentPage === page ? "page" : undefined}
          >
            <Button
              variant={currentPage === page ? "default" : "outline"}
              size="sm"
              aria-label={`Page ${page}`}
            >
              {page}
            </Button>
          </Link>
        );
      })}

      <Link
        href={`${pathname}&page=${currentPage + 1}`}
        aria-disabled={currentPage === totalPages}
        tabIndex={currentPage === totalPages ? -1 : 0}
      >
        <Button
          variant="outline"
          size="icon"
          disabled={currentPage === totalPages}
          aria-label="Next page"
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </Link>
    </div>
  );
}
