#!/usr/bin/env node
/*
 * Servidor estático mínimo para desenvolvimento local. Não faz parte do site
 * entregue e não é necessário para publicar: qualquer hospedagem estática
 * (Netlify, Vercel, GitHub Pages, Nginx...) serve os arquivos deste projeto
 * diretamente. Isso aqui existe só para rodar `node dev-server.cjs` e ver o
 * site em http://localhost:4321 sem depender de nenhuma ferramenta externa.
 */
const http = require("http");
const fs = require("fs");
const path = require("path");

const RAIZ = __dirname;
const PORTA = process.env.PORT ? Number(process.env.PORT) : 4321;

const TIPOS = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".webp": "image/webp",
  ".mp4": "video/mp4",
  ".woff2": "font/woff2",
  ".xml": "application/xml",
  ".txt": "text/plain; charset=utf-8",
  ".json": "application/json; charset=utf-8",
};

http
  .createServer((req, res) => {
    let urlPath = decodeURIComponent(req.url.split("?")[0]);
    if (urlPath === "/") urlPath = "/index.html";

    const caminhoArquivo = path.join(RAIZ, urlPath);
    if (!caminhoArquivo.startsWith(RAIZ)) {
      res.writeHead(403);
      return res.end("403 Forbidden");
    }

    fs.readFile(caminhoArquivo, (erro, dados) => {
      if (erro) {
        res.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
        return res.end("404 — não encontrado: " + urlPath);
      }
      const tipo = TIPOS[path.extname(caminhoArquivo).toLowerCase()] || "application/octet-stream";
      res.writeHead(200, { "Content-Type": tipo });
      res.end(dados);
    });
  })
  .listen(PORTA, () => {
    console.log(`Servindo ${RAIZ} em http://localhost:${PORTA}`);
  });
