// Path
const path = require("path");

// FS
const fs = require("fs");

// Chokidar
const chokidar = require("chokidar");

// Mock JS
const { mock } = require("mockjs");

// Resolve
const resolve = dir => path.resolve(process.cwd(), dir);

// Mock
const root = "/mock";

// Mock Directory
const dir = resolve(`src${root}`);

// Factory
const runner = app => {
  // Set Routes
  app.get(`${root}/:file`, (request, response) => {
    // Get Name
    const file = request.params.file;

    // Set Source
    let source;

    try {
      // Get Source
      source = fs.readFileSync(resolve(`${dir}/${file}.json`), {
        encoding: "utf-8"
      });
    } catch (e) {
      return response.send(`no such file ${file}.json in mock directory.`);
    }

    // Set Mock
    const data = mock(JSON.parse(source));

    // Return Json
    response.send(data);
  });
};

// Export
module.exports = app => runner(app);
