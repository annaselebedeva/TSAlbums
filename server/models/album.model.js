const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const SongSchema = new Schema({
  name: {
    type: String,
    trim: true,
    required: 'A song must have a name'
  },
  duration: {
    type: String,
    trim: true,
    required: 'A song must have a duration'
  },
  rating: {
    type: Number,
    default: 0,
    min: 0
  }
}, {
  id: false
});

module.exports = mongoose.model('Song', SongSchema);

const AlbumSchema = new Schema({
  name: {
    type: String,
    trim: true,
    required: 'Please fill in the album\'s name'
  },
  yearReleased: {
    type: Number,
    trim: true,
    required: 'Please fill in the year the album was released'
  },
  songs: [SongSchema],
  description: {
    type: String,
    trim: true,
    default: ''
  }
}, {
  id: false
});

module.exports = mongoose.model('Album', AlbumSchema);
