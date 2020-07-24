import React from 'react';
import Tilt from 'react-tilt';
import brain from '../images/brain-icon.png';

const Logo = () => {
   return (
     <div className="ma4 mt0">
       <Tilt
         className="Tilt br2 shadow-5"
         options={{ max: 55 }}
         style={{ height: 100, width: 150 }}
       >
         <div className="Tilt-inner pa3">
            <img style={{paddingTop: '3px'}} src={brain} alt='logo' />
         </div>
       </Tilt>
     </div>
   );
}

export default Logo;
