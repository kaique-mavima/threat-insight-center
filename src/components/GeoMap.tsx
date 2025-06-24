
import { useEffect, useRef, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MapPin, Globe } from 'lucide-react';
import { API_CONFIG } from '@/config/api';

interface GeoLocation {
  country: string;
  countryCode: string;
  count: number;
  lat: number;
  lng: number;
}

interface GeoMapProps {
  locations?: GeoLocation[];
}

export function GeoMap({ locations = [] }: GeoMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Mock data para demonstração
  const mockLocations: GeoLocation[] = [
    { country: 'Brasil', countryCode: 'BR', count: 45, lat: -14.2350, lng: -51.9253 },
    { country: 'Estados Unidos', countryCode: 'US', count: 32, lat: 39.8283, lng: -98.5795 },
    { country: 'Canadá', countryCode: 'CA', count: 18, lat: 56.1304, lng: -106.3468 },
    { country: 'Reino Unido', countryCode: 'GB', count: 12, lat: 55.3781, lng: -3.4360 },
    { country: 'Alemanha', countryCode: 'DE', count: 8, lat: 51.1657, lng: 10.4515 },
  ];

  const dataToShow = locations.length > 0 ? locations : mockLocations;

  useEffect(() => {
    if (!API_CONFIG.maps.apiKey) {
      setError('Chave da API do Google Maps não configurada');
      return;
    }

    loadGoogleMaps();
  }, []);

  const loadGoogleMaps = async () => {
    try {
      // Simular carregamento do mapa (substituir por integração real)
      setTimeout(() => {
        setMapLoaded(true);
      }, 1000);
    } catch (err) {
      setError('Erro ao carregar o mapa');
    }
  };

  const getTotalEvents = () => {
    return dataToShow.reduce((total, location) => total + location.count, 0);
  };

  const getCountryFlag = (countryCode: string) => {
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

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Globe className="w-5 h-5" />
            Mapa de Eventos por Localização
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            <Globe className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>{error}</p>
            <p className="text-sm mt-2">Configure a chave da API do Google Maps nas configurações</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MapPin className="w-5 h-5" />
          Eventos por Localização Geográfica
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Total de eventos: {getTotalEvents()}
        </p>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Mapa placeholder */}
          <div className="relative">
            <div 
              ref={mapRef}
              className="w-full h-64 bg-muted rounded-lg flex items-center justify-center"
            >
              {!mapLoaded ? (
                <div className="text-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2"></div>
                  <p className="text-sm text-muted-foreground">Carregando mapa...</p>
                </div>
              ) : (
                <div className="text-center">
                  <Globe className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground">
                    Mapa interativo será carregado aqui<br />
                    quando a API do Google Maps for configurada
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Lista de países */}
          <div className="space-y-2">
            <h4 className="text-sm font-medium text-muted-foreground mb-3">
              Distribuição por País
            </h4>
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {dataToShow
                .sort((a, b) => b.count - a.count)
                .map((location) => (
                  <div
                    key={location.countryCode}
                    className="flex items-center justify-between p-2 bg-muted/50 rounded-lg"
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-lg">{getCountryFlag(location.countryCode)}</span>
                      <span className="text-sm font-medium">{location.country}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-16 bg-background rounded-full h-2">
                        <div
                          className="bg-primary h-2 rounded-full"
                          style={{
                            width: `${(location.count / Math.max(...dataToShow.map(l => l.count))) * 100}%`
                          }}
                        />
                      </div>
                      <span className="text-sm font-bold text-primary">
                        {location.count}
                      </span>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
