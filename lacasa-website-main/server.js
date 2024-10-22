const express = require("express");
const next = require("next");
const { parse } = require("url");

const dev = process.env.NODE_ENV !== "production";
const app = next({ dev });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  const server = express();

  server.use((req, res, next) => {
    const parsedUrl = parse(req.url, true);
    const { pathname, query } = parsedUrl;

    // Extract the language from the URL or set a default language
    const lang = pathname.split("/")[1] || "en";

    // Modify the pathname to remove the language prefix
    parsedUrl.pathname = pathname.replace(`/${lang}`, "");

    // Add the language as a query parameter
    parsedUrl.query.lang = lang;

    // Update the request URL
    req.url = parsedUrl.format();

    next();
  });

  server.get("*", (req, res) => {
    return handle(req, res);
  });

  server.listen(3000, (err) => {
    if (err) throw err;
    console.log("> Ready on http://localhost:3000");
  });
});
