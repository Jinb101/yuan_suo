// config/version-plugin.js
class VersionPlugin {
  constructor(options) {
    this.options = options;
  }

  apply(compiler) {
    compiler.hooks.compilation.tap("VersionPlugin", compilation => {
      compilation.hooks.htmlWebpackPluginBeforeHtmlProcessing.tapAsync(
        "VersionPlugin",
        (data, cb) => {
          data.html = data.html.replace(/{{VERSION}}/g, this.options.version);
          cb(null, data);
        }
      );
    });
  }
}

module.exports = VersionPlugin;
