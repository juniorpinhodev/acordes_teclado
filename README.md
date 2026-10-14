# acordes_teclado
 🎹 Dicionário de acordes e inversões no teclado com sequenciador de repertório


Uma aplicação web moderna, responsiva e interativa desenvolvida em **HTML5, CSS3 e JavaScript Vanilla** (sem frameworks ou dependências externas) para consulta de digitações de acordes no teclado/piano, estudo de inversões e montagem de progressões harmônicas com até 10 slots de memória.

---

## 🚀 Funcionalidades

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
- **Atualização Instantânea:** Altere a tônica ou o tipo de acorde e veja a digitação montada imediatamente nos teclados.
- **Inversões Dinâmicas:**
  - **Estado Fundamental:** Tônica no baixo.
  - **1ª Inversão:** Terça (ou grau correspondente) no baixo.
  - **2ª Inversão:** Quinta no baixo.
  - **3ª Inversão (Sétima no Baixo):** Ativada dinamicamente para tétrades e acordes de 4 notas (ex.: $Am7$, $C7$, $F7M$, $Bm7(b5)$).
- **Detalhamento das Notas:** Cada variação exibe um badge com a relação ordenada das notas tocadas (ex.: *Notas: G • A • C • E*).

---

### 🎵 10 Slots de Memória (Progressão da Música)
- **Sequenciador de Repertório:** Salve até 10 acordes sequenciais para ensaiar a harmonia de uma música inteira (ex.: $C \rightarrow G \rightarrow Am \rightarrow F$).
- **Mini-Teclado Dedicado:** Cada slot salvo renderiza um teclado individual com as teclas daquela montagem acesas.
- **Reordenação por Drag & Drop:** Troque a ordem de dois slots simplesmente arrastando e soltando (*swap*), com suporte tanto a mouse (desktop) quanto a toque nativo (smartphones e tablets).
- **Recarregar para Edição:** Botão **Visualizar** que carrega qualquer acorde salvo de volta aos seletores principais.
- **Persistência em `localStorage`:** Sua progressão salva é preservada mesmo ao recarregar a página ou fechar o navegador.
- **Limpeza Rápida:** Exclua slots individualmente ou utilize o botão **Limpar Todos**.

---

### 📱 Responsividade Fluida (Mobile-First)
- **Dimensionamento Dinâmico:** Teclas calculadas com CSS Custom Properties e `clamp()`, ajustando-se automaticamente à largura da tela.
- **Sem Quebras de Layout:** O teclado de 2 oitavas cabe com ergonomia e nitidez em smartphones a partir de 320px de largura até telas ultrawide.
- **Touch-Friendly:** Controles e botões com alvos de toque confortáveis (mínimo de 46px de altura).
- **Tema Escuro Moderno:** Interface escura (*Dark Mode*) de alto contraste com destaque em tons de roxo/violeta (`#8257e5`).

---

## 🛠️ Tecnologias Utilizadas

- **HTML5:** Estrutura semântica e API nativa de Drag & Drop.
- **CSS3:** Flexbox, CSS Grid, variáveis customizadas (`:root`), funções `clamp()` e animações suaves.
- **JavaScript (ES6+):** Lógica musical de intervalos cromáticos, condução de vozes, renderização dinâmica do DOM e persistência local (`localStorage`).

> **Zero Dependências:** Não requer Node.js, npm, bundlers ou frameworks.

---

## 💻 Como Executar o Projeto

1. Clone ou baixe este repositório:
   ```bash
   git clone https://github.com/seu-usuario/acordes-teclado.git
   ```
2. Abra o arquivo [`acordes_teclado.html`](acordes_teclado.html) diretamente em qualquer navegador moderno (Google Chrome, Mozilla Firefox, Microsoft Edge, Safari, Opera).
3. *(Opcional)* Se preferir rodar em um servidor local com live-reload, utilize a extensão **Live Server** no VS Code ou o comando:
   ```bash
   npx serve .
   ```

---

## 📂 Estrutura de Arquivos

```text
acordes_teclado/
├── acordes_teclado.html   # Aplicação completa (HTML, CSS e JS autocontidos)
└── README.md              # Documentação do projeto
```

---

## 👨‍💻 Autor

Desenvolvido por **[Junior Pinho | DEV](https://www.juniorpinhodev.com.br)**
