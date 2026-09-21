# BS Agro Capital — Site Institucional

**Landing page** institucional da BS Agro Capital: HTML puro, Tailwind CSS
via CDN + CSS customizado, JavaScript vanilla, sem framework e sem etapa de
build. Todo o conteúdo vive em uma única página (`index.html`), em seções
ancoradas. Foco em performance, SEO técnico, acessibilidade (contraste AA,
navegação por teclado, HTML semântico) e **geração de leads qualificados**
para crédito rural e soluções financeiras para o agro.

## Estratégia de geração de leads

O site foi estruturado para funcionar como canal de captação, não apenas
institucional:

- **Formulário no hero, em duas etapas**: o único formulário do site fica
  dentro de um cartão de vidro no topo da página (`#solicitar-analise`),
  não mais numa seção separada mais abaixo. Etapa 1 pergunta sobre a
  operação (modalidade, garantia, valor pretendido, necessidade) e só
  depois de validada libera a etapa 2 (nome, e-mail, telefone, empresa) —
  qualificar antes de pedir dados pessoais reduz a fricção inicial. As duas
  etapas são só visual (`hidden` num `<div>`, não em campo de formulário);
  o envio ao Formspree leva os dados das duas juntos.
- **Página única**: história, soluções, processo, prova social e o
  formulário ficam no mesmo scroll. Não existe navegação entre páginas para
  converter: todo CTA aponta para `#solicitar-analise`, que agora é o hero.
  O menu do topo é de âncoras e destaca a seção que está sendo lida.
- **CTA duplo em todas as seções**: "Solicitar análise de crédito"
  (formulário) + "Falar no WhatsApp" (contato direto e imediato) — dois
  caminhos de conversão para diferentes perfis de urgência.
- **Conteúdo de prova social** (depoimentos, cases, parceiros) posicionado
  antes dos pontos de conversão, para aumentar a confiança no momento da
  decisão.

Sugestões para evoluir isso após o lançamento (fora do escopo deste projeto,
pois dependem de ferramentas/contas do cliente): configurar analytics com
eventos de conversão por formulário/seção, testar variações de CTA (A/B), e
integrar o Formspree (ou CRM) a um funil de e-mail para leads que não
convertem no primeiro contato.

## Stack

- **HTML puro** — `index.html` (landing page de uma página só) e
  `privacidade.html`, sem gerador de site nem template engine.
- **CSS**: [Tailwind CSS via CDN](https://cdn.tailwindcss.com) (utilitários
  de layout) + `assets/styles.css` (tokens de cor, tipografia, o botão
  FlowButton, glassmorphism, animações) + `assets/tailwind-config.js`
  (paleta da marca, carregado depois do script do Tailwind).
- **JavaScript vanilla**, embutido em `<script>` no fim de cada página: menu
  mobile, header que solidifica ao sair do hero, destaque da seção ativa no
  menu, animação de entrada ao rolar, contagem animada dos indicadores,
  envio do formulário via `fetch`/Formspree.
