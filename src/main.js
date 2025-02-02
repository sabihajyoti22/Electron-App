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
    }).catch((err) => {
      console.log(err)
    })
  } else {
    receiptWindow.loadFile(path.join(__dirname, `../renderer/${MAIN_WINDOW_VITE_NAME}/receipt.html`)).then(() => {
      mainWindow.webContents.send('testMainOn', 'Finished loading receipt.html')
    }).catch((err) => {
      mainWindow.webContents.send('testMainOn', 'Error occured on loading receipt.html')
    })
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
    }).catch((err) => {
      console.log(err)
    })
  } else {
    kotWindow.loadFile(path.join(__dirname, `../renderer/${MAIN_WINDOW_VITE_NAME}/kot.html`)).then(() => {
      mainWindow.webContents.send('testMainOn', 'Finished loading kot.html')
    }).catch((err) => {
      mainWindow.webContents.send('testMainOn', 'Error occured on loading kot.html')
    })
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
      mainWindow.webContents.send('testMainOn', 'Receipt Printing Successfull')
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
      mainWindow.webContents.send('testMainOn', 'KOT Printing Successfull')
    }
  })
})

ipcMain.on('testMainSend', (event, content) => {
  mainWindow.webContents.send('testMainOn', 'Sent data from main to component')
})