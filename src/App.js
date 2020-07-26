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
        isSignedIn: false
      }
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
      console.log(box)
    }

    onInputChange = (event) => {
      this.setState({
        input: event.target.value
      })
    };

    onButtonSubmit = () => {
      this.setState({
        imageUrl: this.state.input
      })

    app.models
      .predict(
        Clarifai.FACE_DETECT_MODEL,
        this.state.input
      )
      .then((response) => {
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
            <Rank />
            <ImageLinkForm 
              onInputChange={this.onInputChange} 
              onButtonSubmit={this.onButtonSubmit}
          />
          <FaceRecognition box={box} imageUrl={imageUrl} /> 
          </div>
          : (
            route === 'signin' ? 
              <SignIn onRouteChange={this.onRouteChange} />
              :
              <Register onRouteChange={this.onRouteChange} />
          )
        }
        
    </div>
  );
}
}

export default App;
