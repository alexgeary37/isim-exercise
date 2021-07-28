import React, { useEffect, useState } from 'react';
import './App.css';

import scale from './assets/radaltback.png';
import cover from './assets/radaltcover.png';
import needle from './assets/radaltneedle.png';
import bugImg from './assets/bug.png';
import flagImg from './assets/radaltflag.png';

function App() {
  const [hasPower, setHasPower] = useState(false)
  const [imageDiameter, setImageDiameter] = useState(0)
  const [altitude, setAltitude] = useState(0)

  // To store the altitude value when power is off and user changes dial position.
  const [altitudeWithoutPower, setAltitudeWithoutPower] = useState(0)

  const [bugValue, setBugValue] = useState(0)
  const [lightIsOn, setLightIsOn] = useState(false)

  // Get the diameter of the image for positioning dials.
  const initialiseImageDiameter = ({ target: img }) => {
    setImageDiameter(img.width)
  }

  const toggleHasPower = () => {
    if (!hasPower) {
      // Power is going to be turned on, so set altitude to dial's value.
      setAltitude(altitudeWithoutPower)
    } else {
      setAltitudeWithoutPower(altitude)
    }
    setHasPower(!hasPower)
    setLightIsOn(false)
  }

  // Update the altitude and turn light on or off if conditions are met.
  const updateAltitude = () => {
    if (hasPower) {
      const currentAltitude = altitude
      const newAltitude = Number(document.getElementById('altitude').value)

      if (currentAltitude >= bugValue && newAltitude < bugValue) {
        setLightIsOn(true)
      }
      if (currentAltitude < bugValue && newAltitude >= bugValue) {
        setLightIsOn(false)
      }

      setAltitude(newAltitude)
    } else {
      // Power is off, so keep track of what the altitude will be when power is turned on again.
      setAltitudeWithoutPower(Number(document.getElementById('altitude').value))
    }
  }

  const displayAltitudeValue = () => {
    if (hasPower) {
      return <label>{altitude}</label>
    } else {
      return <label>{altitudeWithoutPower}</label>
    }
  }

  const updateBugValue = () => {
    setBugValue(Number(document.getElementById('bugValue').value))
  }

  // Display flag if power is on.
  const displayFlag = () => {
    if (!hasPower) {
      return <img className='image_pos' alt='' src={flagImg} />
    }
  }

  // Display bright light if power is on, otherwise display it with dull colour.
  const displayLight = () => {
    if (lightIsOn) {
      return <span className='onLight' style={{top: imageDiameter / 2}}></span>
    } else {
      return <span className='offLight' style={{top: imageDiameter / 2}}></span>
    }
  }

  // Update the position of the needle whenever the user changes the altitude
  // This will only happen when the power is on.
  useEffect(() => {
    let deg;
    const altitudeDialValue = Number(document.getElementById('altitude').value)
    
    if (altitudeDialValue <= 500) {
      deg = 180 * altitudeDialValue / 500
    } else {
      deg = 180 + (45 * (altitudeDialValue - 500) / 500)
    }

    document.getElementById('needle').style.transform = `rotate(${deg}deg)`
  }, [altitude])

  // Update the bug whenever the value is changed by the user.
  useEffect(() => {
    let deg;
    const altitudeDialValue = Number(document.getElementById('bugValue').value)
    
    if (altitudeDialValue <= 500) {
      deg = 180 * altitudeDialValue / 500
    } else {
      deg = 180 + (45 * (altitudeDialValue - 500) / 500)
    }

    document.getElementById('bug').style.transform = `rotate(${deg}deg)`
  }, [bugValue])

  return (
    <div>
      <h1>Radar Altimeter</h1>

      <img className='image_pos' onLoad={initialiseImageDiameter} alt='scale' id='scale' src={scale} />
      <img className='image_pos' alt='cover' id='cover' src={cover} />
      <img className='image_pos' alt='needle' id='needle' src={needle} />
      <img className='image_pos' alt='bug' id='bug' src={bugImg} />
      {displayFlag()}
      {displayLight()}

      <div className='dials' style={{top: imageDiameter}}>
        <div>
          <label>Altitude:</label>
          <input type='range' defaultValue='0' min='0' max='1500' id='altitude' onChange={updateAltitude}></input>
          {displayAltitudeValue()}
        </div>
          <div>
            <label>Bug:</label>
            <input type='range' defaultValue='0' min='0' max='1500' id='bugValue' onChange={updateBugValue}></input>
            <label>{bugValue}</label>
          </div>
        <div>
          <label>Has Power:</label>
          <input type='checkbox' id='hasPower' name='hasPower' value={hasPower} onClick={toggleHasPower}/>
        </div>
      </div>
    </div>
  );
}

export default App;
