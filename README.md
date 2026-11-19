# 🎹 Dicionário de Acordes e Inversões no Teclado

> Aplicação web interativa para consulta de digitações de acordes no teclado/piano, estudo de inversões harmônicas em tempo real, suporte nativo a controladores MIDI (teclados USB/Bluetooth), motor de áudio com múltiplos timbres (Piano Acústico, Rhodes, Sintetizadores) e sequenciador de repertório ilimitado com Drag & Drop (mouse e touch).

Desenvolvido na stack moderna: **Next.js 15 (App Router)**, **TypeScript**, **Tailwind CSS**, **Web MIDI API**, **smplr** e **Tone.js**.

---

## 🚀 Funcionalidades

### 🎹 Conectividade MIDI & Motor de Áudio Multi-Timbre
- **Web MIDI API Nativa:** Conecte qualquer teclado controlador MIDI USB ou Bluetooth diretamente ao navegador, sem necessidade de drivers ou softwares intermediários.
- **Lista de Seleção (Dropdown) com Monitor de Carregamento em Tempo Real:**
  - Seletor em lista suspensa (`<select>`) elegante com status de cada timbre (`[Carregado]`).
  - **Indicador de Progresso Real (%):** Monitora o download e decodificação das amostras de áudio com porcentagem numérica (0% a 100%) e barra de progresso visual animada.
  - **Badge de Status:** Feedback claro entre `Carregando...`, `Carregado` (com indicador verde pulsante) e carregamento automático por padrão.
- **Chave de Sustain (ON / OFF) & Suporte a Pedal Físico:**
  - **Chave Minimalista na Interface:** Permite alternar entre *Sustain: ON* e *Sustain: OFF* com um clique na tela, sem animações piscantes.
  - **Sustain OFF:** O som cessa de forma instantânea e limpa assim que a tecla ou acorde é liberado.
  - **Sustain ON:** As notas se prolongam por mais tempo (+2,5 segundos) após você soltar as teclas, permitindo transições harmônicas suaves e sem buracos sonoros entre as trocas de acordes.
  - **Integração com Pedal Físico (CC 64):** Se você conectar um pedal de sustain ao controlador MIDI, pisar no pedal ativa a chave automaticamente na tela em tempo real.
- **Timbres Especializados em Gospel Worship, R&B e Blues (Motor de Áudio smplr):**
  - **Piano de Cauda (Grand Piano):** Amostras acústicas de alta fidelidade de um Steinway Grand Piano com dinâmica multi-velocity expressiva via `SplendidGrandPiano` do `smplr`.
  - **FM E. Piano (Yamaha DX7):** Clássico piano elétrico FM cristalino estilo DX7 via Soundfont `electric_piano_2` do `smplr`.
  - **Worship Ambient Pad:** Halo Pad aveludado e quente para cama sonora de adoração via Soundfont `pad_7_halo` do `smplr`.
  - **Soft Silk Strings:** Cordas orquestrais lentas (*slow strings*) macias e sedosas via Soundfont `string_ensemble_2` do `smplr`.
  - **Neo-Soul Rhodes:** Fender Rhodes Mark I clássico encorpado para R&B e Soul via Soundfont `electric_piano_1` do `smplr`.
  - **Órgão Hammond B3:** Órgão Drawbar com simulação de rotor Leslie via Soundfont `drawbar_organ` do `smplr`.
- **Iluminação em Tempo Real no Teclado Virtual:** As teclas tocadas fisicamente no controlador MIDI acendem instantaneamente no teclado virtual na tela com brilho esmeralda.
- **Detecção Inteligente de Acordes:** Ao pressionar notas no controlador MIDI, o sistema reconhece os intervalos e identifica o acorde tocado (ex.: *Acorde Tocado: C7M*), permitindo salvá-lo diretamente no próximo slot com um clique.
- **Preview de Áudio nos Cards e Slots:** Botões de áudio (🔊 Ouvir) nas inversões e nos slots salvos para escutar qualquer acorde em arpejo ou bloco sonoro.
- **Teclas Interativas:** Clique em qualquer tecla do piano virtual na tela para emitir o som correspondente.

---

### 🎼 Dicionário Harmônico Completo
- **Tríades:**
  - Maior ($M$)
  - Menor ($m$)
  - Diminuto ($dim$ / $\circ$)
  - Aumentado ($aug$ / $+$)
