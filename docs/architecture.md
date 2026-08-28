# Arquitetura do sistema

O cliente Expo consulta a API FastAPI. A API carrega os JSON de `content/challenges`, valida respostas e não expõe `correct_answer` nos endpoints de leitura.

- Cliente: Expo SDK 57, React Native e TypeScript.
- Componentes: seleção da aventura, cartão do desafio, mensagens de estado e conclusão.
- Serviços: cliente HTTP e progresso local versionado em AsyncStorage.
- Backend: FastAPI/Pydantic, filtros `age_group` e `theme` e cache de conteúdo.
- Conteúdo: JSON validado no carregamento e por testes de integridade.
- Testes: Vitest para lógica do frontend e Pytest para API/conteúdo.
- Configuração: `EXPO_PUBLIC_API_URL` define a API.

## Pendências de produção
- Configurar `CORS_ORIGINS` com os domínios e aplicativos esperados no ambiente de produção.
- Definir observabilidade, hospedagem e pipeline de build/deploy.
- Evoluir a persistência local para perfis e sincronização, se necessário.
- Extrair o fluxo principal do `App.tsx` para telas ou um hook conforme crescer.
