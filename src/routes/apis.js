const express = require('express');
const router = express.Router();
const format = require('./../templates/format');

router.get('/', async (req, res) => {
    format(req, res, {
        Endpoints: {
            api: {
                v1: [
                    "GET /api/v1",
                    "GET /api/v1/create",
                    "GET /api/v1/create/raw",
                    "GET /api/v1/read"
                ]
            },
            ui: [
                "GET /ui"
            ]
        }
    });
});

module.exports = router;