
import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import { Search, Shield, Calendar, MapPin } from "lucide-react";
import { BreachedCredential, googleSheetsApi } from "@/utils/googleSheetsApi";

export function ThreatIntelTable() {
  const [credentials, setCredentials] = useState<BreachedCredential[]>([]);
  const [filteredCredentials, setFilteredCredentials] = useState<BreachedCredential[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [sourceFilter, setSourceFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const itemsPerPage = 10;

  useEffect(() => {
    loadCredentials();
  }, []);

  useEffect(() => {
    filterCredentials();
  }, [credentials, searchTerm, sourceFilter]);

  const loadCredentials = async () => {
    setLoading(true);
    try {
      const data = await googleSheetsApi.getCredentialsData();
      setCredentials(data);
    } catch (error) {
      console.error('Erro ao carregar credenciais:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterCredentials = () => {
    let filtered = credentials;

    if (searchTerm) {
      filtered = filtered.filter(cred =>
        cred.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        cred.domain.toLowerCase().includes(searchTerm.toLowerCase()) ||
        cred.source.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (sourceFilter !== "all") {
      filtered = filtered.filter(cred => cred.source === sourceFilter);
    }

    setFilteredCredentials(filtered);
    setCurrentPage(1);
  };

  const getSources = () => {
    const sources = Array.from(new Set(credentials.map(cred => cred.source)));
    return sources.sort();
  };

  const paginatedCredentials = filteredCredentials.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const totalPages = Math.ceil(filteredCredentials.length / itemsPerPage);

  const formatDate = (dateString: string) => {
    if (!dateString) return 'N/A';
    try {
      return new Date(dateString).toLocaleDateString('pt-BR');
    } catch {
      return dateString;
    }
  };

  const getCountryFlag = (countryCode: string) => {
    if (!countryCode) return '🌍';
    const flags: { [key: string]: string } = {
      'BR': '🇧🇷',
      'US': '🇺🇸',
      'CA': '🇨🇦',
      'GB': '🇬🇧',
      'DE': '🇩🇪',
      'FR': '🇫🇷',
    };
    return flags[countryCode] || '🌍';
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            <span className="ml-2">Carregando dados de vazamentos...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shield className="w-5 h-5" />
          Credenciais Comprometidas
        </CardTitle>
        <div className="flex flex-col sm:flex-row gap-4 mt-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder="Buscar por email, domínio ou fonte..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          <Select value={sourceFilter} onValueChange={setSourceFilter}>
            <SelectTrigger className="w-full sm:w-48">
              <SelectValue placeholder="Filtrar por fonte" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas as fontes</SelectItem>
              {getSources().map((source) => (
                <SelectItem key={source} value={source}>{source}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Email</TableHead>
                <TableHead>Domínio</TableHead>
                <TableHead>Fonte do Vazamento</TableHead>
                <TableHead className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  Data do Vazamento
                </TableHead>
                <TableHead className="flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  País
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedCredentials.length > 0 ? (
                paginatedCredentials.map((credential) => (
                  <TableRow key={credential.id}>
                    <TableCell className="font-medium">{credential.email}</TableCell>
                    <TableCell>{credential.domain}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-red-400 rounded-full"></div>
                        {credential.source}
                      </div>
                    </TableCell>
                    <TableCell>{formatDate(credential.breachDate)}</TableCell>
                    <TableCell>
                      <span className="flex items-center gap-2">
                        {getCountryFlag(credential.country || '')}
                        {credential.country || 'N/A'}
                      </span>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                    Nenhuma credencial encontrada com os filtros aplicados.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        {totalPages > 1 && (
          <div className="flex items-center justify-between mt-4">
            <p className="text-sm text-muted-foreground">
              Mostrando {(currentPage - 1) * itemsPerPage + 1} a{" "}
              {Math.min(currentPage * itemsPerPage, filteredCredentials.length)} de{" "}
              {filteredCredentials.length} registros
            </p>
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious 
                    onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                    className={currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                  />
                </PaginationItem>
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  const pageNum = i + 1;
                  return (
                    <PaginationItem key={pageNum}>
                      <PaginationLink
                        onClick={() => setCurrentPage(pageNum)}
                        isActive={currentPage === pageNum}
                        className="cursor-pointer"
                      >
                        {pageNum}
                      </PaginationLink>
                    </PaginationItem>
                  );
                })}
                <PaginationItem>
                  <PaginationNext 
                    onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                    className={currentPage === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
