const Album = require('../models/album.model');

//Simple version, without validation or sanitation
exports.test = function (req, res) {
    res.send('Greetings from the Test controller!');
};

exports.createAlbum = function (req, res) {
    let album = new Album(
        {
            name: req.body.name,
            yearReleased: req.body.yearReleased,
            description: req.body.description,
            songs: req.body.songs,
            image: req.body.image
        }
    );

    album.save(function (err) {
        if (err) res.send(err);
        else res.send('Album Created successfully');
    })
};

exports.albumDetails = function (req, res) {
    Album.findById(req.params.id, function (err, album) {
        if (err) res.send(err);
        else res.send(album);
    })
};

exports.updateAlbum = function (req, res) {
    Album.findByIdAndUpdate(req.params.id, {$set: req.body}, function (err, album) {
        if (err) res.send(err);
        else res.send('Album updated');
    });
};

exports.deleteAlbum = function (req, res) {
    Album.findByIdAndRemove(req.params.id, function (err) {
        if (err) res.send(err);
        else res.send('Deleted successfully');
    })
};