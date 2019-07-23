const store = require("User-Store").default();
const bodyParser = require("body-parser");
const jsonParser = bodyParser.json();
const app = require("express")();
const cors = require("cors");
var pathfinderUI = require('pathfinder-ui-auth')

app.use(cors());
app.get('/',(req,res) => {
    return store.readAllUsers()
    .then(users => {
        return    res.send(users)
    });
});

app.get('/:userName',(req,res) => {
   
    if(!req.params.userName){
        res.statusCode = 400;
        return res.end();
    }

    store.readUser(req.params.userName)
    .then((user) => {
        if(user){
            res.statusCode = 200;
            res.send(user);
        }
        else{
            res.statusCode = 404;
            return res.end();
        }
    });  
});

app.post('/',jsonParser,(req,res) => {
    var userArgs = req.body;
    store.addUser(userArgs.userName, userArgs.password,userArgs.accountNumber)
    .then((response) => {
        res.statusCode = 201;
        return res.send();
    });
});

app.put('/:userName',jsonParser, (req,res) => {
    if(!req.params.userName){
        res.statusCode = 400;
        return res.end();
    }
    var userArgs = req.body;
    store.readUser(req.params.userName)
    .then((user) => {
        if(!user){
            res.statusCode = 404;
            return res.end();
        }
        var claims = user.claims;
        var newClaims = [];
        userArgs.claims.filter(claim => {
            if(claims.filter(x => x.name === claim.name).length === 0){
                newClaims.push(claim);
            }
        })
        store.addClaims(req.params.userName,newClaims)
        .then(result =>{ 
            res.statusCode = 200;
            return res.end();
        })
        .catch(error => {
            res.statusCode = 500;
            return res.end();
        });
    });
});

app.delete("/:userName",(req,res) => {
    if(!req.params.userName){
        res.statusCode = 400;
        return res.end();
    }
    store.readUser(req.params.userName)
    .then(user => {
        if(!user){
            res.statusCode = 400;
            return res.end();
        }
        else{
            store.deleteUser(user._id)
            .then(result => {
                res.statusCode = 200;
                return res.end();
            })
            .catch(error => {
                res.statusCode = 500;
                res.end();
            });
        }
    })
    .catch(error =>{
        res.statusCode = 500;
        res.end();
    });
});

app.use('/dev/pathfinder', function(req, res, next){
    pathfinderUI(app)
    next()
}, pathfinderUI.router)

const port = 3002;

app.listen(port, () => console.log(`Example app listening on port ${port}!`))

