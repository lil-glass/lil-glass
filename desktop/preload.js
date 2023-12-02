const { contextBridge, ipcRenderer, webContents } = require("electron");

let bound = null;
contextBridge.exposeInMainWorld("electron", {
  test: (func) => {
    if (bound === func) {
      return;
    }
    bound = func;
    ipcRenderer.on("open-menu", (...data) => {
      console.log("open-menu", data);
      func(data);
    });
  },
});
