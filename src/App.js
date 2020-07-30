import React, {Component} from 'react';
import Particles from "react-particles-js";
import './App.css';
 // ***** components ***** //
import FaceRecognition from './components/FaceRecognition';
import ImageLinkForm from './components/ImageLinkForm';
import Logo from './components/Logo';
import Navigation from './components/Navigation';
import Rank from './components/Rank';
import Register from './components/Register';
import SignIn from './components/SignIn';

const Clarifai = require("clarifai");

const app = new Clarifai.App({
  apiKey: "ff157bc76f3d4956856ad93e6478c132",
});

const particleOptions = {

    particles: {
      number: {
        value: 160,
        density: {
          enable:true,
          value_area: 900
        }
      }
    }
  }
  class App extends Component {
    constructor() {
      super();
        this.state = {
          input: '',
          imageUrl: '',
          box: {},
          route: 'signin',
          isSignedIn: false,
          user: {
            id: '',
            name: '',
            email: '',
            entries: 0,
            joined: 'new Date()'
        }
       }    };

    loadUser = (data) => {
      this.setState({user: {
          id: data.id,
          name: data.name,
          email: data.email,
          entries: data.entries,
          joined: data.joined
         }})
     };

    calulateFaceLocation = (data) => {
      const clarifaiFace = data.outputs[0].data.regions[0].region_info.bounding_box;
      const image = document.getElementById('inputImage');
      const width = Number(image.width);
      const height = Number(image.height);
  
      return {
        leftCol: clarifaiFace.left_col * width,
        topRow: clarifaiFace.top_row * height,
        rightCol: width - (clarifaiFace.right_col * width),
        bottomRow: height - (clarifaiFace.bottom_row * height)
      }
    };

    displayFaceBox = (box) => {
      this.setState({box: box})
    };

    onInputChange = (event) => {
      this.setState({
        input: event.target.value
      })
    };

    onPictureSubmit = () => {
      this.setState({
        imageUrl: this.state.input
      })

    app.models
      .predict(
        Clarifai.FACE_DETECT_MODEL,
        this.state.input
      )
      .then((response) => {
        if(response) {
          fetch('http://localhost:3001/image', {
            method: 'put',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
              id: this.state.user.id
            })
          })
          .then(response => response.json())
          .then(count => {
            this.setState(Object.assign(this.state.user, {entries: count}))
          })
        }
        this.displayFaceBox(this.calulateFaceLocation(response))
      })
      .catch((err) => {
        console.log(err);
      });
    };

    onRouteChange = (route) => {
      if(route === 'signout') {
        this.setState({isSignedIn: false})
      } else if (route === 'home') {
        this.setState({isSignedIn: true})
      }
      this.setState({route: route})
    };

    render() {

      const {isSignedIn, imageUrl, route, box} = this.state

      return (
        <div className="App">
          <Particles params={particleOptions} className='particles'/>
          <Navigation onRouteChange={this.onRouteChange} isSignedIn={isSignedIn} />

          { route === 'home' ? 
            <div>
            <Logo />
            <Rank 
              name = {this.state.user.name}
              entries = {this.state.user.entries}
              />
            <ImageLinkForm 
              onInputChange={this.onInputChange} 
              onPictureSubmit={this.onPictureSubmit}
          />
          <FaceRecognition box={box} imageUrl={imageUrl} /> 
          </div>
          : (
            route === 'signin' 
            ? <SignIn loadUser={this.loadUser} onRouteChange={this.onRouteChange} />
            :
              <Register loadUser={this.loadUser} onRouteChange={this.onRouteChange} />
          )
        }   
    </div>
  );
}
};

export default App;

