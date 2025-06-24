
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import { Search, Filter, Calendar, User, Tag } from "lucide-react";
import { useState } from "react";

const alertsData = [
  {
    id: "SOC-001",
    title: "Anexo de Email Suspeito",
    description: "Detectado anexo de email suspeito com potencial malware. O arquivo 'fatura.pdf.exe' foi sinalizado pelos nossos scanners de segurança como contendo código malicioso. Investigação imediata necessária.",
    severity: "Crítico",
    status: "Aberto",
    assignee: "João Silva",
    created: "2024-01-15 14:30",
    source: "Segurança de Email"
  },
  {
    id: "SOC-002", 
    title: "Detecção de Malware no Endpoint",
    description: "Proteção de endpoint detectou malware na estação de trabalho WS-001. A ameaça foi colocada em quarentena, mas verificação manual é necessária para garantir remoção completa.",
    severity: "Alto",
    status: "Em Progresso",
    assignee: "Maria Santos",
    created: "2024-01-15 13:45",
    source: "Segurança Web"
  },
  {
    id: "SOC-003",
    title: "Vazamento de Credenciais Detectado",
    description: "Múltiplas credenciais de usuário encontradas em uma violação de dados recente. Usuários afetados precisam ser notificados e senhas redefinidas imediatamente.",
    severity: "Alto",
    status: "Aberto",
    assignee: "Carlos Oliveira",
    created: "2024-01-15 12:20",
    source: "Inteligência de Ameaças"
  },
  {
    id: "SOC-004",
    title: "Tentativa de Phishing Bloqueada",
    description: "Sistemas automatizados bloquearam tentativa de phishing direcionada ao departamento financeiro. Email continha fatura fraudulenta com links maliciosos.",
    severity: "Médio",
    status: "Resolvido",
    assignee: "Ana Costa",
    created: "2024-01-15 11:15",
    source: "Segurança de Email"
  },
  {
    id: "SOC-005",
    title: "Tráfego de Rede Incomum",
    description: "Detectados padrões de tráfego de rede incomuns sugerindo potencial exfiltração de dados. Análise de tráfego mostra grandes transferências de dados para IPs externos desconhecidos.",
    severity: "Baixo",
    status: "Em Progresso",
    assignee: "Roberto Lima",
    created: "2024-01-15 10:30",
    source: "Segurança Web"
  },
  {
    id: "SOC-006",
    title: "Login Suspeito Detectado",
    description: "Tentativa de login de localização geograficamente distante detectada para usuário admin.",
    severity: "Alto",
    status: "Aberto",
    assignee: "Fernanda Rocha",
    created: "2024-01-15 09:45",
    source: "Controle de Acesso"
  },
  // ... adicionar mais alertas para demonstrar paginação
  {
    id: "SOC-007",
    title: "Arquivo Criptografado Suspeito",
    description: "Arquivo com extensão .locked detectado em servidor compartilhado, possível ransomware.",
    severity: "Crítico",
    status: "Aberto",
    assignee: "Pedro Martins",
    created: "2024-01-15 08:30",
    source: "Proteção de Arquivo"
  },
  {
    id: "SOC-008",
    title: "Tentativa de Acesso Não Autorizado",
    description: "Múltiplas tentativas de acesso falharam para conta administrativa.",
    severity: "Alto",
    status: "Em Progresso",
    assignee: "Lucia Fernandes",
    created: "2024-01-15 07:15",
    source: "Controle de Acesso"
  },
  {
    id: "SOC-009",
    title: "Download de Software Suspeito",
    description: "Usuário baixou software de fonte não confiável durante horário comercial.",
    severity: "Médio",
    status: "Aberto",
    assignee: "Diego Santos",
    created: "2024-01-15 06:00",
    source: "Segurança Web"
  },
  {
    id: "SOC-010",
    title: "Conexão VPN Anômala",
    description: "Conexão VPN estabelecida de país não autorizado pela política da empresa.",
    severity: "Médio",
    status: "Resolvido",
    assignee: "Camila Souza",
    created: "2024-01-15 05:45",
    source: "Rede"
  }
];

const getSeverityColor = (severity: string) => {
  switch (severity) {
    case "Crítico": return "bg-red-500 hover:bg-red-600";
    case "Alto": return "bg-orange-500 hover:bg-orange-600";
    case "Médio": return "bg-yellow-500 hover:bg-yellow-600";
    case "Baixo": return "bg-green-500 hover:bg-green-600";
    default: return "bg-gray-500 hover:bg-gray-600";
  }
};

const getStatusColor = (status: string) => {
  switch (status) {
    case "Aberto": return "bg-red-500/20 text-red-400 border-red-500/30";
    case "Em Progresso": return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30";
    case "Resolvido": return "bg-green-500/20 text-green-400 border-green-500/30";
    default: return "bg-gray-500/20 text-gray-400 border-gray-500/30";
  }
};

