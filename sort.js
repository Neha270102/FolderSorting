let fs = require("fs");
let path = require("path");
let extensions = require("./utils");
let folderPath = "./docs";
let extFolderPath;

function checkFolder(extension, folderPath) {
    for (let i in extensions) {
        if (extensions[i].includes(extension)) {
            extFolderPath = `${folderPath}/${i}`;
            break;
        }
    }
    return fs.existsSync(extFolderPath);
}

function moveFile(fileName, folderPath) {
    let sourcePath = `${folderPath}/${fileName}`;
    let destinationPath = `${extFolderPath}/${fileName}`;
    fs.copyFileSync(sourcePath, destinationPath);
    fs.unlinkSync(sourcePath);
}

function createFolder() {
    fs.mkdirSync(extFolderPath);
}

function check(folderPath, content) {
    let folderComponents = folderPath.split("/");
    let folderName = folderComponents[folderComponents.length - 1];
    if (extensions.hasOwnProperty(folderName)) {
        return true;
    }
    return false;
}

function sort(folderPath) {
    let content = fs.readdirSync(folderPath);
    for (let i = 0; i < content.length; i++) {
        let isAlreadyInCheckedFolder = check(folderPath, content[i]);
        if (isAlreadyInCheckedFolder) {
            return;
        }
        let isDirectory = fs.lstatSync(`${folderPath}/${content[i]}`).isDirectory();
        if (isDirectory) {
            sort(`${folderPath}/${content[i]}`);
        } else {
            let extensionName = path.extname(content[i]);
            let extensionFolderExist = checkFolder(extensionName, folderPath);
            if (extensionFolderExist) {
                moveFile(content[i], folderPath);
            } else {
                createFolder();
                moveFile(content[i], folderPath);
            }
        }
    }
}

sort(folderPath);