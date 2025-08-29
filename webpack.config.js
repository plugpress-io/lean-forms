const defaultConfig = require("@wordpress/scripts/config/webpack.config");

// Create a modified config
const config = { ...defaultConfig };

// Filter out RTL-related plugins
if (config.plugins) {
  config.plugins = config.plugins.filter((plugin) => {
    if (!plugin || typeof plugin !== "object") return true;

    const pluginName = plugin.constructor?.name || "";

    // Remove RTL plugins
    if (
      pluginName.includes("RTL") ||
      pluginName.includes("rtl") ||
      pluginName.includes("Rtl")
    ) {
      return false;
    }

    return true;
  });
}

// Override entry points
config.entry = {
  admin: "./src/admin/index.js",
  "form-editor": "./src/form-editor/index.js",
  grid: "./src/modules/grid/grid.scss",
  "form-preset": "./src/modules/form-presets/form-preset.scss",
  "form-preset-admin": "./src/modules/form-presets/form-preset-admin.js",
};

// Override output path
config.output = {
  ...config.output,
  path: __dirname + "/build",
};

module.exports = config;
