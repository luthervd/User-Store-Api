const server = require("./app/server");
var app = {};
var args = process.argv;
if(args[2] === "run"){
    server.setupAndRun();
}
module.exports = function(config){
    return server.setup(config);
}