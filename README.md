# Matemática Mágica

App educacional de matemática para crianças e adolescentes de 1 a 15 anos. O MVP combina Expo/React Native com uma API FastAPI e desafios armazenados em JSON.

## Recursos
- Cinco faixas etárias e temas geral/bíblico
- 20 desafios, com cobertura de todas as combinações de faixa e tema
- Perfis locais com progresso independente e recuperação de dados parcialmente corrompidos
- Seleção da aventura antes de jogar
- Ordem variada com prioridade para desafios ainda não respondidos
- Correção e explicação imediatas
- Progresso local separado por aventura com AsyncStorage
- Painel de desempenho por perfil, faixa etária e tema
- Indicadores de desempenho na seleção da aventura
- Proteção contra pontuação duplicada
- Tela de conclusão com opção de repetir ou trocar a aventura
- API com filtros de faixa e tema sem expor a resposta correta

## Instalação e execução
```bash
npm install
python -m venv .venv && source .venv/bin/activate
pip install -r requirements.txt
cp .env.example .env
PYTHONPATH=backend uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
npm start
```

No simulador iOS, `http://localhost:8000` normalmente funciona. Em produção, configure `CORS_ORIGINS` com as origens permitidas, separadas por vírgula. Em Android Emulator, use `http://10.0.2.2:8000`. Em aparelho físico, ajuste `EXPO_PUBLIC_API_URL` no `.env` para o IP local do computador.

## Verificação
```bash
npm run check          # TypeScript + frontend + backend
npm run test:frontend
npm run test:backend
npm run doctor
```

## Estrutura
- `App.tsx`: composição e fluxo principal do app
- `src/components/`: seleção, desafio, estados e conclusão
- `src/services/`: API e persistência do progresso
- `src/types/` e `src/constants/`: contratos e configurações
- `backend/`: API FastAPI e testes
- `content/`: desafios e temas
- `docs/`: produto, arquitetura e pedagogia
