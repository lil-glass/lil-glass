const { initRemix } = require("remix-electron");
const {
  app,
  BrowserWindow,
  dialog,
  session,
  webContents,
  ipcMain,
} = require("electron");
const path = require("node:path");
const contextMenu = require("electron-context-menu");

const { ElectronBlocker } = require("@cliqz/adblocker-electron");
const fetch = require("cross-fetch"); // required 'fetch'

ElectronBlocker.fromPrebuiltAdsAndTracking(fetch).then((blocker) => {
  blocker.enableBlockingInSession(session.defaultSession);
});

contextMenu({
  showSaveImageAs: true,
  showInspectElement: true,
});

/** @type {BrowserWindow | undefined} */
let win;

/** @param {string} url */
async function createWindow(url) {
  win = new BrowserWindow({
    show: false,
    frame: false,
    transparent: true,
    vibrancy: "appearance-based",
    webPreferences: {
      webviewTag: true,
      experimentalFeatures: true,
      transparent: true,
      nodeIntegration: true,
      preload: path.join(__dirname, "preload.js"),
    },
  });

  win.webContents.on("did-attach-webview", (event, webContents) => {
    console.log("did-attach-webview", event, webContents);
  });

  // Wait for the window to be ready
  win.webContents.once("did-finish-load", () => {
    // Find the webview's webContents
    const allWebContents = webContents.getAllWebContents();
    console.log(allWebContents.map((wc) => wc.id));
    const webViewWebContents = allWebContents.find((wc) => {
      // You can use various properties to identify the webview's webContents
      return (
        wc.hostWebContents === win.webContents && wc.getType() === "webview"
      );
    });

    if (webViewWebContents) {
      webViewWebContents.on("input-event", (event, input) => {
        // console.log(input.key, input.meta, input.type);
        if (input.key === "l" && input.meta && input.type === "rawKeyDown") {
          console.log("CommandOrControl+L is pressed");
          win?.webContents.send("open-menu", {
            url: webViewWebContents.getURL(),
          });
        }
      });
      // Listen for the webview's load event
      webViewWebContents.once("did-finish-load", () => {
        console.log("Webview has finished loading!");
        // Do something once the webview is loaded
      });
    }
  });
  await win.loadURL(url);
  win.show();

  if (process.env.NODE_ENV === "development") {
    win.webContents.openDevTools();
  }
}

app.on("ready", () => {
  void (async () => {
    try {
      if (process.env.NODE_ENV === "development") {
        const {
          default: installExtension,
          REACT_DEVELOPER_TOOLS,
        } = require("electron-devtools-installer");

        await installExtension(REACT_DEVELOPER_TOOLS);
      }
      const url = await initRemix({
        serverBuild: path.join(__dirname, "../build/index.js"),
      });
      await createWindow(url);
    } catch (error) {
      dialog.showErrorBox("Error", getErrorStack(error));
      console.error(error);
    }
  })();
});

/** @param {unknown} error */
function getErrorStack(error) {
  return error instanceof Error ? error.stack || error.message : String(error);
}
