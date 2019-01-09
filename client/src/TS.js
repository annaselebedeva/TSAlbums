import React, { Component } from 'react';
//import ReactDOM from 'react-dom';
import StarRatingComponent from 'react-star-rating-component';
import './TS.css';
import 'whatwg-fetch';
import 'bootstrap/dist/css/bootstrap.min.css';
import NewAlbum from './addNewAlbum.js';
import $ from 'jquery'

//import Client from './Client';
var data = require('./rep.json');

class TS extends Component {
  constructor (props) {
    super(props);
      this.state = {
        rating: [],
        name: '',
        yearReleased: '',
        image: '',
        description: '',
        songs: [],
        isOpen: false,
        value: '',
        showModal: false,
        albums: []
      };
    this.pollInterval = null;
    this.toggleOpen = this.toggleOpen.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.loadAlbum = this.loadAlbum.bind(this);
    this.loadAlbumsFromServer = this.loadAlbumsFromServer.bind(this);
    this.myCallback = this.myCallback.bind(this);

  }
  onStarClick(nextValue, prevValue, name) {
    this.setState({rating:nextValue});
    localStorage.setItem("rating "+name, nextValue);
    console.log(this.state.rating);
  }
  toggleOpen() {
    if ($('.dropdown-menu').hasClass('show')) $('.dropdown-menu').show();
    this.setState({ isOpen: !this.state.isOpen });
  } 

  handleChange(event) {
    this.setState({value: event.target.value});
  }
  loadAlbum(event) {
    let albumObj = this.state.albums.find(album => album.name === event.target.textContent);
    this.setState({
        name: albumObj.name,
        yearReleased: albumObj.yearReleased,
        image: albumObj.image,
        description: albumObj.description,
        songs: albumObj.songs,
    }); 
    $('.taylor').css("background-image", `url(${albumObj.image})`);
    $('.landing').css("display", "none");
    $('.info').css("display", "block");
    $('.rightPanel').css("display", "block");
    $('.dropdown-menu').hide();
    this.toggleOpen();
  }

loadAlbumsFromServer() {
    fetch('api/allAlbums/')
      .then(data => data.json())
      .then((res) => this.setState({ albums: res }, ()=> console.log(this.state.albums)));
}

componentWillUnmount() {
  if (this.pollInterval) clearInterval(this.pollInterval);
  this.pollInterval = null;
}

componentDidMount() {
    document.title = 'Taylor Swift Albums';
    
    if (!this.pollInterval) {
      this.pollInterval = setInterval(this.loadAlbumsFromServer, 2000);
    }
    $('#saveBtn').click(function () {
      $('#myModal').css("display","block");
    });
    window.onclick = function (event) { 
      if (event.target === document.getElementById('myModal')) {
        $('#myModal').css("display", "none");
      }
    }
  }

  myCallback(dataFromChild) {
    this.setState({ showModal: dataFromChild }, () => {
      if (!this.state.showModal) {
        $("#myModal").css("display", "none");
      } 
    });
  }
  render() {
    const { rating } = this.state; 
    const menuClass = `dropdown-menu ${this.state.isOpen ? " show" : ""}`;
    let i = 0;
    let albumList = this.state.albums.map((album)=> {
      return (
        <button className="dropdown-item" type="button" onClick={this.loadAlbum}>{ album.name }</button>
      );
    });
    let songs = this.state.songs.map((song) => {
      return (
        <tbody>
            <tr>
              <td>{ ++i }</td>
              <td>{ this.state.songs[i-1].name }</td>
              <td>{ this.state.songs[i-1].duration }</td>
              <td> {/*JSON.parse(localStorage.getItem(`rating rate${i}`))*/}
                <StarRatingComponent 
                  name={"rate"+i}
                  starCount={5}
                  value={song.rating}
                  onStarClick={this.onStarClick.bind(this)}
                />
              </td>
            </tr>
        </tbody>
      );
  });

    return (
      <div className='taylor'>
        <div className="landing">
          <p align="center" className="title"><span>Taylor Swift's Albums</span></p>          
          <p align="center" className="desc">
            Welcome to the Taylor Swift Albums website!
            Click on "Change Album" to pick an album to display or "Save New Album" to save a new album! 
            Thank you for visiting! 
          </p>
        </div>      
        <div className="leftPanel">
          <div className="dropdown">
            <button id="saveBtn" type="button" className="btn">Create New Album</button>
            <button className="btn dropdown-toggle" onClick={this.toggleOpen} type="button" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true">
              Change Album
            </button>
            <div className={menuClass} aria-labelledby="dropdownMenuButton">
              { albumList }
            </div>
          </div>

          <div className="info">
            <p align="center" className="albName"><span>{this.state.name}</span></p>
            <p align="center" className="desc"><span>{this.state.description}</span></p>
          </div>
        </div>
        <div className="rightPanel">
          <table> 
            <thead>
              <tr>
                <th>#</th>
                <th>Song</th>
                <th>Duration</th>
                <th>Rating</th>
              </tr>
            </thead>
              {songs}
          </table>
        </div>
        <div id="myModal" className="modal">
          <NewAlbum 
            callbackFromParent={this.myCallback}
          />
        </div>
      </div>
    );
  }
}


export default TS;
