const { app, BrowserWindow, ipcMain, Tray, Menu, globalShortcut } = require('electron');
const data = require('./data');
const templateGenerator = require ('./template')

let tray = null;
let mainWindow = null;

let templateMenu = templateGenerator.geraMenuPrincipalTemplate(app);


app.on('ready', () => {

    mainWindow = new BrowserWindow({
            width: 800,
            height: 600,
            webPreferences: {
                nodeIntegration: true,
                contextIsolation: false,
            },
        });
        tray = new Tray(__dirname + '/app/img/icon-tray.png');
        let template = templateGenerator.geraTrayTemplate(mainWindow);
        let trayMenu = Menu.buildFromTemplate(template);
        tray.setContextMenu(trayMenu);
       
        let templateMenu = templateGenerator.geraMenuPrincipalTemplate(app);
        let menuPrincipal = Menu.buildFromTemplate(templateMenu);
        
        Menu.setApplicationMenu(menuPrincipal);
        globalShortcut.register('CmdOrCtrl+Shift+S', () => {
            mainWindow.send('atalho-iniciar-parar');
        });
        
        mainWindow.loadFile(`./app/index.html`);
});    

let sobreWindow = null;

ipcMain.on('abrir-janela-sobre', () => {
    if(sobreWindow == null) {
        sobreWindow = new BrowserWindow({
            width: 300,
            height: 300,
            alwaysOnTop: true,
            frame: false,
            webPreferences: {
                nodeIntegration: true,
                contextIsolation: false,
            },
        });
        sobreWindow.on('closed', () => {
            sobreWindow = null;
        })
    }
    sobreWindow.loadFile(`./app/sobre.html`);
});

ipcMain.on('fechar-janela-sobre', () => {
    sobreWindow.close();
});

ipcMain.on('curso-parado', (event, curso, tempoEstudado)=>{
    console.log(`O curso ${curso} foi estudado por ${tempoEstudado}`);
    data.salvaDados(curso, tempoEstudado);
});


ipcMain.on('curso-adicionado', (event, novoCurso) => {
    let novoTemplate = templateGenerator.adicionaCursoNoTray(novoCurso,mainWindow);
    let novoTrayMenu = Menu.buildFromTemplate(novoTemplate);
    tray.setContextMenu(novoTrayMenu);
});

