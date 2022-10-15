import React from 'react';
import './App.css';
import axios from 'axios';
import Accordion from 'react-bootstrap/Accordion';
import Image from 'react-bootstrap/Image';
import Alert from 'react-bootstrap/Alert';
import WeatherDay from './Components/WeatherDay.js';
import Weather from './Components/Weather.js'
import Form from 'react-bootstrap/Form';
import Movie from './Components/Movie.js';
import Movies from './Components/Movies.js';


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
        map: ''
      })
    }
  }


  getMap = async () => {
    this.setState({
      map: `https://maps.locationiq.com/v3/staticmap?key=${process.env.REACT_APP_LOCATION_IQ_KEY}&center=${this.state.location.lat},${this.state.location.lon}&zoom=12`
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
    this.setState ({
      errorMessage: true,
        error: error.response.data.error,
          location: { },
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
          <Form onSubmit={this.handleSubmit}>
            <Form.Group>
              <Form.Label>search any city in the world</Form.Label>
              <Form.Control
                type="text"
                onChange={this.handleChange}
                placeholder="start typing"
              />
            </Form.Group>
          </Form>
        </>
        {this.state.errorMessage &&
          <Alert variant="danger">
            <Alert.Heading>{this.state.error}</Alert.Heading>
            <p>
              please enter a valid location
            </p>
          </Alert>
        }
        {this.state.location.display_name &&
          <>
            <div>
              <Image
                src={this.state.map}
                alt="city map"
              />
            </div>
            <Accordion defaultActiveKey="0">
              <Accordion.Item eventKey="0">
                <Accordion.Header>city</Accordion.Header>
                <Accordion.Body>
                  <h2>the city you searched for is {this.state.location.display_name}</h2>
                </Accordion.Body>
              </Accordion.Item>
              <Accordion.Item eventKey="1">
                <Accordion.Header>latitude</Accordion.Header>
                <Accordion.Body>
                  <h2>{this.state.location.lat}</h2>
                </Accordion.Body>
              </Accordion.Item>
              <Accordion.Item eventKey="2">
                <Accordion.Header>longitude</Accordion.Header>
                <Accordion.Body>
                  <h2>{this.state.location.lon}</h2>
                </Accordion.Body>
              </Accordion.Item>
              <Accordion.Item eventKey="3">
                <Accordion.Header>weather</Accordion.Header>
                <Accordion.Body>
                  <WeatherDay weatherData={this.state.weather} />
                </Accordion.Body>
              </Accordion.Item>
              <Accordion.Item eventKey="4">
                <Accordion.Header>movies</Accordion.Header>
                <Accordion.Body>
                  <Movie movieData={this.state.searchQuery} />
                </Accordion.Body>
              </Accordion.Item>
            </Accordion>

          </>
        }

      </div >

    );
  };
};


export default App;
