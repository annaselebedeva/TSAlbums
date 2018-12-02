import React, { Component } from 'react';
//import ReactDOM from 'react-dom';
import StarRatingComponent from 'react-star-rating-component';
import './TS.css';
import 'whatwg-fetch';
import 'bootstrap/dist/css/bootstrap.min.css';
import './addNewAlbum.css'

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
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(event) {
    this.setState({value: event.target.value});
  }

  async handleSubmit(event) {
      let { name, yearReleased, description, image, songs } = this.state;
      try {
        await fetch('/api/create', {
          method: 'POST',
          body: { name, yearReleased, description, image, songs }
        });
      } catch (e) {
        console.log(e);
      }
    event.preventDefault();
  }

  componentDidMount() {
      document.title = 'Taylor Swift Albums';
  }

  render() {
    let i = 0;
      //console.log(this.state.songs);
    return (
      <div className="modal-content">
        <span className="close">&times;</span>
        <div className="form">
          <form onSubmit={this.handleSubmit}>
            <label className="name">
              Name: 
              <input className="name" type="text" value={this.state.value} onChange={this.handleChange} />
            </label>
            <input type="submit" value="Add Album" />
          </form>            
        </div>
      </div>
    );
  }
}
export default NewAlbum;
