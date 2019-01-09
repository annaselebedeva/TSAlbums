const express = require('express');
const router = express.Router();

const albumController = require('../controllers/album.controller');

router.get('/test', albumController.test);
router.post('/create', albumController.createAlbum);
router.get('/allAlbums', albumController.getAllAlbums);
router.get('/:id/getAlbum', albumController.albumDetails);
router.put('/:id/update', albumController.updateAlbum);
router.delete('/:id/delete', albumController.deleteAlbum);

module.exports = router;