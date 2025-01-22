import { useRef, useState, useEffect } from "react";

import Places from "./components/Places.jsx";
import { AVAILABLE_PLACES } from "./data.js";
import Modal from "./components/Modal.jsx";
import DeleteConfirmation from "./components/DeleteConfirmation.jsx";
import logoImg from "./assets/logo.png";
import { sortPlacesByDistance } from "./loc.js";

function App() {
  const modal = useRef();
  const selectedPlace = useRef();

  // new state (without useEffect, only useState-usage would cause infinite loop):
  const [availablePlaces, setAvailablePlaces] = useState([]);

  const [pickedPlaces, setPickedPlaces] = useState([]);

  // useEffect doesn't return value, and needs 2 arguments:
  // 1. a function that should wrap around our side-effect code
  // 2. dependencies (initially, it can be an empty array []) 
  // - useEffect will re-execute again only if dependency values have been changed.
  // useEffect will be executed AFTER every component execution, not before or during that.
  // If dependency is empty array [], useEffect executes only once, 
  // after App.js-function has been executed for the 1st time, and then never again.
  // If we don't add any dependencies, not even [], useEffect would execute once 
  // after every App-component render cycle -> we would still have an infinite loop.
  useEffect(() => {
    navigator.geolocation.getCurrentPosition((position) => {
      const sortedPlaces = sortPlacesByDistance(
        AVAILABLE_PLACES,
        position.coords.latitude,
        position.coords.longitude
      );
      setAvailablePlaces(sortedPlaces);
    });
  }, []);

  // NEW: A SIDE-EFFECT (not directly connected to the main code)
  // code to get user's location - through 'navigator'-object (object exposed by browser to JS - depends on browser):
  // navigator-object has geolocation-object, which has a method getCurrentPosition()
  // user will be asked via browser: can the app get his location? if he agrees, app will fetch this info
  // fetching location can take some time, and therefore getCurrentPosition-method has a function as argument,
  // this anonymous arrow function will be executed once the location was fetched
  // position-object will be provided by browser

  // navigator.geolocation.getCurrentPosition((position) => {
  //   const sortedPlaces = sortPlacesByDistance(AVAILABLE_PLACES, position.coords.latitude, position.coords.longitude);
  //   // calling a special function 'sortPlacesByDistance' which is defined in loc.js
  //   // passing the list of destinations, as well as user's latitude and longitude to this function
  //   // result will be an array 'sortedPlaces'

  //   setAvailablePlaces(sortedPlaces);
  // });   -> moved this part up into the anonymous function-wrapper, which is 1.argument of the useEffect-hook


  function handleStartRemovePlace(id) {
    modal.current.open();
    selectedPlace.current = id;
  }

  function handleStopRemovePlace() {
    modal.current.close();
  }

  function handleSelectPlace(id) {
    setPickedPlaces((prevPickedPlaces) => {
      if (prevPickedPlaces.some((place) => place.id === id)) {
        return prevPickedPlaces;
      }
      const place = AVAILABLE_PLACES.find((place) => place.id === id);
      return [place, ...prevPickedPlaces];
    });
  }

  function handleRemovePlace() {
    setPickedPlaces((prevPickedPlaces) =>
      prevPickedPlaces.filter((place) => place.id !== selectedPlace.current)
    );
    modal.current.close();
  }

  return (
    <>
      <Modal ref={modal}>
        <DeleteConfirmation
          onCancel={handleStopRemovePlace}
          onConfirm={handleRemovePlace}
        />
      </Modal>

      <header>
        <img src={logoImg} alt="Stylized globe" />
        <h1>PlacePicker</h1>
        <p>
          Create your personal collection of places you would like to visit or
          you have visited.
        </p>
      </header>
      <main>
        <Places
          title="I'd like to visit ..."
          fallbackText={"Select the places you would like to visit below."}
          places={pickedPlaces}
          onSelectPlace={handleStartRemovePlace}
        />
        <Places
          title="Available Places"
          places={availablePlaces}
          fallbackText="Sorting places by distance..."
          onSelectPlace={handleSelectPlace}
        />
      </main>
    </>
  );
}

export default App;

/*  
SIDEFFECTS = tasks which need to be performed in the app, but which don't affect the current component's
re-rendering cycle
*/


// next lection: 180

// after this exercise, turn off Location and Allowing apps to access location (in Windows) as it was before