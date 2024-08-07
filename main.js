const { app, BrowserWindow } = require('electron');
const { spawn } = require('child_process');
const fs = require('fs');
const cron = require('cron');
const fsExtra = require('fs-extra');

let mainWindow;

const {server} = require('./server.js')
const filePathCategories = 'db/categories_temp.db'
const filePathField = 'db/field.db'
const filePathGames = 'db/played_games.db'
const backupFolderPath = 'backups'

function createWindow() {
  mainWindow = new BrowserWindow({width: 1600, height: 1000});
  mainWindow.loadURL(`http://localhost:60838`);

  mainWindow.on('closed', function () {
    mainWindow = null;
  });
}

app.on('ready', () => {
  // Start the Express server as a child process
  const server = spawn('node', ['server.js']);
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



