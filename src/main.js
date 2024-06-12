const { app, BrowserWindow, ipcMain } = require('electron')
const path = require('node:path')

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) {
  app.quit()
}

let mainWindow
let receiptWindow
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

  if (process.env.NODE_ENV === 'development' && process.env.MAIN_WINDOW_VITE_DEV_SERVER_URL) {
    mainWindow.loadURL(process.env.MAIN_WINDOW_VITE_DEV_SERVER_URL);
  } else {
    mainWindow.loadFile(path.join(__dirname, `../renderer/${MAIN_WINDOW_VITE_NAME}/index.html`))
  }

  mainWindow.webContents.openDevTools();
}

const createReceiptwindow = () => {
  receiptWindow = new BrowserWindow({
    width: 800,
    height: 800,
    show: false,
    webPreferences: {
      nodeIntegration: true,
      preload: path.join(__dirname, 'preload.js')
    }
  })

  if (process.env.NODE_ENV === 'development' && process.env.MAIN_WINDOW_VITE_DEV_SERVER_URL) {
    receiptWindow.loadURL(`${process.env.MAIN_WINDOW_VITE_DEV_SERVER_URL}/receipt.html`).then(() => {
      console.log("Finished loading receipt.html")
      mainWindow.webContents.send('testPreloadOn', 'Finished loading receipt.html')
    }).catch((err) => {
      console.log(err)
    })
  } else {
    receiptWindow.loadFile(path.join(__dirname, `../renderer/${MAIN_WINDOW_VITE_NAME}/receipt.html`))
  }
}

const createKOTwindow = () => {
  kotWindow = new BrowserWindow({
    width: 800,
    height: 800,
    show: false,
    webPreferences: {
      nodeIntegration: true,
      preload: path.join(__dirname, 'preload.js')
    }
  })

  if (process.env.NODE_ENV === 'development' && process.env.MAIN_WINDOW_VITE_DEV_SERVER_URL) {
    kotWindow.loadURL(`${process.env.MAIN_WINDOW_VITE_DEV_SERVER_URL}/kot.html`).then(() => {
      console.log("Finished loading kot.html")
      mainWindow.webContents.send('testPreloadOn', 'Finished loading kot.html')
    }).catch((err) => {
      console.log(err)
    })
  } else {
    kotWindow.loadFile(path.join(__dirname, `../renderer/${MAIN_WINDOW_VITE_NAME}/kot.html`))
  }
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
  receiptWindow.webContents.send('printReceipt', content)
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

  receiptWindow.webContents.print(options, (success, failureReason) => {
    if (!success) {
      console.log(failureReason)
    } else {
      console.log('Print Initiated from pdf')
      mainWindow.webContents.send('testPreloadOn', 'Receipt Printing Successfull')
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
      mainWindow.webContents.send('testPreloadOn', 'KOT Printing Successfull')
    }
  })
})

ipcMain.on('testPreloadSend', (event, content) => {
  mainWindow.webContents.send('testPreloadOn', 'Sent data from main to component')
})