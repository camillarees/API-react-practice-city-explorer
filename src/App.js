import React from 'react';
import './App.css';
import axios from 'axios';
import Accordion from 'react-bootstrap/Accordion';
import SearchForm from './Components/SearchForm.js';
import LatLon from './Components/LatLon.js'
import Image from 'react-bootstrap/Image';
import InvalidSearchAlert from './Components/InvalidSearchAlert.js';
import Weather from './Components/Weather.js';
import Movies from './Components/Movies.js';
import Footer from './Components/Footer.js';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      searchQuery: "",
      location: {},
      errorMessage: false,
      weather: [],
      movie: []
    }
  };

  handleChange = (event) => {
    this.setState({ searchQuery: event.target.value });
  };

  getLocation = async () => {
    try {
      const url = `https://us1.locationiq.com/v1/search.php?key=${process.env.REACT_APP_LOCATION_IQ_KEY}&q=${this.state.searchQuery}&format=json`;
      console.log('URL: ', url);
      const response = await axios.get(url)
      this.setState({ location: response.data[0], errorMessage: false }, () => this.getMap());
    } catch (error) {
      console.log(error.response.data);
      this.setState({
        errorMessage: true,
        error: error.response.data.error,
        location: {},
        map: '',
      })
    }
  }


  getMap = async () => {
    this.setState({
      map: `https://maps.locationiq.com/v3/staticmap?key=${process.env.REACT_APP_LOCATION_IQ_KEY}&center=${this.state.location.lat},${this.state.location.lon}&zoom=12&size=1200x500`
    }, () => {
      this.getWeather();
      this.getMovies();
    });
  };

  getWeather = async () => {
    try {
      const weatherUrl = `${process.env.REACT_APP_SERVER}/weather?lat=${this.state.location.lat}&lon=${this.state.location.lon}`;
      const response = await axios.get(weatherUrl);
      console.log(response.data);
      this.setState({ weather: response.data });
    } catch (error) {
      console.log(error.response.data);
      this.setState({
        errorMessage: true,
        error: error.response.data.error,
        location: {},
        map: ''
      })
    }
  }


  getMovies = async () => {
    try {
      const movieUrl = `${process.env.REACT_APP_SERVER}/movies?city=${this.state.searchQuery}`;
      const response = await axios.get(movieUrl);
      this.setState({ movie: response.data });
    } catch (error) {
      this.setState({
        errorMessage: true,
        error: error.response.data.error,
        location: {},
        map: ''
      })
    }
  }

  handleSubmit = (event) => {
    event.preventDefault();
    this.getLocation();
  }


  render() {
    return (
      <div className="App">
        <h1>city explorer</h1>
        <>
          <SearchForm handleSubmit={this.handleSubmit} handleChange={this.handleChange} />
        </>
        {this.state.errorMessage &&
          <InvalidSearchAlert alert={this.state.error}/>
        }
        {this.state.location.display_name &&
          <>
            <div className='map-div'>
              <Image className='map-image'
            fluid src={this.state.map}
            alt="city map" />
            </div>
            <div className='accordion-div'>
            <Accordion class='accordion accordion-flush' id='accordion' defaultActiveKey="0">
              <Accordion.Item id="accordion-item" eventKey="0">
                <Accordion.Header id="accordion-header">city</Accordion.Header>
                <Accordion.Body>
                  <h2>the city you searched for is {this.state.location.display_name.toLowerCase()}</h2>
                </Accordion.Body>
              </Accordion.Item>
              <Accordion.Item id="accordion-item" eventKey="1">
                <Accordion.Header>latitude and longitude</Accordion.Header>
                <Accordion.Body>
              <LatLon lat={this.state.location.lat} lon={this.state.location.lon} />
                </Accordion.Body>
              </Accordion.Item>
              <Accordion.Item id="accordion-item" eventKey="2">
                <Accordion.Header>weather</Accordion.Header>
                <Accordion.Body>
                  <Weather weatherData={this.state.weather} />
                </Accordion.Body>
              </Accordion.Item>
              <Accordion.Item id="accordion-item-movie" eventKey="3">
                <Accordion.Header>movies</Accordion.Header>
                <Accordion.Body>
                  <Movies movieData={this.state.movie} />
                </Accordion.Body>
              </Accordion.Item>
            </Accordion>
            </div>
            <Footer />
          </>
        }
        
      </div >

    );
  };
};


export default App;
