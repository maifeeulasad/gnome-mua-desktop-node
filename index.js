const chalk = require('chalk');
const clear = require('clear');
const figlet = require('figlet');
const inquirer = require('inquirer');
const axios = require('axios');
const fs = require('fs');
const os = require('os')

var dir = os.homedir()+"/mua/gnome-mua-desktop";

if (!fs.existsSync(dir)){
    fs.mkdirSync(dir,{ recursive: true });
}

let sourceUrl = "https://raw.githubusercontent.com/maifeeulasad/chrome-mua-tab/data-source/data.json"

clear();

console.log(
    chalk
        .green(
            figlet
                .textSync('Gnome MUA Desktop', { horizontalLayout: 'full' })
        )
)

const questions = [
    {
      name: 'validatedOrNot',
      type: 'input',
      message: 'Please enter [y/n] if you want all wallpaper from verified source or not :',
      validate: function( value ) {
        if (value==='y' || value==='Y' || value==='n' || value==='N') {
          return true;
        } 
        return false;
      }
    },
  ];

const query = async () => {
    const prompts = await inquirer.prompt(questions);
    let validatedOrNot = prompts['validatedOrNot']
    if(validatedOrNot==='y' || validatedOrNot==='Y'){
        fetchWallPaper(true);
    }else if(validatedOrNot==='n' || validatedOrNot==='N'){
        fetchWallPaper(false);
    }
};
  
query();

const fetchWallPaper = (validatedOrNot) => {
    sourceUrl 
        = validatedOrNot 
        ? "https://raw.githubusercontent.com/maifeeulasad/chrome-mua-tab/data-source/data.json" 
        : "https://www.reddit.com/r/wallpaper/top.json"

    axios
        .get(sourceUrl)
        .then((res)=>{
            let backgroundImage = "https://i.imgur.com/lSdg2M9.jpg";
            if(sourceUrl==="https://raw.githubusercontent.com/maifeeulasad/chrome-mua-tab/data-source/data.json"){
                let responseJson = JSON.parse(JSON.stringify(res.data));
                let randomIndex = Math.random() * responseJson.length | 0;
                let randomImage = responseJson[randomIndex];
                backgroundImage = randomImage.url;
            }else{
                let responseJson = JSON.parse(JSON.stringify(res.data)).data.children;
			    let randomIndex = Math.random() * responseJson.length | 0;
			    let randomImage = responseJson[randomIndex].data;
			    backgroundImage = randomImage.url;
            }
            console.log(backgroundImage);
        })
}