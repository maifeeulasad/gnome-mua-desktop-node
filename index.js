import chalk from "chalk";
import figlet from "figlet";
import inquirer from "inquirer";
import axios from "axios";
import * as fs from "fs";
import * as os from "os";
import * as http from "http";
import * as https from "https";
import shelljs from "shelljs";
import Configstore from 'configstore';

var dir = os.homedir() + "/mua/gnome-mua-desktop";
var configFile = dir+"/config.json";

if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, {
        recursive: true
    });
}

if (!fs.existsSync(configFile)) {
    fs.writeFile(configFile, "{\"validatedOrNot\":\"y\"}")
}

const packageJson = JSON.parse(fs.readFileSync(configFile, 'utf8'));
const config = new Configstore(packageJson.name,{validatedOrNot:"y"});

let sourceUrl = "https://raw.githubusercontent.com/maifeeulasad/chrome-mua-tab/data-source/data.json"

const welcome = () => {
    console.clear()

    console.log(
        chalk
        .green(
            figlet
            .textSync('Gnome MUA Desktop', {
                horizontalLayout: 'full'
            })
        )
    )

    query();
}

const query = async () => {
    const questions = [{
        name: 'validatedOrNot',
        type: 'input',
        message: 'Please enter [y/n] if you want all wallpaper from verified source or not :',
        validate: function(value) {
            if (value === 'y' || value === 'Y' || value === 'n' || value === 'N') {
                return true;
            }
            return 'Currently set to '+config.get("validatedOrNot");
        }
    }, ];
    const prompts = await inquirer.prompt(questions);
    let validatedOrNot = prompts['validatedOrNot']
    if (validatedOrNot === 'y' || validatedOrNot === 'Y') {
        setInterval(function() {
            config.get("validatedOrNot","y");
            fetchWallPaper(true);
        }, 5000);
    } else if (validatedOrNot === 'n' || validatedOrNot === 'N') {
        setInterval(function() {
            config.get("validatedOrNot","n");
            fetchWallPaper(false);
        }, 5000);
    }
};


const setWallpapper = (filePath) => {
    const shellCommand = "gsettings set org.gnome.desktop.background picture-uri " + filePath
    shelljs.exec(shellCommand);
}

const downloadWallpaper = (url) => {
    const filePath = dir +
        "/current" +
        (sourceUrl === "https://raw.githubusercontent.com/maifeeulasad/chrome-mua-tab/data-source/data.json" ?
            ".jpg" :
            ".png");
    const file = fs.createWriteStream(filePath);
    if (url.includes("https")) {
        https.get(url, function(response) {
            response.pipe(file);
            setWallpapper(filePath);
        });
    } else {
        http.get(url, function(response) {
            response.pipe(file);
            setWallpapper(filePath);
        });
    }
}

const fetchWallPaper = (validatedOrNot) => {
    sourceUrl
        = validatedOrNot ?
        "https://raw.githubusercontent.com/maifeeulasad/chrome-mua-tab/data-source/data.json" :
        "https://www.reddit.com/r/wallpaper/top.json"

    axios
        .get(sourceUrl)
        .then((res) => {
            let backgroundImage = "https://i.imgur.com/lSdg2M9.jpg";
            if (sourceUrl === "https://raw.githubusercontent.com/maifeeulasad/chrome-mua-tab/data-source/data.json") {
                let responseJson = JSON.parse(JSON.stringify(res.data));
                let randomIndex = Math.random() * responseJson.length | 0;
                let randomImage = responseJson[randomIndex];
                backgroundImage = randomImage.url;
            } else {
                let responseJson = JSON.parse(JSON.stringify(res.data)).data.children;
                let randomIndex = Math.random() * responseJson.length | 0;
                let randomImage = responseJson[randomIndex].data;
                backgroundImage = randomImage.url;
            }
            downloadWallpaper(backgroundImage);
        })
}


welcome()