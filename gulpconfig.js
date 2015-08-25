
module.exports = function() {
  var client = './src/client';
  var clientApp = client + '/app';
  var tempDir = './.tmp',
  config = {
    dir: {
      client: client,
      temp: tempDir,
      // all js that needs checking and concating
      js: [
        clientApp + '/**/*.module.js',
        clientApp + '/**/*.js',
        '!' + clientApp + '/**/*.spec.js'
      ],
      index: client + '/index.html',
      less: client + '/styles/styles.less',
      css: tempDir + '/styles.css'
    },
    bower: {
      json: require('./bower.json'),
      directory: './bower_components',
      ignorePath: '../..'
    },
    getWiredepDefaultOptions: function() {
      var options = {
        bowerJson: config.bower.json,
        directory: config.bower.directory,
        ignorePath: config.bower.ignorePath
      };

      return options;
    }
  };

  return config;
};
