const express = require('express');
const router = express.Router();
const axios = require('axios');
const getUrls = require('get-urls');

router.get('/', async (req, res) => {
    res.render('qrform');
});
router.get('/ui', async (req, res) => {
    res.render('qrform');
});

router.post('/t', async (req, res) => {
    var { t, option } = req.body;
    if (option === "datauri") {
        axios.get(`http://localhost:5225/api/v1/create?t=${t}`).then(function(response) {
            res.render('qroutput', { output: response.data.uri, option: "uri" });
        });
    } else if (option === "image") {
        axios.get(`http://localhost:5225/api/v1/create?t=${t}`).then(function(response) {
            var url = response.data.uri;
            var base64Data = url.replace(/^data:image\/png;base64,/, '');
            var img = Buffer.from(base64Data, 'base64');
            res.header('Content-Type', 'image/jpeg');
            res.end(img);
        });
    } else if (option === "read") {
        try {
            axios.get(`http://localhost:5225/api/v1/read?t=${t}`).then(function(response) {
                var content = response.data.content;
                getUrls(content).forEach(u => {
                  u = u.replace(new RegExp(u, "g"), `<a href="${u}" target="_blank" style="color: green;">${u}</a>`);
                  res.render('qroutput', { output: content, option: "read", t, u });
                });
            });
        } catch (err) {
            res.status(400).render('error', { type: 400, msg: "Invalid image URL", link: t, title: "Bad Request" });
        }
    }
});


module.exports = router;