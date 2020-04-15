// const path = require('path');

module.exports = {
  css: {
    loaderOptions: {
      // @ is the src folder
      scss: {
        prependData: `
        @import "@/assets/scss/_mixin.scss"; 
        `
      }
    }
  }
};
