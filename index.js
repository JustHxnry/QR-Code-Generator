const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const fs = require('fs');
const port = 5225;
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use('/assets', express.static(__dirname+"/src/public"));
app.set('views', './src/views');
app.set('view engine', 'ejs');

//* Routes

const mainRoutes = require('./src/routes/main');
const apiv1Routes = require('./src/routes/apiV1');
const apiRoutes = require('./src/routes/apis');
app.use('/', mainRoutes);
app.use('/api/v1', apiv1Routes);
app.use('/api', apiRoutes);
app.get('*', async (req, res) => res.status(404).render('error', { type: 404, title: "Not Found", msg: "Requested url doesn't exist", link: req.url }));


app.listen(port, () => console.log(`Web Started : ${port}`));
process.on('uncaughtException', (error, origin) => {
    console.log('----- Uncaught exception -----')
    console.log(error)
    console.log('----- Exception origin -----')
    console.log(origin)
});
  
process.on('unhandledRejection', (reason, promise) => {
    console.log('----- Unhandled Rejection at -----')
    console.log(promise)
    console.log('----- Reason -----')
    console.log(reason)
});
setInterval(() => {}, 1000);