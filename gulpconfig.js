
module.exports = function() {
  var client = './src/client';
  var clientApp = client + '/app';
  var tempDir = './.tmp';
  var serverDir = './src/server';
  var config = {
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
      css: tempDir + '/styles.css',
      server: serverDir
    },
    bower: {
      json: require('./bower.json'),
      directory: './bower_components',
      ignorePath: '../..'
    },
    defaultPort: 7203,
    nodeServer: './src/server/app.js',
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
