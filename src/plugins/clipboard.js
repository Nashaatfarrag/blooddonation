export default {
  install(app) {
    app.config.globalProperties.$copy = async (text) => {
      if (navigator && navigator.clipboard && navigator.clipboard.writeText) {
        return navigator.clipboard.writeText(text);
      }
      return Promise.reject(new Error('Clipboard API not available'));
    };
    app.provide('copy', app.config.globalProperties.$copy);
  },
};
