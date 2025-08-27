const defaultConfig = require("@wordpress/scripts/config/webpack.config");

module.exports = {
  ...defaultConfig,
  entry: {
    admin: "./src/admin/index.js",
    frontend: "./src/frontend/index.js",
    "form-editor": "./src/form-editor/index.js",
    grid: "./src/frontend/grid.scss",
  },
  output: {
    ...defaultConfig.output,
    path: __dirname + "/build",
  },
};
