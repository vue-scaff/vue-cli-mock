// Colour Console
require("console-color-mr");

// Argv
const { argvs } = require("process-env-argv");

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
argvs.port = argvs.port || 3000;

// Default Path
argvs.path = argvs.path || "./source";

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
      .readdirSync(argvs.path)
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
    return (ctx.body = fs
      .readFileSync(`./template.html`, "utf8")
      .replace(/{{ routes }}/, routes));
  }

  // Get Mock Json
  ctx.body = mock.mock(
    JSON.parse(fs.readFileSync(`${argvs.path}/${ctx.path}.json`, "utf8"))
  );
});

// Use Middleware
App.use(Page.routes()).use(Page.allowedMethods());

// Listen Port
App.listen(argvs.port, () =>
  console.log(
    `vue-scaff mock is running at: ` + `http://localhost:${argvs.port}/`.cyan
  )
);