export function AlertsTable() {
  const [selectedAlert, setSelectedAlert] = useState<typeof alertsData[0] | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

  const itemsPerPage = 10;

  // Filter alerts based on search term and status
  const filteredAlerts = alertsData.filter(alert => {
    const matchesSearch = alert.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         alert.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || 
                         (statusFilter === "open" && alert.status === "Aberto") ||
                         (statusFilter === "progress" && alert.status === "Em Progresso") ||
                         (statusFilter === "resolved" && alert.status === "Resolvido");
    
    return matchesSearch && matchesStatus;
  });

  // Calculate pagination
  const totalPages = Math.ceil(filteredAlerts.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedAlerts = filteredAlerts.slice(startIndex, startIndex + itemsPerPage);

  // Reset to page 1 when filters change
  const handleFilterChange = (newFilter: string) => {
    setStatusFilter(newFilter);
    setCurrentPage(1);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <CardTitle>Alertas de Segurança Recentes</CardTitle>
          <div className="flex flex-col sm:flex-row gap-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input 
                placeholder="Buscar alertas..." 
                className="pl-10 w-full sm:w-64"
                value={searchTerm}
                onChange={handleSearchChange}
              />
            </div>
            <Select value={statusFilter} onValueChange={handleFilterChange}>
              <SelectTrigger className="w-full sm:w-40">
                <Filter className="w-4 h-4 mr-2" />
                <SelectValue placeholder="Filtrar" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os Status</SelectItem>
                <SelectItem value="open">Aberto</SelectItem>
                <SelectItem value="progress">Em Progresso</SelectItem>
                <SelectItem value="resolved">Resolvido</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-3 px-4 font-medium text-muted-foreground">ID</th>
                <th className="text-left py-3 px-4 font-medium text-muted-foreground">Título</th>
                <th className="text-left py-3 px-4 font-medium text-muted-foreground">Severidade</th>
                <th className="text-left py-3 px-4 font-medium text-muted-foreground">Status</th>
                <th className="text-left py-3 px-4 font-medium text-muted-foreground">Responsável</th>
                <th className="text-left py-3 px-4 font-medium text-muted-foreground">Criado</th>
                <th className="text-left py-3 px-4 font-medium text-muted-foreground">Ações</th>
              </tr>
            </thead>
            <tbody>
              {paginatedAlerts.map((alert) => (
                <tr key={alert.id} className="border-b border-border/50 hover:bg-muted/30 transition-colors">
                  <td className="py-3 px-4">
                    <code className="text-sm bg-muted px-2 py-1 rounded">{alert.id}</code>
                  </td>
                  <td className="py-3 px-4">
                    <div>
                      <div className="font-medium">{alert.title}</div>
                      <div className="text-sm text-muted-foreground">{alert.source}</div>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <Badge className={getSeverityColor(alert.severity)}>
                      {alert.severity}
                    </Badge>
                  </td>
                  <td className="py-3 px-4">
                    <Badge variant="outline" className={getStatusColor(alert.status)}>
                      {alert.status}
                    </Badge>
                  </td>
                  <td className="py-3 px-4 text-sm">{alert.assignee}</td>
                  <td className="py-3 px-4 text-sm text-muted-foreground">{alert.created}</td>
                  <td className="py-3 px-4">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="ghost" size="sm" onClick={() => setSelectedAlert(alert)}>
                          Visualizar
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-2xl">
                        <DialogHeader>
                          <DialogTitle className="flex items-center gap-2">
                            <Tag className="w-4 h-4" />
                            {alert.title}
                          </DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4">
                          <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <div className="text-sm text-muted-foreground">ID do Alerta</div>
                              <code className="bg-muted px-2 py-1 rounded text-sm">{alert.id}</code>
                            </div>
                            <div className="space-y-2">
                              <div className="text-sm text-muted-foreground">Origem</div>
                              <div className="text-sm">{alert.source}</div>
                            </div>
                          </div>
                          
                          <div className="grid grid-cols-3 gap-4">
                            <div className="space-y-2">
                              <div className="text-sm text-muted-foreground">Severidade</div>
                              <Badge className={getSeverityColor(alert.severity)}>
                                {alert.severity}
                              </Badge>
                            </div>
                            <div className="space-y-2">
                              <div className="text-sm text-muted-foreground">Status</div>
                              <Badge variant="outline" className={getStatusColor(alert.status)}>
                                {alert.status}
                              </Badge>
                            </div>
                            <div className="space-y-2">
                              <div className="text-sm text-muted-foreground flex items-center gap-1">
                                <User className="w-3 h-3" />
                                Responsável
                              </div>
                              <div className="text-sm">{alert.assignee}</div>
                            </div>
                          </div>

                          <div className="space-y-2">
                            <div className="text-sm text-muted-foreground flex items-center gap-1">
                              <Calendar className="w-3 h-3" />
                              Criado
                            </div>
                            <div className="text-sm">{alert.created}</div>
                          </div>

                          <div className="space-y-2">
                            <div className="text-sm text-muted-foreground">Descrição</div>
                            <div className="text-sm bg-muted/50 p-3 rounded-md">
                              {alert.description}
                            </div>
                          </div>

                          <div className="flex gap-2 pt-4">
                            <Button size="sm">Editar Alerta</Button>
                            <Button variant="outline" size="sm">Adicionar Comentário</Button>
                            <Button variant="outline" size="sm">Alterar Status</Button>
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {/* Pagination Controls */}
        {totalPages > 1 && (
          <div className="mt-6">
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious 
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    className={currentPage === 1 ? "pointer-events-none opacity-50 cursor-not-allowed" : "cursor-pointer hover:bg-accent"}
                  />
                </PaginationItem>
                
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <PaginationItem key={page}>
                    <PaginationLink
                      onClick={() => setCurrentPage(page)}
                      isActive={page === currentPage}
                      className="cursor-pointer hover:bg-accent"
                    >
                      {page}
                    </PaginationLink>
                  </PaginationItem>
                ))}
                
                <PaginationItem>
                  <PaginationNext 
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                    className={currentPage === totalPages ? "pointer-events-none opacity-50 cursor-not-allowed" : "cursor-pointer hover:bg-accent"}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        )}
        
        {/* Pagination Info */}
        <div className="mt-4 text-sm text-muted-foreground text-center">
          Mostrando {startIndex + 1} a {Math.min(startIndex + itemsPerPage, filteredAlerts.length)} de {filteredAlerts.length} alertas
          {totalPages > 1 && (
            <span className="ml-2">• Página {currentPage} de {totalPages}</span>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
