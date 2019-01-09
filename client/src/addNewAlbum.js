import React, { Component } from 'react';
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
        songs: [],
        showModal: true
      };
    this.handleSubmit = this.handleSubmit.bind(this);
    this.preventSubmit = this.preventSubmit.bind(this);
    this.handleSongAdd = this.handleSongAdd.bind(this);
    this.removeError = this.removeError.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(e) {
    if (e.target.value === $('.newName').val()) {
      this.setState({ name: $('.newName').val() });
    }
    else if (e.target.value === $('.newYear').val()) {
      this.setState({ yearReleased: $('.newYear').val() });
    }
    else if (e.target.value === $('.newDesc').val()) {
      this.setState({ description: $('.newDesc').val() });
    }
    else if (e.target.value === $('.newImg').val()) {
      this.setState({ image: $('.newImg').val() });
    }
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
    if (newSong && newDur) {
      $('#hide').removeClass('hide');
      $('#list').append(`<div id=${uid} class="songs">
               <span class="newS">${newSong}</span> <span class="newD">${newDur}</span> <span class="newR">${newRate}/5</span>
               <span data-id=${uid} class="col-sm-2 close listelement">x</span></div>`);
      $('#newSong').val('');
      $('#newDur').val('');
      $('#newRate').val('');
      this.setState({ songs: [...this.state.songs, {name: newSong, duration: newDur, rating: newRate}] });
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
        let filteredArray = this.state.songs.filter(item => item !== $('#'+eid).value);
        this.setState({songs: filteredArray});
    });
}

async handleSubmit(event) {
      event.preventDefault();
      let err = false;
      if (!$('.newDesc').val()) { 
        $('.newDesc').addClass('error'); err = true;
      }
      if (!$('.newYear').val()) {
        $('.newYear').addClass('error'); err = true;
      }
      if (!$('.newName').val()) { 
        $('.newName').addClass('error'); err = true;
      }
      if (err) return;
      try {
        let rawResponse = await fetch('api/create', {
          method: 'POST',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          },          
          body:  JSON.stringify({
            name: this.state.name,
            yearReleased: this.state.yearReleased,
            description: this.state.description,
            image: this.state.image,
            songs: this.state.songs
          })
        });
        const content = await rawResponse;
        console.log(content);
        this.setState({
          name: '',
          yearReleased: '',
          description: '',
          image: '',
          songs: [],
          showModal: false
        });
        let inputs = document.getElementsByClassName('form-control');
        for (let i = 0; i < inputs.length; i++) {
          inputs[i].value = '';
        }
        $('.songs').empty();
        $('#hide').addClass('hide');
      } catch (e) {
        console.log(e);
      }
  }

  componentDidMount() {
      document.title = 'Taylor Swift Albums';
      this.setState({ showModal: true });
      let span = document.getElementsByClassName("close")[0];
      span.onclick = function() {
        this.setState({ showModal: false }, ()=> {
          this.props.callbackFromParent(this.state.showModal);
        });
      }.bind(this);
  }

  render() {
    return (
      <div className="modal-content container">
        <span className="close">&times;</span>        
        <p className="head">New Album</p>
        <form id="form">
          <div className="form-group row">
            <label className="col-sm-5 col-form-label">Name</label>
            <div className="col-sm-7">
              <input className="form-control newName" onChange={this.handleChange} type="text" onKeyPress={this.removeError} placeholder="Enter album name" />
            </div>
          </div>
          <div className="form-group row">
            <label className="col-sm-5 col-form-label">Year Released</label>
            <div className="col-sm-7">
              <input className="form-control newYear" onChange={this.handleChange} onKeyPress={this.removeError} type="text" placeholder="Enter the year" />
            </div>
          </div>
          <div className="form-group row">
            <label className="col-sm-5 col-form-label">Description</label>
            <div className="col-sm-7">
              <textarea className="form-control newDesc" rows="7" onChange={this.handleChange} onKeyPress={this.removeError} id="comment" type="text" placeholder="Album description goes here..."></textarea>
            </div>
          </div>
          <div className="form-group row">
            <label className="col-sm-5 col-form-label">Background Image</label>
            <div className="col-sm-7">
              <input className="form-control newImg" rows="7" id="comment" onChange={this.handleChange} type="text" placeholder="Add background image"></input>
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
