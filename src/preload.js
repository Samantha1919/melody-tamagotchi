const { contextBridge, ipcRenderer } = require("electron");

// Le preload sert de pont entre la page (renderer) et le processus main.
// Ici on expose une seule fonction "safe" : demander de recharger la fenêtre.
contextBridge.exposeInMainWorld("electronAPI", {
  reloadWindow: () => ipcRenderer.send("reload-window"),
});
