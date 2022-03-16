const request = require('request');
const fs = require('fs')

const url = process.argv[2];
const localPath = process.argv[3];

const rl = require('readline');
rl.emitKeypressEvents(process.stdin);
process.stdin.setRawMode(true);

function writeToFile(body) {
  fs.writeFile(localPath, body, { flag: "wx" }, err => {
    if (err) {
      // console.error(err);
      console.log("Error! File already exists; press 'Y' to overwrite and any other key to exit...");
      // Get keypress and overwrite if y, otherwise exit
      process.stdin.on('keypress', (str, key) => {
        if (key.ctrl && key.name === 'c' || key.name !== 'y') {
          console.log(`No file overwritten, exiting.`);
          process.exit();
        } 
        else if (key.name === 'y') {
          fs.writeFile(localPath, body, { flag: "w" }, err => {
            if (err) console.error(err);
            console.log(`File written successfully!`);
            process.exit(1);
          });
        }
      });
    }
    else console.log(`File written successfully!`);
  });
}

request(url, (error, response, body) => {
  console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received
  // console.log('body:', body); // Print the HTML for the Google homepage.
  if (error) console.log('error:', error); // Print the error if one occurred
  else writeToFile(body);
});
