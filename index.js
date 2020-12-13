const express = require('express');
var bodyParser = require('body-parser');
const app = express();
const cors = require('cors');

// Serve the static files from the React app
app.use(cors());
app.use(bodyParser.json());

// An api endpoint that returns a short list of items
app.post('/generator', callPython);


function callPython(req, res) {
    if (req.body.web) {
        var process = require("child_process").spawn('python', ['./scripts/instances.py', req.body.n]);
        process.stdout.on('data', function (data) {
            res.send(data.toString());
            //console.log(data.toString());
        })
    } else {
        var process = require("child_process").spawn('python', ['./scripts/generator.py', req.body.n]);
        process.stdout.on('data', function (data) {
            res.send(data.toString());
            //console.log(data.toString());
        })
    }
}

app.get('/solver', callSolver);

function callSolver(req, res) {
    var process = require("child_process").spawn('python', ['./scripts/solver.py']);
    var dataToSend = '';
    process.stdout.on('data', data => {
        dataToSend += data.toString();
        //console.log(dataToSend);
        //console.log(data.toString());
    })
    process.on("close", () => {
        res.send(JSON.parse(dataToSend))
    });

}


/*
app.get('/py', (req,res) => {
    var list = ["item1", "item2", "item3"];
    res.send(list);
    console.log('Sent list of items');

});
*/
const port = process.env.PORT || 5000;
app.listen(port);

console.log('App is listening on port ' + port);