const store = require("luthervd-user-store").default();
const bodyParser = require("body-parser");
const jsonParser = bodyParser.json();
const app = require("express")();
const cors = require("cors");

app.use(cors());
app.get('/',(req,res) => {
    return store.readAllUsers()
    .then(users => {
        return    res.send(users)
    });
});

app.get('/:userName',(req,res) => {
   
    if(!req.params.userName){
        res.status(400).end();
    }

    store.readUser(req.params.userName)
    .then((user) => {
        if(user){
            res.status(200).send(user);
        }
        else{
            res.status(404).end();
        }
    });  
});

app.post('/authenticate',jsonParser,(req,res) => {
    var userArgs = req.body;
    if(!userArgs || !userArgs.userName || !userArgs.password){
        res.statusCode(403).end();
    }
    else{
        store.authenticateUser(userArgs.userName, userArgs.password)
        .then((user) => {
            if(user === undefined){
                res.status(401).end();
            }
            else{
                res.status(200).json({userName: user.userName, claims: user.claims});
            }
        })
        .catch((error) => {
            res.status(403).end();
        });
    }
});

app.post('/',jsonParser,(req,res) => {
    var userArgs = req.body;
    store.addUser(userArgs.userName, userArgs.password,userArgs.accountNumber)
    .then((response) => {
        res.status(201).end();
    });
});

app.put('/:userName',jsonParser, (req,res) => {
    if(!req.params.userName){
        res.status(400).end();
    }
    var userArgs = req.body;
    store.readUser(req.params.userName)
    .then((user) => {
        if(!user){
            res.status(404).end();
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
            res.status(200).end();
        })
        .catch(error => {
            res.status(500).end();
        });
    });
});

app.delete("/:userName",(req,res) => {
    if(!req.params.userName){
        res.status(400).end();
    }
    store.readUser(req.params.userName)
    .then(user => {
        if(!user){
            res.status(400).end();
        }
        else{
            store.deleteUser(user._id)
            .then(result => {
                res.status(200).end();
            })
            .catch(error => {
                res.status(500).end();
            });
        }
    })
    .catch(error =>{
        res.status(500).end();
    });
});

const port = process.env.Port || 3014;

app.listen(port, () => console.log(`Example app listening on port ${port}!`))