- **[Lenis](https://github.com/darkroomengineering/lenis)** via CDN, só para
  o scroll suave (desligado automaticamente para quem pede menos movimento
  no sistema).
- **Raleway** (títulos) + **Roboto** (corpo), self-hosted em
  `assets/fonts/` — ambas sans-serif, conforme definido pelo cliente.
- Ícones **Lucide**, embutidos como SVG inline (sem dependência de runtime).

## Como abrir

Qualquer servidor estático serve. Exemplos:

```bash
node dev-server.cjs
# ou
npx serve .
# ou
python -m http.server 8000
```

Não abra `index.html` direto com duplo clique (`file://`): o `fetch` do
formulário e alguns navegadores bloqueiam certas requisições em `file://`.
Um servidor estático simples resolve — inclusive o próprio `dev-server.cjs`
deste projeto, que não precisa de nenhuma dependência externa.

## Publicar

O projeto é os arquivos desta pasta, sem build. Aponte a hospedagem estática
(Netlify, Vercel, GitHub Pages, Nginx...) direto para a raiz do repositório.
Antes de publicar, ver a seção **Pontos que precisam de revisão** abaixo.

## Estrutura

```
index.html              landing page — todas as seções, ancoradas (#sobre, #solucoes, ...)
privacidade.html         política de privacidade (noindex)
robots.txt
sitemap.xml
dev-server.cjs           servidor estático mínimo, só para desenvolvimento local
assets/
  styles.css             CSS customizado (tokens, FlowButton, header, formulário, animações)
  tailwind-config.js      paleta da marca para o Tailwind CDN
  fonts/                  Raleway 400/600 e Roboto 300/400/500, self-hosted (.woff2)
  img/
    logo/                 logo dourada e branca (header/rodapé) + os PNGs
                          originais enviados pelo cliente, mantidos como
                          fonte caso a logo precise de um recorte diferente
    hero/                 foto do hero em WebP (3 larguras) + fallback JPEG
    placeholders/         ilustrações placeholder das demais seções
```

## Performance: sobre o Tailwind via CDN

O `cdn.tailwindcss.com` (Play CDN) foi usado porque é exatamente o que foi
pedido: zero etapa de build. É importante entender a troca que isso implica,
porque a prioridade original deste projeto também era Lighthouse 90+:

- O Play CDN baixa o compilador completo do Tailwind (dezenas de KB de JS) e
  **recompila o CSS no navegador, a cada carregamento de página**. O próprio
  Tailwind [documenta que não é para
  produção](https://tailwindcss.com/docs/installation/play-cdn).
- Isso adia a primeira pintura da página (o HTML já chega com as classes,
  mas elas só viram CSS depois do JS rodar) e pesa no tempo de bloqueio
  principal (TBT), duas métricas que o Lighthouse mede diretamente.
- O aviso `cdn.tailwindcss.com should not be used in production` aparece no
  console em todo carregamento — é esperado, não é um erro do site.

**Se em algum momento a prioridade migrar de "zero build" para "melhor nota
de performance"**, a troca é mecânica e não exige reescrever nada:

1. Instalar o Tailwind localmente (`npm install -D tailwindcss`) e gerar um
   `assets/tailwind.css` estático a partir das classes usadas nas páginas,
   com o mesmo `tailwind-config.js` como fonte da paleta.
2. Trocar as duas tags `<script>` do Tailwind por
   `<link rel="stylesheet" href="assets/tailwind.css">`.
3. Nada no HTML, no `styles.css` customizado ou no JavaScript muda.

Até lá, o site funciona e passa por qualquer navegador moderno; só não vai
atingir 90+ no Lighthouse por causa dessa peça específica.

## Sistema de design

Elementos que definem o padrão visual:

- **Cabeçalho de seção**: só um rótulo em versalete (sem pílula/badge, sem
  círculo numerado) seguido do título e, quando cabe, um parágrafo de
  introdução — padrão mais leve, sem o círculo "01, 02, 03..." que o site
  usava antes.
- **Fatias bem definidas, poucas seções**: a página inteira tem 7
  `<section>` (hero, sobre, soluções, como funciona, propósito/diferenciais,
  prova social, CTA final), cada uma identificada por um comentário HTML
  (`<!-- SOBRE -->` etc.) — mesma lógica de organização do site de
  referência do cliente. Temas próximos que antes eram seções cheias
  separadas (ex.: Quem somos, História, Citação, Especialista e Indicadores)
  agora são blocos dentro da MESMA seção, divididos por um filete fino
  (`border-t`) em vez de uma nova seção com seu próprio respiro vertical —
  é o que deixou a página bem mais curta sem cortar nenhum texto.
- **Botão de CTA / FlowButton** (classe `.cta-btn` em `assets/styles.css`):
  100% CSS, sem JavaScript. No hover a seta entra pela esquerda e sai pela
  direita, um círculo expande do centro preenchendo o fundo com um
  gradiente dourado (`gold-600 → gold-500 → gold-400`), o texto desliza e a
  pílula vira um retângulo de 12px. O mesmo conjunto de estados responde a
  `:focus-visible`, para que quem navega por teclado veja a mesma resposta
  de quem usa mouse.

  Três variantes, pela classe adicional:

  | Classe | Aparência | Onde usar |
  |---|---|---|
  | *(nenhuma)* | gradiente dourado, abre para o verde-floresta | CTA principal, sobre qualquer fundo |
  | `.cta-btn--outline` | contorno claro, abre para o off-white | fundos escuros: `olive-900`, `graphite-950`, foto do hero |
  | `.cta-btn--dark` | contorno verde, abre para o verde-floresta | fundos claros: `paper`, `olive-50` |

  ```html
  <a href="#solicitar-analise" class="cta-btn">
    <svg class="cta-btn__arrow cta-btn__arrow--left" viewBox="0 0 24 24" aria-hidden="true"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
    <span class="cta-btn__text">Solicitar análise de crédito</span>
    <span class="cta-btn__circle" aria-hidden="true"></span>
    <svg class="cta-btn__arrow cta-btn__arrow--right" viewBox="0 0 24 24" aria-hidden="true"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
  </a>
  ```

  - O anel de 1px do `box-shadow` não é decorativo: quando o círculo verde
    preenche um botão que está sobre uma seção também verde, é ele que
    continua delimitando o botão.
  - `background-image: none` nas variantes `--outline` e `--dark` é
    proposital: `background-color: transparent` sozinho não basta, porque
    `background-image` é uma propriedade independente e continuaria
    herdando o gradiente dourado da regra base.
  - Com `prefers-reduced-motion: reduce`, o estado final do hover é o mesmo
    de todo mundo; a regra global em `styles.css` zera a duração das
    transições, então a mudança acontece instantaneamente em vez de animar.
    O componente não sobrescreve o estado final.
- **Glassmorphism**: cartões de vidro em duas situações.
  - `.glass-card` / `.glass-card--dark` (`blur(20px)`, translúcido a
    55%/6%): só onde há um gradiente de marca controlado por baixo —
    depoimentos, o cartão da especialista e os indicadores da empresa.
  - `.glass-card--hero` (`blur(24px)`, translúcido a 90%): o cartão do
    formulário no hero, que fica direto sobre a foto. A opacidade é bem mais
    alta que as outras duas porque a foto muda de brilho conforme o recorte
    e a posição do cartão — mesmo no pior caso (cartão sobre um pixel quase
    preto), o texto escuro ainda mede 13,9:1 de contraste.
- **Formulário do hero, em duas etapas**: `[data-form-step="1"]` (Sobre a
  operação) e `[data-form-step="2"]` (Seus dados), alternados por
  `hidden` no JS (`assets/styles.css`/`index.html`, função `ligarFormulario`
  do script no fim da página). Importante: `hidden` num ancestral não tira
  os campos da validação nativa do HTML (só `disabled` faz isso, e
  `disabled` também tiraria o campo do envio) — por isso o clique em
  "Continuar" valida a etapa 1 manualmente, e o envio final valida só os
  campos da etapa visível, nunca `form.checkValidity()` no formulário
  inteiro.
- **Botão flutuante do WhatsApp**: redondo, na cor oficial do WhatsApp
  (`#25D366`), não na paleta da marca — de propósito, é um botão de canal
  externo. O ícone branco sobre esse verde mede 1,98:1, abaixo do mínimo de
  3:1 para elementos gráficos; é a combinação oficial da marca WhatsApp,
  replicada assim na maioria dos botões do gênero na web, e o nome
  acessível continua garantido via `aria-label`. Ver o comentário em
  `assets/styles.css` se algum dia isso precisar ficar 100% AA.
- **Ritmo de seções**: alternância entre claro (`paper`), tingido
  (`olive-50`) e escuro (`graphite-950` / `olive-900`), com respiro vertical
  de 80px (mobile) a 128px (desktop).
- **Cartões e listas planos**: sem sombra e sem cantos arredondados,
  separados por filete superior (`border-t`) em vez de caixas.
- **Formulários com campos sublinhados**, em versão clara e escura.
- **Hero de tela cheia** com foto sangrando até as bordas, texto sobreposto
  e cabeçalho transparente que se solidifica ao sair do hero (via
  `IntersectionObserver`).

### Tokens

Definidos como variáveis CSS em `assets/styles.css` e espelhados em
`assets/tailwind-config.js` (mudar uma cor exige editar os dois lugares):

- **Verde** `olive-950` a `olive-50` — cor institucional, extraída da logo real.
- **Dourado** `gold-800` a `gold-300` — destaque, CTAs e números de indicadores.
- **Neutros** `graphite-950` a `graphite-300` e `paper` (`#fbf9f4`) — texto e fundos.

## Pontos que precisam de revisão antes da publicação

O conteúdo foi escrito de forma institucional, sem inventar dados factuais,
taxas, prazos, parceiros ou referências legais. Os seguintes pontos estão
marcados no código com comentários e/ou placeholders visíveis e **precisam
ser preenchidos ou revisados antes de publicar o site**. O e-mail e o
endpoint do Formspree estão hardcoded em **dois lugares** (`index.html` e
`privacidade.html`, mais o JSON-LD em cada `<head>`) — não há um arquivo
central de dados, então usar busca e substituição em todo o diretório em vez
de editar arquivo por arquivo:

1. **Dados de contato**: endereço, CNPJ e WhatsApp já estão preenchidos com
   os dados reais (Av. 136, 960 - St. Marista, Goiânia - GO, 74180-140;
   CNPJ 66.308.795/0001-08; WhatsApp (62) 99923-2488). Faltam duas coisas:
   - **E-mail institucional**, ainda como `[INSERIR E-MAIL]`. Aparece no
     rodapé, na seção de contato e na Política de Privacidade, e precisa ser
     acrescentado também ao schema.org no `<head>` das duas páginas.
   - **Confirmar se o WhatsApp comercial recebe ligações de voz.** Ele está
     sendo usado também como telefone (gera um link `tel:`). Se a linha for
     exclusiva de WhatsApp, remover esse campo do rodapé e da seção de
     contato para não oferecer um canal que não existe.
2. **Redes sociais**: links de LinkedIn/Instagram no rodapé, ainda como
   `[INSERIR LINK DO LINKEDIN]` / `[INSERIR LINK DO INSTAGRAM]`.
3. **Domínio definitivo**: usado no `<link rel="canonical">`, no Open Graph
   e no `robots.txt`/`sitemap.xml`. Atualizar para o domínio real antes do
   deploy.
4. **Indicadores institucionais** (seção "Ano de fundação" etc.): ano de
   fundação, número de operações, volume de crédito, marcados como
   `[INSERIR DADO]`.
5. **Formulário de contato**: a `action` aponta para um endpoint placeholder
   do Formspree (`[INSERIR_ID_FORMSPREE]`). Configurar um endpoint real
   antes de publicar — sem isso, o JS detecta o placeholder e mostra um
   aviso em vez de tentar enviar.
6. **Política de Privacidade** (`privacidade.html`): texto genérico sobre
   LGPD, sinalizado como placeholder. **Precisa de revisão jurídica** antes
   da publicação.
7. **Seção de Recuperação Judicial**: propositalmente não cita leis, artigos
   ou jurisprudência. Revisar com jurídico antes de publicar, caso seja
   necessário incluir referências legais.
8. **Imagens**: o Hero já usa uma fotografia real (`assets/img/hero/`) e a
   logo real está integrada no header/rodapé/favicon (`assets/img/logo/`).
   As demais ilustrações (Sobre, Soluções, galeria) ainda são placeholders
   em `assets/img/placeholders/`; substituir por fotografias reais mantendo
   os textos alternativos (`alt`) atualizados.
9. **Imagem Open Graph** (`og-image.svg`): ainda é um placeholder simples;
   substituir por uma imagem de compartilhamento definitiva (1200x630),
   idealmente usando a logo real.
10. **Especialista responsável** (seção "Especialista responsável"): nome,
    cargo e trajetória de Évellyn Brandão já estão preenchidos com dados
    reais fornecidos pela BS Agro Capital. Falta apenas inserir a **foto
    real** (hoje é um ícone placeholder), mediante validação final antes da
    publicação.
11. **Depoimentos** (seção "Depoimentos"): os três depoimentos são
    placeholders estruturais. **Não publicar depoimentos fictícios** —
    substituir por depoimentos reais, com autorização expressa de cada
    cliente citado.
12. **Cases de operações** (seção "Cases"): os cases são um template
    (situação/solução/resultado). Substituir por casos reais e
    anonimizados, respeitando a confidencialidade dos clientes e, se
    necessário, validação jurídica sobre o que pode ser divulgado.
13. **Parceiros e instituições financeiras** (seção "Rede de capital"): os
    slots de logo são placeholders genéricos. Inserir apenas logotipos e
    nomes de instituições com parceria vigente e autorização expressa de
    cada uma.
14. **Vídeo institucional**: hoje o site não embute vídeo. Se houver um
    vídeo real, adicionar um embed de YouTube/Vimeo na seção correspondente.

> Os itens 10 a 13 envolvem identidade de pessoas reais, depoimentos de
> clientes e relações comerciais. Foram deliberadamente mantidos como
> placeholders estruturais, e não preenchidos com exemplos fictícios, para
> evitar que informações inventadas sejam publicadas como se fossem reais.

## Acessibilidade e performance

- Contraste de cores verificado (mínimo AA, 4.5:1 para texto normal e 3:1
  para texto grande e elementos não textuais).
- Navegação por teclado com foco visível e link "Ir para o conteúdo
  principal".
- Hierarquia semântica de headings (um único `<h1>` por página).
- Formulário de contato com validação nativa HTML5 + mensagens de erro
  acessíveis (`aria-invalid`, `role="alert"`), incluindo foco automático no
  primeiro campo inválido.
- Fontes self-hosted (sem dependência de CDN externo) para reduzir
  requisições e melhorar performance.
- Botão flutuante do WhatsApp: no mobile os botões de CTA acompanham a
  largura do texto, em vez de ocupar a linha inteira, para que a ponta
  direita não passe por baixo do botão flutuante fixo no canto.
