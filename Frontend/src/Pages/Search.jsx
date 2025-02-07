import { BreadcrumbSeparator } from "@/components/ui/breadcrumb"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { useState } from "react"
import { AppSidebar } from "@/components/CustomSidebar"
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { Separator } from "@/components/ui/separator"
import { Breadcrumb, BreadcrumbItem, BreadcrumbList } from "@/components/ui/breadcrumb"
import { Link } from "react-router-dom"
import { Input } from "@/components/ui/input"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { useAxiosPrivate } from "@/axios"

export default function Search() {
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [currentPage, setCurrentPage] = useState(1)
  const [isLoading, setIsLoading] = useState(false)
  const [progress, setProgress] = useState(0)
  const itemsPerPage = 5
  const axiosPrivateInstance = useAxiosPrivate()
  const [query, setQuery] = useState("")
  const [sampleResults, setSampleResults] = useState([])

  async function onSubmit() {
    setIsLoading(true)
    setProgress(30)
    try {
      const response = await axiosPrivateInstance.post("search", { query })
      setProgress(90)
      setSampleResults(Array.isArray(response.data) ? response.data : [])
    } catch (error) {
      console.error("Search failed:", error)
      setSampleResults([])
    } finally {
      setProgress(100)
      setTimeout(() => setIsLoading(false), 400)
    }
  }

  const totalPages = sampleResults.length > 0 ? Math.ceil(sampleResults.length / itemsPerPage) : 1;
  const validPage = Math.max(1, Math.min(currentPage, totalPages));
  const startIndex = (validPage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, sampleResults.length);
  const currentResults = sampleResults.slice(startIndex, endIndex);


  return (
    <SidebarProvider>
      <div className="flex">
        <AppSidebar className="hidden md:block" />
        <SidebarInset>
          <div className="flex-1 flex flex-col min-h-screen max-w-full overflow-x-hidden">
            {/* Header */}
            <header className="ml-3 flex h-12 md:h-16 mb-2 text-foreground shrink-0 items-center transition-[width,height] ease-linear justify-between backdrop-filter bg-opacity-5 sticky top-0 z-50 backdrop-blur-md">
              <div className="flex items-center gap-2">
                <SidebarTrigger />
                <Separator orientation="vertical" className="h-4" />
                <Breadcrumb>
                  <BreadcrumbList>
                    <BreadcrumbItem>
                      <Link to="/home" className="flex flex-row">Home</Link>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                      <Link to="/search" className="flex flex-row">Search</Link>
                    </BreadcrumbItem>
                  </BreadcrumbList>
                </Breadcrumb>
              </div>
            </header>

            {/* Main Content */}
            <main className="flex-1 px-4 pb-8 max-w-full">
              <div className="max-w-6xl mx-auto">
                {/* Search Box */}
                <Card className="mb-6">
                  <CardHeader>
                    <CardTitle>Advanced Search</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-col sm:flex-row gap-4">
                      <Input
                        type="text"
                        placeholder="Search..."
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        className="flex-1 border-2"
                        onKeyDown={(e) => e.key === "Enter" && onSubmit()}
                      />
                      <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                        <SelectTrigger className="w-full sm:w-48 border-2">
                          <SelectValue placeholder="Category" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Categories</SelectItem>
                          <SelectItem value="documents">AI</SelectItem>
                        </SelectContent>
                      </Select>
                      <Button className="w-full sm:w-32" onClick={onSubmit}>Search</Button>
                    </div>
                  </CardContent>
                </Card>

                {/* Search Results */}
                <Card>
                  <CardHeader className="flex flex-col sm:flex-row items-center justify-between gap-4">
                    <CardTitle>Search Results</CardTitle>
                    <div className="flex flex-wrap items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
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
                        onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                        disabled={currentPage === totalPages}
                      >
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    {isLoading ? (
                      <div className="space-y-6">
                        <Progress value={progress} className="w-full" />
                        {[...Array(3)].map((_, i) => (
                          <Card key={i} className="p-4 border-2 animate-pulse">
                            <div className="space-y-4">
                              <div className="h-4 bg-muted rounded w-3/4"></div>
                              <div className="h-2 bg-muted rounded w-1/4"></div>
                              <div className="space-y-2">
                                <div className="h-2 bg-muted rounded"></div>
                                <div className="h-2 bg-muted rounded w-5/6"></div>
                              </div>
                            </div>
                          </Card>
                        ))}
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {currentResults.map((result) => (
                          <Card key={result.id} className="p-4 border-2">
                            <div className="flex flex-col">
                              <h3 className="text-lg font-medium">{result.title}</h3>
                              <p className="text-sm text-muted-foreground font-normal">Abstract</p>
                              <p className="mt-2">{result.abstract}</p>
                              <Link to={`/paper/${result.id}`} className="mt-2 self-start">
                                <Button variant="outline" size="sm">View</Button>
                              </Link>
                            </div>
                          </Card>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </main>
          </div>
        </SidebarInset>
      </div>
    </SidebarProvider>
  )
}
