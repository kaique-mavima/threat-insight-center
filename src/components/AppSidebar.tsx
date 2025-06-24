
import { Shield, Home, Mail, Globe, Database, Users, Settings, Activity } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { 
  Sidebar, 
  SidebarContent, 
  SidebarGroup, 
  SidebarGroupContent, 
  SidebarGroupLabel, 
  SidebarMenu, 
  SidebarMenuButton, 
  SidebarMenuItem, 
  SidebarHeader, 
  SidebarFooter 
} from "@/components/ui/sidebar";

const menuItems = [
  {
    title: "Painel Principal",
    url: "/",
    icon: Home,
  },
  {
    title: "Segurança de Email",
    url: "/email-security",
    icon: Mail,
  },
  {
    title: "Segurança Web",
    url: "/web-security",
    icon: Globe,
  },
  {
    title: "Inteligência de Ameaças",
    url: "/threat-intel",
    icon: Database,
  },
];

const adminItems = [
  {
    title: "Gestão de Usuários",
    url: "/users",
    icon: Users,
  },
  {
    title: "Logs de Atividade",
    url: "/logs",
    icon: Activity,
  },
  {
    title: "Configurações",
    url: "/settings",
    icon: Settings,
  },
];

export function AppSidebar() {
  const location = useLocation();

  return (
    <Sidebar className="border-r border-border">
      <SidebarHeader className="p-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg flex items-center justify-center overflow-hidden">
            <img 
              src="/lovable-uploads/a9812223-178a-479f-a62f-df2744d52b5c.png" 
              alt="SIC Logo" 
              className="w-full h-full object-cover" 
            />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white">
              Painel SIC
            </h1>
            <p className="text-xs text-muted-foreground">Serviço de Inteligência Cibernética</p>
          </div>
        </div>
      </SidebarHeader>
      
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navegação Principal</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild isActive={location.pathname === item.url}>
                    <Link to={item.url} className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-sidebar-accent transition-colors">
                      <item.icon className="w-5 h-5" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>Administração</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {adminItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild isActive={location.pathname === item.url}>
                    <Link to={item.url} className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-sidebar-accent transition-colors">
                      <item.icon className="w-5 h-5" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      
      <SidebarFooter className="p-4">
        
      </SidebarFooter>
    </Sidebar>
  );
}
