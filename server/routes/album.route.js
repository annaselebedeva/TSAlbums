const express = require('express');
const router = express.Router();

const albumController = require('../controllers/album.controller');


// a simple test url to check that all of our files are communicating correctly.
router.get('/test', albumController.test);
router.post('/create', albumController.createAlbum);
router.get('/:id', albumController.albumDetails);
router.put('/:id/update', albumController.updateAlbum);
router.delete('/:id/delete', albumController.deleteAlbum);

module.exports = router;