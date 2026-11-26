# Diagnóstico e Correção de Deploy: Migração HTML/CSS para Next.js no Netlify

## Contexto do Problema
Este repositório (`acordes_teclado`, publicado no Netlify como `meuteclado`) foi originalmente construído apenas com HTML e CSS estáticos. Recentemente, o projeto foi refatorado para **Next.js 15 (App Router), TypeScript e Tailwind CSS** e enviado para a branch `main`.

Porém, após o push e o deploy no Netlify, a nova versão em Next.js **não entrou no ar**. O site continua exibindo a versão antiga.

### Evidências observadas no Netlify e no GitHub
1. **Tempo de build muito curto:** O deploy no Netlify levou apenas ~11 segundos, indicando que o comando `next build` provavelmente não foi executado.
2. **Arquivos publicados crus:** O *Deploy file browser* do Netlify mostra os arquivos-fonte da raiz do repositório (`src/`, `package.json`, `next.config.ts`, etc.) sendo servidos diretamente, junto com um arquivo `index.html` legado (~75 KB) na raiz do projeto.
3. **Configuração herdada:** Como o projeto nasceu estático no Netlify, há forte indício de que o Netlify ainda está tratando a raiz do repositório como pasta de publicação estática, sem rodar o build do Next.js.

---

## Sua Missão

Atue de forma investigativa antes de alterar qualquer arquivo. **Não assuma que o `index.html` é o único problema.** Siga as etapas abaixo em ordem:

### Etapa 1: Diagnóstico e Confirmação
Verifique o estado atual do repositório e me apresente um breve diagnóstico respondendo:
1. **Arquivo `index.html` na raiz:** Confirme se o `index.html` da raiz é apenas um resquício da versão antiga e se nenhum código do projeto Next.js depende dele.
2. **Configuração do Next.js (`next.config.ts` e `package.json`):**
   - Verifique o `package.json` (scripts de `build`, `start`, versão do Next.js e dependências).
   - Verifique o `next.config.ts` para identificar se o projeto usa renderização padrão do Next.js (`.next`) ou exportação estática (`output: 'export'`, pasta `out`).
3. **Configuração do Netlify (`netlify.toml`):** Verifique se existe um arquivo `netlify.toml` no projeto ou se o deploy depende apenas das configurações manuais do painel do Netlify.
4. **Teste de build local:** Execute `npm run build` localmente para confirmar se o projeto compila sem erros de TypeScript, ESLint, imports ou dependências (como Web MIDI, `smplr` ou `Tone.js` em SSR).

---

### Etapa 2: Execução da Solução
Após confirmar as causas na Etapa 1, execute as correções necessárias no projeto:

1. **Limpeza de arquivos legados:**
   - Remova o `index.html` antigo da raiz (e qualquer outro arquivo estático legado que não faça parte do Next.js), caso confirmado que não é mais utilizado.
2. **Correção de eventuais erros de build:**
   - Se o `npm run build` falhar na Etapa 1, corrija os erros encontrados (ex.: uso de APIs de navegador fora de `useEffect` / `'use client'`, tipagem TypeScript, etc.) até que o build passe 100%.
3. **Criação/Ajuste do `netlify.toml`:**
   - Crie (ou atualize) um arquivo `netlify.toml` na raiz do repositório para garantir que o Netlify sempre execute o build corretamente, sobrescrevendo configurações antigas de site estático:
     - Se o projeto usar Next.js padrão (SSR/App Router): configure `command = "npm run build"` e `publish = ".next"`.
     - Se o projeto usar `output: 'export'`: configure `command = "npm run build"` e `publish = "out"`.
4. **Validação final:**
   - Rode `npm run build` novamente para validar que tudo compila sem erros após as alterações.
   - Mostre o `git status` e um resumo claro do que foi alterado.

---

### Etapa 3: Orientações para o Painel do Netlify (se necessário)
Ao finalizar as alterações no código, informe explicitamente quais ajustes manuais (se houver) eu ainda preciso fazer no painel web do Netlify — por exemplo:
- Confirmar se o **Runtime** está definido como **Next.js** em *Project configuration > Build & deploy > Build settings*.
- Fazer um **Clear cache and deploy site** após o `git push` para a branch `main`.

> **Importante:** Antes de executar `git push`, me mostre o resumo das alterações realizadas e aguarde minha confirmação (ou apenas deixe o commit pronto se preferir).