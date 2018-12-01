import React, { Component } from 'react';
//import ReactDOM from 'react-dom';
import StarRatingComponent from 'react-star-rating-component';
import './TS.css';
import 'whatwg-fetch';

//import Client from './Client';
var data = require('./rep.json');

class TS extends Component {
  constructor (props) {
    super(props);
      this.state = {
        rating: [],
        name: '',
        yearReleased: '',
        description: '',
        songs: []
      };
      this.pollInterval = null;
    //this.saveAlbum = this.saveAlbum.bind(this);
    this.loadAlbumsFromServer = this.loadAlbumsFromServer.bind(this);
  }
  onStarClick(nextValue, prevValue, name) {
    this.setState({rating:nextValue});
    localStorage.setItem("rating "+name, nextValue);
  }

  loadAlbumsFromServer() {
    fetch('api/5bfa4a18b5a1af09f28b7ff5/')
      .then(data => data.json())
      .then((res) => {
        console.log('1: ', res);
        this.setState({ 
          name: res.name,
          yearReleased: res.yearReleased,
          description: res.description,
          songs: res.songs
        });
        console.log('2', this.state);
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
        <div className="leftPanel ">
          <button id="saveBtn" onClick={this.saveAlbum}>Save Album</button>
          <p align="center" className="albName"><span>{this.state.name}</span></p>
          <p align="center" className="desc"><span>{this.state.description}</span></p>
          <p></p>
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

          <div className="modal-content">
            <span className="close">&times;</span>
            <div>Some text in the Modal..</div>
          </div>
        </div>
      </div>
    );
  }
}

export default TS;
