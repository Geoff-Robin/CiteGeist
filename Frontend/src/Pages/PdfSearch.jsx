import { BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { AppSidebar } from "@/components/CustomSidebar";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import { Breadcrumb, BreadcrumbItem, BreadcrumbList } from "@/components/ui/breadcrumb";
import { Link } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useAxiosPrivate } from "@/axios";

export default function PdfSearch() {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const axiosPrivateInstance = useAxiosPrivate();
  const [query, setQuery] = useState(null);
  const [sampleResults, setSampleResults] = useState([]);

  async function onSubmit() {
    if (!query) return;

    const formData = new FormData();
    formData.append("pdf", query);

    try {
      const response = await axiosPrivateInstance.post("pdf", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (Array.isArray(response.data)) {
        setSampleResults(response.data);
      } else {
        setSampleResults([]);
      }
    } catch (error) {
      console.error("Search failed:", error);
      setSampleResults([]);
    }
  }

  const totalPages = sampleResults.length > 0 ? Math.ceil(results.length / itemsPerPage) : 1;
  const validPage = Math.max(1, Math.min(currentPage, totalPages));
  const startIndex = (validPage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, results.length);
  const currentResults = results.slice(startIndex, endIndex);


  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="ml-3 flex h-16 mb-2 border-spacing-1 text-foreground shrink-0 items-center transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12 justify-between backdrop-filter bg-opacity-5 sticky top-0 z-50 backdrop-blur-md">
          <div className="flex items-center gap-2">
            <SidebarTrigger />
            <Separator orientation="vertical" className="h-4" />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem>
                  <Link to="/home" className="flex flex-row">
                    Home
                  </Link>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <Link to="/PdfSearch" className="flex flex-row">
                    Search
                  </Link>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>

        <main className="flex-1 px-4 pb-8">
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>PDF Search</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col gap-4">
                <div className="flex gap-4">
                  <div className="flex-1">
                    <Input
                      type="file"
                      accept="application/pdf"
                      onChange={(e) => setQuery(e.target.files[0])}
                      className="w-full border-2"
                    />
                  </div>
                  <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                    <SelectTrigger className="w-48 border-2">
                      <SelectValue placeholder="Category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Categories</SelectItem>
                      <SelectItem value="documents">AI</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button className="w-32" onClick={onSubmit}>
                    Search
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Search Results</CardTitle>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <span className="text-sm">
                  Page {currentPage} of {totalPages}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {currentResults.map((result) => (
                  <Card key={result.id} className="p-4 border-2">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-lg font-medium">{result.title}</h3>
                        <p className="text-sm text-muted-foreground font-normal">Abstract</p>
                        <p className="mt-2">{result.abstract}</p>
                      </div>
                      <Link to={`/paper/${result.id}`}>
                        <Button variant="outline" size="sm">
                          View
                        </Button>
                      </Link>
                    </div>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
