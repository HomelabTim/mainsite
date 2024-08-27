const fs = require('fs');

const configDir = "./config/_default";
const contentDir = "./content";
const defaultLang = "en";

var targetLangs = []

function readConfigs() {
    const files = fs.readdirSync(configDir);
    files.forEach(file => {
        console.log(file)
        if(file.indexOf("languages.") > -1) {
            var lang = file.split(".")[1];
            console.log(lang)
            if(lang != defaultLang) {
                targetLangs.push(lang);
            }
        }
    });
}

async function processFile(filePath, file) {
    if (filePath.indexOf("index.md") > -1) {

        console.log("processing", filePath)
        
        for(var i in targetLangs) {
            const targetLang = targetLangs[i];
            var targetFilePath = filePath.replace(".md", "." + targetLang + ".md");
            //var targetFileName = file.replace(".md", "." + targetLang + ".md");

            if(fs.existsSync(targetFilePath)) {
                console.log("file already exists", targetFilePath);
            }else{
                console.log("creating file", targetFilePath);
                //fs.symlinkSync(file, targetFilePath, 'junction');
                fs.copyFileSync(filePath, targetFilePath);
            }
        }

    } else
        return
}

async function processFolder(folderPath) {
    const files = fs.readdirSync(folderPath);

    for (var i in files) {
        const file = files[i];
        const filePath = `${folderPath}/${file}`;
        const isDir = fs.lstatSync(filePath).isDirectory();
        if (isDir) {
            await processFolder(filePath);
        } else {
            await processFile(filePath, file);
        }
    }
}

async function createLinks() {
    processFolder(contentDir);
}

readConfigs();
createLinks();