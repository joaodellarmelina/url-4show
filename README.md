# URL 4show

Site com experiência de scroll para **showroom** de links.

![Example](app/opengraph-image.png)

Uma página de links animada com `Next.js`, `GSAP` e `@bsmnt/scrollytelling`.

A proposta do projeto é simples: você mantém seus links em um arquivo JSON, personaliza os metadados em outro JSON, e a home gera uma experiência de scroll com destaque no item central.


## O que este projeto entrega

- Home com scroll vertical animado e viewport fixo
- Link central em destaque
- Links periféricos com escala e opacidade reduzidas
- Navegação por scroll, teclado e botões
- Configuração dos links via `JSON`
- Configuração de metadados/SEO via `JSON`

## Stack

- `Next.js 16`
- `React 19`
- `TypeScript`
- `GSAP`
- `@bsmnt/scrollytelling`

## Requisitos

Antes de começar, tenha instalado:

- `Node.js 20+`
- `pnpm`

Se você ainda não tiver `pnpm`:

```bash
npm install -g pnpm
```

## Instalação

Clone o repositório:

```bash
git clone <URL_DO_REPOSITORIO>
cd url-exhibition
```

Instale as dependências:

```bash
pnpm install
```

Inicie o projeto em desenvolvimento:

```bash
pnpm dev
```

Abra no navegador:

```text
http://localhost:3000
```


## Estrutura importante

Os arquivos que você provavelmente vai editar com mais frequência são:

- `data/links.json`
- `data/site-metadata.json`
- `components/link-exhibition.tsx`
- `components/link-exhibition.module.css`

## Como adicionar ou editar links

Todos os links da página ficam em:

[`data/links.json`](./data/links.json)

Estrutura de cada item:

```json
{
  "id": "blog",
  "title": "Blog",
  "subtitle": "joaodellarmelina.com",
  "href": "https://joaodellarmelina.com"
}
```

### Campos

- `id`: identificador único do item
- `title`: texto principal exibido
- `subtitle`: texto secundário exibido abaixo do título
- `href`: URL aberta ao clicar no item central

### Exemplo

```json
[
  {
    "id": "linkedin",
    "title": "LinkedIn",
    "subtitle": "",
    "href": "https://www.linkedin.com/in/seu-usuario/"
  },
  {
    "id": "github",
    "title": "GitHub",
    "subtitle": "github.com/seu-usuario",
    "href": "https://github.com/seu-usuario"
  },
  {
    "id": "blog",
    "title": "Blog",
    "subtitle": "meusite.com",
    "href": "https://meusite.com"
  }
]
```

## Link padrão na abertura

Hoje o projeto tenta abrir sempre com o item cujo `id` é:

```json
"first"
```

Se você quiser manter esse comportamento, garanta que exista um item com:

```json
{
  "id": "first"
}
```

Se você quiser trocar o padrão, altere a constante `DEFAULT_LINK_ID` em:

[`components/link-exhibition.tsx`](./components/link-exhibition.tsx)

## Como editar os metadados da página

Os metadados ficam em:

[`data/site-metadata.json`](./data/site-metadata.json)

Você pode alterar:

- `title`
- `description`
- `applicationName`
- `keywords`
- `authors`
- `creator`
- `publisher`
- `metadataBase`
- `openGraph`
- `twitter`
- `robots`

### Exemplo

```json
{
  "title": "Links | Seu Nome",
  "description": "Minha página de links.",
  "applicationName": "URL Exhibition",
  "metadataBase": "https://links.seudominio.com",
  "openGraph": {
    "title": "Links | Seu Nome",
    "description": "Minha página de links.",
    "url": "https://links.seudominio.com",
    "siteName": "URL Exhibition",
    "locale": "pt_BR",
    "type": "website"
  }
}
```

## Como personalizar o visual

### Layout e comportamento

A lógica principal do scrollytelling está em:

[`components/link-exhibition.tsx`](./components/link-exhibition.tsx)

Ali você pode ajustar:

- item inicial
- progressão do scroll
- escala dos itens
- opacidade
- blur
- navegação por teclado
- clique no item ativo

### Estilo

O CSS principal está em:

[`components/link-exhibition.module.css`](./components/link-exhibition.module.css)

Ali você pode ajustar:

- background
- tipografia
- posição dos links
- setas laterais
- controles
- fade superior e inferior
- responsividade

## Fluxo recomendado para quem for usar open source

### 1. Fork ou clone o projeto

Crie sua cópia do repositório e instale as dependências.

### 2. Edite seus links

Troque o conteúdo de `data/links.json` pelos seus links reais.

### 3. Edite seus metadados

Atualize `data/site-metadata.json` com seu domínio, título e descrição.

### 4. Ajuste o visual

Se quiser que fique mais parecido com sua identidade visual, altere o CSS do módulo.

### 5. Valide localmente

Antes de publicar:

```bash
pnpm lint
pnpm build
```

### 6. Publique

Você pode publicar em qualquer plataforma compatível com Next.js, como:

- Vercel
- Netlify
- Railway
- servidor Node próprio

## Deploy na Vercel

A forma mais simples é:

1. subir o projeto para o GitHub
2. importar o repositório na Vercel
3. deixar os comandos padrão:

```text
Install Command: pnpm install
Build Command: pnpm build
Output: Next.js default
```

## Boas práticas para contribuir

Se você for abrir o projeto para outras pessoas usarem:

- mantenha `links.json` com exemplos simples
- evite colocar links pessoais sensíveis no template
- documente qualquer mudança de comportamento no README
- rode `pnpm lint` antes de subir alterações

## Licença

Este projeto está sob a licença `MIT`. Veja o arquivo [`LICENSE`](./LICENSE).
