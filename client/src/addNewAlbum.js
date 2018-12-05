import React, { Component } from 'react';
//import ReactDOM from 'react-dom';
import StarRatingComponent from 'react-star-rating-component';
import './TS.css';
import 'whatwg-fetch';
import 'bootstrap/dist/css/bootstrap.min.css';
import './addNewAlbum.css'
import $ from 'jquery'

class NewAlbum extends Component {
  constructor (props) {
    super(props);
      this.state = {
        name: '',
        yearReleased: '',
        description: '',
        image: '',
        songs: []
      };
    this.handleSubmit = this.handleSubmit.bind(this);
    this.preventSubmit = this.preventSubmit.bind(this);
    this.handleSongAdd = this.handleSongAdd.bind(this);
    this.removeError = this.removeError.bind(this);
  }

  removeError (e) {
    if ($(e.target).hasClass('error')) {
      $(e.target).removeClass('error');
    }
  }

  preventSubmit (e) {
    e.preventDefault();
  }

  handleSongAdd (e) { 
    e.preventDefault();

    let newSong = $('#newSong').val();
    let newDur = $('#newDur').val();
    let newRate = $('#newRate').val();
    if (!newRate) newRate = 0;
    let uid = Math.round(new Date().getTime() + (Math.random() * 100));
    if (newSong && newDur) { // <input type="hidden" class="col-sm-5" name="listed[]" value=${newItem}> was after ${newItem}\
      $('#hide').removeClass('hide');
      $('#list').append(`<div id=${uid} class="songs">
               <span class="newS">${newSong}</span> <span class="newD">${newDur}</span> <span class="newR">${newRate}/5</span>
               <span data-id=${uid} class="col-sm-2 close listelement">x</span></div>`);
      $('#newSong').val('');
      $('#newDur').val('');
      $('#newRate').val('');
    }
    else {
      if (!newSong) {
        $('#newSong').addClass('error');   
      }
      if (!newDur) {
        $('#newDur').addClass('error');
      }
    }
    $('#list').delegate(".listelement", "click", function () {
        let eid = $(this).attr('data-id');
        $("#"+eid).remove();
        if ($('#list').children().length <= 1) {
          $('#hide').addClass('hide');
        }
    });
    //console.log($('.songs').children()[5].textContent);
}

  async handleSubmit(event) {
      console.log($('.newName').val());
      this.setState({ name: $('.newName').val() });
      this.setState({ yearReleased: $('.newYear').val() });
      this.setState({ description: $('.newDesc').val() });
      let s = $('.songs').children();
      let songArray = [];
      console.log(this.state.name, this.state.yearReleased, this.state.description);
      for (let i = 4; i < s.length; i++) {
        if (i+1 % 4) continue;
        console.log(s[i]);
        songArray.push({name: s[i].textContent}, {duration: s[i].textContent}, {rating: s[i].textContent});
      }
      console.log(songArray);
      this.setState({ songs: songArray });
      let { name, yearReleased, description, image, songs } = this.state;
      try {
        await fetch('/api/create', {
          method: 'POST',
          body: { name, yearReleased, description, image, songs }
        });
      } catch (e) {
        console.log(e);
      }
  }

  componentDidMount() {
      document.title = 'Taylor Swift Albums';
  }

  render() {
    return (
      <div className="modal-content container">
        {/*<span className="close">&times;</span>*/}
        <p className="head">New Album</p>
        <form id="form"> {/*onSubmit={this.handleSubmit}>*/}
          <div className="form-group row">
            <label className="col-sm-5 col-form-label">Name</label>
            <div className="col-sm-7">
              <input className="form-control newName" type="text" placeholder="Enter album name" />
            </div>
          </div>
          <div className="form-group row">
            <label className="col-sm-5 col-form-label">Year Released</label>
            <div className="col-sm-7">
              <input className="form-control newYear" type="text" placeholder="Enter the year" />
            </div>
          </div>
          <div className="form-group row">
            <label className="col-sm-5 col-form-label">Description</label>
            <div className="col-sm-7">
              <textarea className="form-control newDesc" rows="7" id="comment" type="text" placeholder="Album description goes here..."></textarea>
            </div>
          </div>
          <div className="form-group row">
            <label className="col-sm-5 col-form-label">Background Image</label>
            <div className="col-sm-7">
              <input className="form-control newImg" rows="7" id="comment" type="text" placeholder="Add background image"></input>
            </div>
          </div>          
          <hr />          
          <div className="form-group row">
            <label className="col-sm-5 col-form-label">Add songs</label>
            <div className="col-sm-7">
              <input className="form-control" id="newSong" type="text" onKeyPress={this.removeError} placeholder="Song name" />
            </div>
          </div>  
          <div className="form-group row">
            <label className="col-sm-5 col-form-label"></label>
            <div className="col-sm-7">
              <input className="form-control" id="newDur" type="text" onKeyPress={this.removeError} placeholder="Song duration" />
            </div>
          </div> 
          <div className="form-group row">
            <label className="col-sm-5 col-form-label"></label>
            <div className="col-sm-7">
              <input className="form-control" id="newRate" max="5" min="0" type="text" onKeyPress={this.removeError} placeholder="Song rating out of 5" />
            </div>
          </div>  
          <div className="form-group row">
            <label className="col-sm-5 col-form-label"></label>
            <div className="col-sm-7">
              <button id="addbtn" name="addbtn" className="btn btn-sm" onClick={this.handleSongAdd}>Add song</button>   
            </div>
          </div>             
          <div className="form-group">
            <div id='list' className="list-group">
              <div className="songs hide" id="hide">
                <span>Name</span> <span>Duration</span> <span>Rating</span> <span> </span>
              </div>
            </div>
          </div>
          <div className="form-group row">
            <label className="col-sm-5 col-form-label"></label>
            <div className="col-sm-7">
              <button className="btn sub" onClick={this.handleSubmit}>Add Album</button>
            </div>
          </div> 
        </form>            
      </div>
    );
  }
}
export default NewAlbum;
