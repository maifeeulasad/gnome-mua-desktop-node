const chalk = require('chalk');
const clear = require('clear');
const figlet = require('figlet');
const inquirer = require('inquirer');

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

    }else if(validatedOrNot==='n' || validatedOrNot==='N'){

    }
};
  
query();