- **Sétimas (Tétrades):**
  - Com 7ª Dominante ($7$)
  - Com 7ª Maior ($7M$ / $maj7$)
  - Menor com 7ª ($m7$)
  - Menor com 7ª Maior ($m7M$)
  - Meio-Diminuto ($m7(b5)$ / $\varnothing$)
  - Diminuto Completo ($dim7$ / $\circ$)
- **Suspensos e Sextas:**
  - Suspenso de 4ª ($sus4$)
  - Suspenso de 2ª ($sus2$)
  - 7ª com 4ª Suspensa ($7sus4$)
  - Com 6ª Maior ($6$)
  - Menor com 6ª ($m6$)
- **Nonas:**
  - Com 9ª Adicionada ($add9$)
  - Menor com 9ª Adicionada ($m(add9)$)
  - Dominante com 9ª ($9$)
  - Maior com 7ª e 9ª ($7M(9)$ / $maj9$)
  - Menor com 7ª e 9ª ($m9$)
- **Sustenidos (#):**
  - Sustenido ($#$)
  - Sustenido Menor ($#m$)
  - Com 5ª Aumentada ($\#5$)
  - Com 7ª e 5ª Aumentada ($7(\#5)$)
  - Com 7ª e 9ª Aumentada ($7(\#9)$)
  - Com 7ª Maior e 11ª Aumentada ($7M(\#11)$)
- **Bemóis (b):**
  - Bemol ($b$)
  - Bemol Menor ($bm$)
  - Com 5ª Diminuta ($b5$)
  - Com 7ª e 5ª Diminuta ($7(b5)$)
  - Com 7ª e 9ª Menor ($7(b9)$)
  - Meio-Diminuto ($m7(b5)$)
  - Com 7ª e 13ª Menor ($7(b13)$)

---

### 🎹 Visualização de Inversões em Tempo Real
- **Atualização Instantânea:** Altere a tônica ou o tipo de acorde e visualize a digitação montada imediatamente nos teclados renderizados.
- **Inversões Dinâmicas:**
  - **Estado Fundamental:** Tônica no baixo.
  - **1ª Inversão:** Terça (ou grau correspondente) no baixo.
  - **2ª Inversão:** Quinta no baixo.
  - **3ª Inversão (Sétima no Baixo):** Ativada dinamicamente para tétrades e acordes com 4 notas ou mais (ex.: $Am7$, $C7$, $F7M$, $Bm7(b5)$).
- **Detalhamento das Notas:** Cada variação exibe um badge com a relação ordenada das notas tocadas (ex.: *Notas: G • A • C • E*).
- **Notação Enarmônica Inteligente:** O teclado adapta os acidentes automaticamente entre sustenidos e bemóis de acordo com a tonalidade selecionada.

---

### 🎵 Slots Ilimitados (Sequenciador de Repertório)
- **Sequenciador Expansível e Ilimitado:** Inicialmente, são exibidos 3 slots vazios prontos para uso. O usuário pode adicionar quantos slots desejar através do botão **"+"** posicionado ao lado do último slot na grade.
- **Mini-Teclado Dedicado por Slot:** Cada slot salvo renderiza um teclado individual com as teclas daquela montagem acesas e botão de reprodução de áudio.
- **Reordenação por Drag & Drop:** Troque a ordem de dois slots simplesmente arrastando e soltando (*swap*), com suporte tanto a mouse (desktop) quanto a toque nativo (*touch events* para smartphones e tablets).
- **Trava de Segurança (Lock):** Bloqueie slots individualmente contra movimentação acidental ou exclusão involuntária.
- **Recarregar para Edição:** Botão **Visualizar** que carrega qualquer acorde salvo de volta aos seletores principais e rola a tela suavemente até os controles.
- **Persistência em `localStorage`:** Sua progressão salva é preservada no navegador mesmo ao recarregar a página ou fechar a aba.
- **Limpeza Segura:** Exclusão individual de acordes ou remoção de slots extras através de modal de confirmação acessível, além de botão para limpar e resetar toda a sequência.

---

### 📱 Responsividade Fluida & Dark Mode (Mobile-First)
- **Dimensionamento Dinâmico:** Teclas calculadas com CSS Custom Properties e `clamp()`, ajustando-se automaticamente à largura da tela sem quebras visuais.
- **Teclado de 2 Oitavas:** Cabe com ergonomia em telas a partir de 320px até monitores ultrawide com rolagem horizontal suave quando necessário.
- **Touch-Friendly:** Controles e botões com alvos de toque confortáveis.
- **Tema Escuro Moderno:** Interface escura (*Dark Mode*) de alto contraste com destaque em tons de roxo/violeta (`#8257e5`).

---

## 🛠️ Tecnologias Utilizadas

- **[Next.js 15](https://nextjs.org/)** (App Router)
- **[React 19](https://react.dev/)**
- **[TypeScript 5](https://www.typescriptlang.org/)** (Tipagem estrita e robusta)
- **[Tailwind CSS](https://tailwindcss.com/)** (Estilização utilitária e responsiva)
- **[Web MIDI API](https://developer.mozilla.org/en-US/docs/Web/API/Web_MIDI_API)** (Conexão nativa e zero-latency com teclados e controladores USB)
- **[smplr](https://github.com/danigb/smplr)** (Samples acústicos reais de Piano Steinway e Pianos Elétricos)
- **[Tone.js](https://tonejs.github.io/)** (Framework Web Audio profissional para síntese polifônica)
- **[Lucide React](https://lucide.dev/)** (Ícones modernos e acessíveis)

---

## 📂 Estrutura do Projeto

```text
acordes_teclado/
├── src/
│   ├── app/
│   │   ├── globals.css             # Diretivas Tailwind, variáveis CSS e estilos do piano
│   │   ├── layout.tsx              # Layout raiz com fontes e metadados SEO
│   │   └── page.tsx                # Página principal com orquestração de estado, áudio e MIDI
│   ├── components/
│   │   ├── Header.tsx              # Cabeçalho da aplicação
│   │   ├── AudioControls.tsx       # Status do controlador MIDI, seletor de timbres e volume
│   │   ├── ControlsCard.tsx        # Painel de seletores (Nota, Tipo, Inversão, Destino)
│   │   ├── Piano.tsx               # Componente do teclado de 2 oitavas (Normal e Mini) com feedback live
│   │   ├── ChordInversionCard.tsx  # Card de inversão com botões de áudio e salvar
│   │   ├── SlotsSection.tsx        # Sequenciador ilimitado com Drag & Drop e reprodução
│   │   ├── ConfirmModal.tsx        # Modal acessível de confirmação de exclusão
│   │   ├── Toast.tsx               # Notificações flutuantes animadas
│   │   └── Footer.tsx              # Rodapé com créditos do desenvolvedor
│   ├── constants/
│   │   ├── audio.ts                # Configurações e definições dos timbres disponíveis
│   │   └── chords.ts               # Escalas cromáticas, intervalos, categorias e opções
│   ├── hooks/
│   │   ├── useAudioEngine.ts       # Motor de áudio multi-timbre (smplr + Tone.js)
│   │   ├── useWebMidi.ts           # Integração nativa com a Web MIDI API
│   │   └── useChordSlots.ts        # Gerenciamento de slots, persistência e modais
│   ├── types/
│   │   ├── audio.ts                # Tipos para timbres, áudio e estado MIDI
│   │   └── music.ts                # Interfaces e tipagens do domínio musical
│   └── utils/
│       ├── midiHelper.ts           # Mapeamento de notas MIDI e detector inteligente de acordes
│       └── musicTheory.ts          # Cálculos de intervalos cromáticos e inversões
├── .gitignore
├── next.config.ts
├── package.json
├── postcss.config.mjs
├── tailwind.config.ts
├── tsconfig.json
└── README.md
```

---

## 💻 Como Executar o Projeto

### Pré-requisitos
- **Node.js** v18.17+ ou superior (recomendado v20+)
- **npm**, **yarn** ou **pnpm**

### Instalação

1. Clone o repositório:
   ```bash
   git clone https://github.com/seu-usuario/acordes-teclado.git
   cd acordes-teclado
   ```

2. Instale as dependências:
   ```bash
   npm install
   ```

3. Inicie o servidor de desenvolvimento:
   ```bash
   npm run dev
   ```

4. Abra [http://localhost:3000](http://localhost:3000) no seu navegador, conecte seu teclado MIDI via USB e comece a tocar!

### Build de Produção

```bash
npm run build
npm start
```

---

## 👨‍💻 Autor

Desenvolvido por **[Junior Pinho | DEV](https://www.juniorpinhodev.com.br)**
