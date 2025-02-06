import { useContext, useEffect, useState } from "react";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/CustomSidebar";
import { Breadcrumb, BreadcrumbItem, BreadcrumbList } from "@/components/ui/breadcrumb";
import { Link } from "react-router-dom";
import { Separator } from "@/components/ui/separator";
import SkeletonFrame from "@/components/SkeletonFrame";
import PapersCards from "@/components/PapersCards";
import { AuthContext } from "@/store/auth-context";
import { useAxiosPrivate } from "@/axios";
import { useRequireAuth } from "@/lib/randomFunctions";

export default function Home() {
  const [load, setLoad] = useState(false);
  const [data, setData] = useState([]);
  const axiosPrivateInstance = useAxiosPrivate();

  useRequireAuth();

  useEffect(() => {
    async function getPapers() {
      try {
        const response = await axiosPrivateInstance.post("search", { query: "recommendation" });

        setData(response?.data);
        setLoad(true);
      } catch (error) {
        console.error("Error fetching papers:", error);
      }
    }

    getPapers();
  }, []);

  const renderPapers = (content) => {
    return load ? <PapersCards data={content} /> : <SkeletonFrame />;
  };

  return (
    <div>
      <SidebarProvider className="gap-2">
        <AppSidebar />
        <SidebarInset>
          <header className="flex h-16 mb-2 border-spacing-1 text-foreground shrink-0 items-center transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12 justify-between backdrop-filter bg-opacity-5 sticky top-0 z-50 backdrop-blur-md">
            <div className="flex items-center px-4 justify-between">
              <div className="flex items-center">
                <SidebarTrigger />
                <Separator orientation="vertical" className="mr-2 h-4"></Separator>
                <Breadcrumb>
                  <BreadcrumbList>
                    <BreadcrumbItem>
                      <Link to="/home" className="flex flex-row">
                        Home
                      </Link>
                    </BreadcrumbItem>
                  </BreadcrumbList>
                </Breadcrumb>
              </div>
            </div>
          </header>
          {renderPapers(data)}
        </SidebarInset>
      </SidebarProvider>
    </div>
  );
}
