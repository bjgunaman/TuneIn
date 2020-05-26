const express =  require('express')
const path = require('path');

const app = express()

app.use(express.static(path.join(__dirname, '../frontend/build')));

// Handles any requests that don't match the ones above
app.get('*', (req,res) =>{
    res.sendFile(path.join(__dirname+'../frontend/build/index.html'));
});

const port = process.env.PORT || 8000;
app.listen(port);

console.log('App is listening on port ' + port);