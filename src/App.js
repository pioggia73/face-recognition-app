import React from 'react';
import Particles from "react-particles-js";
import './App.css';
// ***** components ***** //
import ImageLinkForm from './components/ImageLinkForm';
import Logo from './components/Logo';
import Navigation from './components/Navigation';
import Rank from './components/Rank';

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

function App() {
  return (
    <div className="App">
      <Particles params={particleOptions} className='particles'/>
      <Navigation />
      <Logo />
      <Rank />
      <ImageLinkForm />
      {/* <FaceRecognition /> */}
    </div>
  );
}

export default App;
