const path = require("path");

function readConfig(filePath){
    const file = path.resolve(__dirname, filePath);
    var fs = require("fs");
    var configContents = fs.readFileSync(file, 'utf8');
    var config = JSON.parse(configContents);
    return config;
}
module.exports = readConfig;