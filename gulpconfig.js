
module.exports = function() {
  var client = './src/client';
  var config = {
    dir: {
      temp: './.tmp',
      // all js that needs checking and concating
      js: [
        './src/**/*.js',
        './*.js'
      ],
      less: client + '/styles/styles.less'
    },

  };

  return config;
};
