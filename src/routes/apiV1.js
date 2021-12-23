const express = require('express');
const router = express.Router();
const qrcode = require('qrcode');
const fs = require('fs');
const jimp = require("jimp");
const qrreader = require('qrcode-reader');
const Axios = require('axios');
const format = require('./../templates/format');

const generateUID = () => {
    var length = 8,
        charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789",
        retVal = "";
    for (var i = 0, n = charset.length; i < length; ++i) {
        retVal += charset.charAt(Math.floor(Math.random() * n));
    }
    return retVal;
}

router.get('/', async (req, res) => {
    format(req, res, {
        apiVersion: "1.0.0",
        apiEndpoint: "/api/v1",
        endpoints: {
            "/create": {
                url: "GET /api/v1/create",
                params: {
                    t: {
                        type: "query",
                        description: "text or url",
                        example_usage: "/api/v1/create?t=https://example.com"
                    }
                },
                fullurl: "GET /api/v1/create?t=https://example.com"
            },
            "/create/raw": {
                url: "GET /api/v1/create/raw",
                params: {
                    t: {
                        type: "query",
                        description: "text or url",
                        example_usage: "/api/v1/create/raw?t=https://example.com"
                    }
                },
                fullurl: "GET /api/v1/create/raw?t=https://example.com"
            }
        },
        "/read": {
            url: "GET /api/v1/read",
            params: {
                t: {
                    type: "query",
                    description: "image url",
                    example_usage: "/api/v1/read?t=https://f.hxnrycz.xyz/xj9uc/a7vC6iKBfD.png"
                }
            },
            fullurl: "GET /api/v1/read?t=https://f.hxnrycz.xyz/xj9uc/a7vC6iKBfD.png"
        }
    });
});

router.get('/create', async (req, res) => {
    const { t } = req.query;
    if (!t) return res.status(400).json([]);
    try {
        var opts = {errorCorrectionLevel: 'H',type: 'image/jpeg',quality: 0.3,margin: 1,color: {dark:"#000",light:"#FFF"}};

        qrcode.toDataURL(t, opts, function (err, url) {
            if (err) {
                res.status(500).json([]);
                console.log(err);
            }
          
            res.status(200).json({ uri: url });
        });
    } catch (err) {
        console.log(err);
        res.status(500).json([]);
    }
});

router.get('/read', async (req, res) => {
    const { t } = req.query;
    if (!t) return res.status(400).json([]);
    jimp.read(t, function(err, image) {
        if (err) {
            console.error(err);
            res.status(500).json([]);
        }
        let qr = new qrreader();
        qr.callback = function(err, value) {
            if (err) {
                console.error(err);
                res.status(500).json([]);
            }
            res.status(200).json({ content: value.result });
        };
        qr.decode(image.bitmap);
    });
});

router.get('/create/raw', async (req, res) => {
    const { t } = req.query;
    if (!t) return res.status(400).json([]);
    try {
        var opts = {errorCorrectionLevel: 'H',type: 'image/jpeg',quality: 0.3,margin: 1,color: {dark:"#000",light:"#FFF"}};

        qrcode.toDataURL(t, opts, function (err, url) {
            if (err) {
                res.status(500).json([]);
                console.log(err);
            }
            var base64Data = url.replace(/^data:image\/png;base64,/, '');
            var img = Buffer.from(base64Data, 'base64');
            res.header('Content-Type', 'image/jpeg');
            res.end(img);
        });
    } catch (err) {
        console.log(err);
        res.status(500).json([]);
    }
});

module.exports = router;