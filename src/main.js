const { app, BrowserWindow, ipcMain } = require('electron')
const path = require('node:path')
const MAIN_WINDOW_VITE_DEV_SERVER_URL = 'http://localhost:5173'

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) {
  app.quit()
}

let mainWindow
let recieptWindow
let kotWindow

const createWindow = () => {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
      preload: path.join(__dirname, 'preload.js')
    }
  })

  createReceiptwindow()
  createKOTwindow()

  if (MAIN_WINDOW_VITE_DEV_SERVER_URL) {
    mainWindow.loadURL(MAIN_WINDOW_VITE_DEV_SERVER_URL);
  } else {
    mainWindow.loadFile(path.join(__dirname, `../renderer/${MAIN_WINDOW_VITE_NAME}/index.html`))
  }

  mainWindow.webContents.openDevTools();
}

const createReceiptwindow = () => {
  recieptWindow = new BrowserWindow({
    width: 800,
    height: 800,
    show: false,
    webPreferences: {
      nodeIntegration: true,
      preload: path.join(__dirname, 'preload.js')
    }
  })

  recieptWindow.loadFile("receipt.html").then(() => {
    console.log("Finished loading receipt.html")
  }).catch((err) => {
    console.log(err)
  })
}

const createKOTwindow = () => {
  kotWindow = new BrowserWindow({
    width: 800,
    height: 800,
    show: false,
    webPreferences: {
      nodeIntegration: true,
      preload: path.join(__dirname, 'preload.js')
    },
  })

  kotWindow.loadFile("kot.html").then(() => {
    console.log("Finished loading kot.html")
  }).catch((err) => {
    console.log(err)
  })
}

app.whenReady().then(() => {
  createWindow()

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow()
    }
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

ipcMain.on('sendToMainReceipt', (event, content) => {
  recieptWindow.webContents.send('printReceipt', content)
})

ipcMain.on('sendToMainKOT', (event, content) => {
  kotWindow.webContents.send('printKOT', content)
})

ipcMain.on('readyToPrint', (event, content) => {
  const options = {
    silent: true,
    copies: 1,
    margins: { marginType: 'custom' },
  }

  recieptWindow.webContents.print(options, (success, failureReason) => {
    if (!success) {
      console.log(failureReason)
    } else {
      console.log('Print Initiated from pdf')
    }
  })
})

ipcMain.on('readyToKOT', (event, content) => {
  const options = {
    silent: true,
    copies: 1,
    margins: { marginType: 'custom' },
  }

  kotWindow.webContents.print(options, (success, failureReason) => {
    if (!success) {
      console.log(failureReason)
    } else {
      console.log('Print Initiated from kot')
    }
  })
})