// Colour Console
require("console-color-mr");

// Argv
const argv = require("cross-env-argv")(process);

// FS
const fs = require("fs");

// KOA
const koa = require("koa");

// CORS
const cors = require("@koa/cors");

// Router
const router = require("koa-router");

// Mock
const mock = require("mockjs");

// Default Port
argv.port = argv.port || 3000;

// App
const App = new koa();

// Page
const Page = new router();

// Cors
App.use(cors());

// Every Routes
App.use(async ctx => {
  if (ctx.path === `/`) {
    // Set Routes
    let routes = fs
      // Read Json
      .readdirSync(`./source`)
      // Filter Unrelated
      .filter(r => !/^\./.test(r))
      // Processing
      .map(r => {
        // Length for Substring
        let l = r.length;
        // Reverse
        let s = r.substr(-l, l - 5);
        // Add Link
        return `<a href="/${s}">${s}</a>`;
      })
      // Map to String
      .toString()
      // Add Breaks
      .replace(/\,/g, "<br />");

    // Set Response Type
    ctx.type = "html";

    // Set Response Body
    return (ctx.body = `<!doctype html><html><head><meta charset="utf-8"></head><body>${routes}</body></html>`);
  }

  // Get Mock Json
  ctx.body = mock.mock(
    JSON.parse(fs.readFileSync(`./source/${ctx.path}.json`, "utf8"))
  );
});

// Use Middleware
App.use(Page.routes()).use(Page.allowedMethods());

// Listen Port
App.listen(argv.port, () =>
  console.log(
    `vue-scaff mock is running at: ` + `http://localhost:${argv.port}/`.cyan
  )
);
