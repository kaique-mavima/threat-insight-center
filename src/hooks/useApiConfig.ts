
import { useState, useEffect } from 'react';
import { apiService } from '@/services/apiService';
import { useToast } from '@/hooks/use-toast';

export function useApiConfig(configType: string) {
  const [config, setConfig] = useState<any>({});
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const loadConfig = async () => {
    setIsLoading(true);
    try {
      const configs = await apiService.getConfigs(configType);
      if (configs.length > 0) {
        setConfig(configs[0].config);
      }
    } catch (error) {
      console.error(`Erro ao carregar configuração ${configType}:`, error);
      // Fallback para localStorage se API falhar
      loadFromLocalStorage();
    } finally {
      setIsLoading(false);
    }
  };

  const saveConfig = async (newConfig: any) => {
    try {
      await apiService.saveConfig(configType, newConfig);
      setConfig(newConfig);
      
      toast({
        title: "Configuração salva",
        description: `Configurações do ${configType} foram salvas com sucesso.`,
      });
    } catch (error) {
      console.error(`Erro ao salvar configuração ${configType}:`, error);
      // Fallback para localStorage se API falhar
      saveToLocalStorage(newConfig);
      
      toast({
        title: "Configuração salva localmente",
        description: "Não foi possível conectar ao servidor. Configuração salva localmente.",
        variant: "default",
      });
    }
  };

  const loadFromLocalStorage = () => {
    // Mapear as chaves do localStorage baseado no tipo de configuração
    const storageKeys: {[key: string]: string[]} = {
      slack: ['slack_webhook_url', 'slack_enabled'],
      teams: ['teams_webhook_url', 'teams_enabled'],
      telegram: ['telegram_bot_token', 'telegram_chat_id', 'telegram_enabled'],
      jira: ['jira_url', 'jira_email', 'jira_api_token'],
      google_sheets: ['google_sheets_id', 'google_credentials'],
      google_maps: ['google_maps_api_key'],
    };

    const keys = storageKeys[configType] || [];
    const localConfig: any = {};

    keys.forEach(key => {
      const value = localStorage.getItem(key);
      if (value !== null) {
        // Converter booleanos
        if (value === 'true' || value === 'false') {
          localConfig[key] = value === 'true';
        } else {
          localConfig[key] = value;
        }
      }
    });

    setConfig(localConfig);
  };

  const saveToLocalStorage = (newConfig: any) => {
    Object.entries(newConfig).forEach(([key, value]) => {
      localStorage.setItem(key, String(value));
    });
    setConfig(newConfig);
  };

  useEffect(() => {
    loadConfig();
  }, [configType]);

  return {
    config,
    isLoading,
    saveConfig,
    loadConfig,
  };
}
