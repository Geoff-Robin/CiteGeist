import { useState } from "react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

export default function PapersCards(props) {
  const researchPapers = Array.isArray(props.data) ? props.data : [];
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 7;
  const totalPages = Math.ceil(researchPapers.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = researchPapers.slice(indexOfFirstItem, indexOfLastItem);

  const cleanAuthors = (authorsStr) => {
    const authorsArray = authorsStr
      .replace("[arxiv.Result.Author(", "")
      .replace("),", "")
      .replace(")]", "")
      .split("', arxiv.Result.Author('");
    return authorsArray.join(", ");
  };

  const getPageNumbers = () => {
    const delta = 2;
    const range = [];
    const rangeWithDots = [];

    for (
      let i = Math.max(2, currentPage - delta);
      i <= Math.min(totalPages - 1, currentPage + delta);
      i++
    ) {
      range.push(i);
    }

    if (currentPage - delta > 2) {
      rangeWithDots.push(1, 'ellipsis');
    } else {
      rangeWithDots.push(1);
    }

    rangeWithDots.push(...range);

    if (currentPage + delta < totalPages - 1) {
      rangeWithDots.push('ellipsis', totalPages);
    } else if (totalPages > 1) {
      rangeWithDots.push(totalPages);
    }

    return rangeWithDots;
  };

  return (
    <div className="flex flex-col gap-2 items-center">
      {currentItems.length > 0 ? (
        currentItems.map((paper, index) => (
          <Card key={index} className="h-max w-11/12 rounded-lg bg-muted/50 border-2">
            <CardHeader>
              <CardTitle className="flex flex-row justify-between text-xl">
                <Link to={`/paper/${paper.id}`}>
                  {paper.title}
                </Link>
                <Link to={`/paper/${paper.id}`} className="hover:bg-muted rounded-full p-1">
                  <ArrowRight />
                </Link>
              </CardTitle>
            </CardHeader>
            <hr className="mb-4 border-2" />
            <div className="text-lg font-semibold mb-2 ml-6">Abstract</div>
            <CardContent>
              <p className="border-l-2 pl-4">{paper.abstract}</p>
            </CardContent>
            <CardFooter className="border-t-2 mt-4 pt-4">
              <div className="text-xs text-right w-full">
                {cleanAuthors(paper.authors)}
              </div>
            </CardFooter>
          </Card>
        ))
      ) : (
        <p>No research papers available.</p>
      )}

      {totalPages > 1 && (
        <Pagination className="mt-4">
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious 
                onClick={() => currentPage > 1 && setCurrentPage(currentPage - 1)}
                className={`border-2 ${currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer hover:bg-muted"}`}
              />
            </PaginationItem>

            {getPageNumbers().map((pageNum, index) => (
              <PaginationItem key={index}>
                {pageNum === 'ellipsis' ? (
                  <PaginationEllipsis className="border-2" />
                ) : (
                  <PaginationLink
                    isActive={pageNum === currentPage}
                    onClick={() => setCurrentPage(pageNum)}
                    className={`border-2 cursor-pointer ${pageNum === currentPage ? "bg-muted" : "hover:bg-muted"}`}
                  >
                    {pageNum}
                  </PaginationLink>
                )}
              </PaginationItem>
            ))}

            <PaginationItem>
              <PaginationNext
                onClick={() => currentPage < totalPages && setCurrentPage(currentPage + 1)}
                className={`border-2 ${currentPage === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer hover:bg-muted"}`}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}
    </div>
  );
}