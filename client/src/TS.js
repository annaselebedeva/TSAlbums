import React, { Component } from 'react';
//import ReactDOM from 'react-dom';
import StarRatingComponent from 'react-star-rating-component';
import './TS.css';
import 'whatwg-fetch';
import 'bootstrap/dist/css/bootstrap.min.css';
import NewAlbum from './addNewAlbum.js'
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
        value: ''
      };
      this.pollInterval = null;
    //this.saveAlbum = this.saveAlbum.bind(this);
    this.toggleOpen = this.toggleOpen.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.loadAlbumsFromServer = this.loadAlbumsFromServer.bind(this);
  }
  onStarClick(nextValue, prevValue, name) {
    this.setState({rating:nextValue});
    localStorage.setItem("rating "+name, nextValue);
    console.log(this.state.rating);
  }
  toggleOpen() {
    this.setState({ isOpen: !this.state.isOpen });
  } 

  handleChange(event) {
    this.setState({value: event.target.value});
  }

  handleSubmit(event) {
    alert('A name was submitted: ' + this.state.value);
    document.getElementById("myModal").style.display = "none";

    event.preventDefault();
  }

  loadAlbumsFromServer() {
    fetch('api/5bfa4a18b5a1af09f28b7ff5/')
      .then(data => data.json())
      .then((res) => {
        this.setState({ 
          name: res.name,
          yearReleased: res.yearReleased,
          description: res.description,
          songs: res.songs,
          image: res.image
        });
      });
  }

componentWillUnmount() {
  if (this.pollInterval) clearInterval(this.pollInterval);
  this.pollInterval = null;
}

componentDidMount() {
    document.title = 'Taylor Swift Albums';

    this.loadAlbumsFromServer();
    if (!this.pollInterval) {
      this.pollInterval = setInterval(this.loadAlbumsFromServer, 2000);
    }

    let modal = document.getElementById("myModal");
    let btn = document.getElementById("saveBtn");
    let span = document.getElementsByClassName("close")[0];
    btn.onclick = function () {
      modal.style.display = "block";
    }
    span.onclick= function () {
      modal.style.display = "none";
    }
    window.onclick = function (event) { 
      if (event.target === modal) {
        modal.style.display = "none"
      }
    }


    //console.log(this.state.songs);
  }

  render() {
    const { rating } = this.state; 
    const menuClass = `dropdown-menu ${this.state.isOpen ? " show" : ""}`;
    let i = 0;
    //console.log(this.state.songs);
    let songs = this.state.songs.map((song) => {
      return (
        <tbody>
            <tr>
              <td>{ ++i }</td>
              <td>{ this.state.songs[i-1].name }</td>
              <td>{ this.state.songs[i-1].duration }</td>
              <td>
                <StarRatingComponent 
                  name={"rate"+i}
                  starCount={5}
                  value={JSON.parse(localStorage.getItem(`rating rate${i}`))}
                  onStarClick={this.onStarClick.bind(this)}
                />
              </td>
            </tr>
        </tbody>
      );
  });


    return (
      <div className='taylor'>
        <div className="leftPanel">
          <div className="dropdown">
            <button id="saveBtn" type="button" className="btn" onClick={this.saveAlbum}>Save New Album</button>
            <button className="btn dropdown-toggle" onClick={this.toggleOpen} type="button" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true">
              Change Album
            </button>
            <div className={menuClass} aria-labelledby="dropdownMenuButton">
              <button className="dropdown-item" type="button" >Taylor Swift</button>
              <button className="dropdown-item" type="button">Fearless</button>
              <button className="dropdown-item" type="button">Speak Now</button>
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
          <NewAlbum />
        </div>
      </div>
    );
  }
}

export default TS;
