import { useRef, useState, useEffect } from "react";

import Places from "./components/Places.jsx";
import { AVAILABLE_PLACES } from "./data.js";
import Modal from "./components/Modal.jsx";
import DeleteConfirmation from "./components/DeleteConfirmation.jsx";
import logoImg from "./assets/logo.png";
import { sortPlacesByDistance } from "./loc.js";

// loading saved data from local storage in browser:
const storedIds = JSON.parse(localStorage.getItem("selectedPlaces")) || [];
const storedPlaces = storedIds.map((id) =>
  AVAILABLE_PLACES.find((place) => place.id === id)
);
// map-function goes through each item/id on the list and executes the function find() upon them.
// function find() goes throuch each place in saved locations and checks if this id exists, 
// if yes, then those previously saved locations are shown each time when page is reloaded
// this code for local storage runs synchronously and here we don't need to use useEffect-hook
// we moved this code outside from the App-component, so it only runs once in the entire application lifecycle
// it's enough to run this once, when the whole app starts, so that we don't overuse performance each time the component renders


function App() {

  const modal = useRef();
  const selectedPlace = useRef();

  // new state (without useEffect, only useState-usage would cause infinite loop):
  const [availablePlaces, setAvailablePlaces] = useState([]);

  // const [pickedPlaces, setPickedPlaces] = useState([]); 
  const [pickedPlaces, setPickedPlaces] = useState(storedPlaces); 
  // locations fetched by storeIds.map()-functions can be our initial state for picked places 
  // -> already saved data/locations will be rendered each time we reload page again.

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

    // Another example of a side-effect (for storing data into local storage - unrelated to main code):
    // but we don't have to wrap this code with useEffect,
    // also we cannot, because then useEffect would be inside of the function "handleSelectPlace"
    // React hook cannot! be used in nested functions, if-statements etc., but only on root-level of the component function
    // we have to use useEffect only to prevent infinite loops, or if we want something to run after the component has rendered

    // get all previous ID-s; extracting the data from the local storage in browser (in string-format)
    // to convert extracted data back to original form (not always a string), we use JSON.parse()-method.
    // If we don't have any stored data yet, and in that case, the code produces an empty array []
    const storedIds = JSON.parse(localStorage.getItem("selectedPlaces")) || [];

    //   localStorage - function provided by the browser, for saving data
    //   localStorage - has method setItem() to store data into browser's storage (even after reload or later)
    //   1. argument of method setItem() is a new name, or key, under which items will be saved in browser
    //   2. argument - wrapped by JSON.stringify() - also a method provided by browser
    //   we have to turn all values to strings, otherwise saveing into browser would't work
    //   we can use spread-operator to add new ID-s to the list of potencially already existing saved IDs:

    // localStorage.setItem("selectedPlaces", JSON.stringify([id, ...storedIds]));

    // modification, to add a condition - not to save again an item/id, if this item/id is already on the list
    //  value -1 means that this ID is not yet part of storedIds (then we can proceed and add the item)
    if (storedIds.indexOf(id) === -1) {
      localStorage.setItem(
        "selectedPlaces",
        JSON.stringify([id, ...storedIds])
      );
    }
  }

  function handleRemovePlace() {
    setPickedPlaces((prevPickedPlaces) =>
      prevPickedPlaces.filter((place) => place.id !== selectedPlace.current)
    );
    modal.current.close();

    // We also have to add funtions to delete items from local storage, and to load data from storage
    // (so they are visible every time we reload the app, or open it again after some time)

    // 1st we also have to fetch our stored id-s/places/items:
    const storedIds = JSON.parse(localStorage.getItem("selectedPlaces")) || [];

    // filter-method (by browser) can produce a new array, based on original array + some filtering condition.
    // Argument of the filter-function is a function that will be executed on every item in array,
    // and then we return true if we want to keep the item, or false if we want to delete it from list.
    // If some id is NOT matching with the currently selected id (for deleting), then this item has to be kept.
    // But if the id-s match, this negation-condition will return false, and id will be removed from array.
    // What is stored in the end is an updated array, which doesn't longer contain selected/filtered out id.
    localStorage.setItem(
      "selectedPlaces",
      JSON.stringify(storedIds.filter((id) => id !== selectedPlace.current))
    );
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
- not all sideeffects require using the useEffect - overusing this hook is bad practice!
*/

// next lection: 182

// after this exercise, turn off Location and Allowing apps to access location (in Windows) as it was before
