import * as React from "react"
import { ScrollText, Search, LogOut } from "lucide-react"
import { useNavigate } from "react-router-dom"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar"
import { Link } from "react-router-dom"
import { useAxiosPrivate } from "@/axios"

export function AppSidebar() {
  const axiosPrivateInstance = useAxiosPrivate()
  const navigate = useNavigate()
  const {open} = useSidebar()

  const handleLogout = async() => {
    // Clear authentication token
    await axiosPrivateInstance.post("logout",{
      "refresh":sessionStorage.getItem('refreshToken')
    }) 
    sessionStorage.removeItem('accessToken')
    sessionStorage.removeItem('refreshToken')
    sessionStorage.removeItem('interests')
    // Redirect to login page
    navigate('/')
  }

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
                <Link className="font-semibold flex flex-row gap-1 items-center" to="/home">
                    {!open && <svg width="40" height="40" viewBox="0 0 48 48" className="ml-2">
                    <g
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="4"
                    strokeLinecap="round"
                    >
                    <path
                        d="M18 23.937V10a6 6 0 0 1 12 0v2.006m0 11.997V38a6 6 0 0 1-12 0v-2.03"
                    ></path>
                    <path
                        d="M24 30H9.984C6.68 30 4 27.314 4 24s2.68-6 5.984-6h2.005M24 18h13.989A6.006 6.006 0 0 1 44 24c0 3.314-2.691 6-6.011 6h-1.923"
                    ></path>
                    </g>
                    </svg>}
                    {open && <><svg width="40" height="40" viewBox="0 0 48 48" id="logo">
                                  <g
                                      fill="none"
                                      stroke="currentColor"
                                      strokeWidth="4"
                                      strokeLinecap="round"
                                  >
                                      <path
                                          d="M18 23.937V10a6 6 0 0 1 12 0v2.006m0 11.997V38a6 6 0 0 1-12 0v-2.03"
                                      ></path>
                                      <path
                                          d="M24 30H9.984C6.68 30 4 27.314 4 24s2.68-6 5.984-6h2.005M24 18h13.989A6.006 6.006 0 0 1 44 24c0 3.314-2.691 6-6.011 6h-1.923"
                                      ></path>
                                  </g>
                              </svg><span>CiteGeist</span></>}
                </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Options</SidebarGroupLabel>
          <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                    <Link className="gap-1" to="/search">
                    <Search></Search>
                        Search
                    </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
              <SidebarMenuButton asChild>
                <Link className="gap-1" to="/pdf">
                    <ScrollText></ScrollText>
                    Similar Papers
                </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChildren onClick={handleLogout} className="flex items-center gap-2 w-full background-foreground hover:backdrop-contrast-50">
                <LogOut className="h-4 w-4" />
                Logout
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  )
}


