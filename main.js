const { app, BrowserWindow } = require('electron');
const { spawn } = require('child_process');
const fs = require('fs');
const cron = require('cron');
const fsExtra = require('fs-extra');
const path = require('path');

let mainWindow;
exports.prod = app.isPackaged

const {server} = require(`${__dirname}/server.js`)
let filePathCategories, filePathField, filePathGames, backupFolderPath
if (app.isPackaged == true) {
  filePathCategories = path.join(__dirname, '..', 'db', 'categories.db')
  filePathField = path.join(__dirname, '..', 'db', 'field.db')
  filePathGames = path.join(__dirname, '..', 'db', 'played_games.db')
  backupFolderPath = path.join(__dirname, '..', 'backups')
}
else {
  filePathCategories = `${__dirname}/db/categories.db`
  filePathField = `${__dirname}/db/field.db`
  filePathGames = `${__dirname}/db/played_games.db`
  backupFolderPath = `${__dirname}/backups`
}

function createWindow() {
  mainWindow = new BrowserWindow({width: 1600, height: 1000});
  mainWindow.loadURL(`http://localhost:60838`);
  mainWindow.menuBarVisible = false

  mainWindow.on('closed', function () {
    mainWindow = null;
  });
}

app.on('ready', () => {
  // Start the Express server as a child process
  const server = spawn('node', ['server.js'], {shell: true});
  server.stdout.on('data', (data) => {
    console.log(`Server: ${data}`);
  });

  createWindow();
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow();
  }
});


const backupJob = new cron.CronJob('0 */60 * * * *', () => {
  try {
    // Генерируем уникальное имя файла для резервной копии
    const timestamp = new Date().toLocaleString().replace(/[-:.,/]/g, '').replace(/[ ]/g, '_');
    const backupFileNameCategories = `categories_backup_${timestamp}.db`;
    const backupFileNameField = `field_backup_${timestamp}.db`;
    const backupFileNameGames = `games_backup_${timestamp}.db`;

    fsExtra.emptyDirSync(backupFolderPath);

    // Копируем файл в папку с резервными копиями
    fs.copyFile(filePathCategories, `${backupFolderPath}/${backupFileNameCategories}`, (err) => {
      if (err) {
        console.error('Ошибка при создании резервной копии:', err);
      } else {
        console.log('Резервная копия успешно создана:', backupFileNameCategories);
      }
    });
    fs.copyFile(filePathField, `${backupFolderPath}/${backupFileNameField}`, (err) => {
      if (err) {
        console.error('Ошибка при создании резервной копии:', err);
      } else {
        console.log('Резервная копия успешно создана:', backupFileNameField);
      }
    });
    fs.copyFile(filePathGames, `${backupFolderPath}/${backupFileNameGames}`, (err) => {
      if (err) {
        console.error('Ошибка при создании резервной копии:', err);
      } else {
        console.log('Резервная копия успешно создана:', backupFileNameGames);
      }
    });
  } catch (error) {
    console.error('Ошибка при выполнении задачи cron:', error);
  }
});

backupJob.start();



