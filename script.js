'use strict';

// prettier-ignore
const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

const form = document.querySelector('.form');
const containerWorkouts = document.querySelector('.workouts');
const inputType = document.querySelector('.form__input--type');
const inputDistance = document.querySelector('.form__input--distance');
const inputDuration = document.querySelector('.form__input--duration');
const inputCadence = document.querySelector('.form__input--cadence');
const inputElevation = document.querySelector('.form__input--elevation');


// Lecture 5: Geolocation API's
if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(function(position){
        const { latitude } = position.coords
        const { longitude } = position.coords
        console.log(longitude, latitude )
        const coords = [longitude,latitude]
        // the specific chunk of the code mentioned below is coming from the leaflet and 
        // const map = L.map('map').setView([51.505, -0.09], 13);
        // whatever we pass in this map function should be the id of the element(div) in place of that div, inner content will be this map. In HTML, we have empty div with ID map.
        // Here L is the function which leaflet provides as entry point a kind of empty space
        // So after this configuration in UI the map is shown with coordinates [51.505, -0.09].
        const map = L.map('map').setView([51.5, -0.09], 13); 
        console.log(map)
        // Here down the prototype chain i have seen the on method and this method will be used to  get the co-ordinates where the user has specifically clicked   
        // the second param in the setView method will set the zoom larger the value more it is zoomed in, lesser the value less will be zoom in.

        L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(map);

        // The map we see in the UI is made up of small tiles and these tiles they come from the URL tile.openstreetmap.org. This open street map is an open source map which every one can use for free but leaflet can work with all kind of maps even the google map all is on the personal preference. 

        // L.marker([51.5, -0.09]).addTo(map)

            map.on('click', function(mapEvent){
                console.log(mapEvent)
                const {lat,lng} = mapEvent.latlng;
                L.marker([lat, lng]).addTo(map)
                .bindPopup(L.popup({
                    maxWidth: 250,
                    minWidth: 100,
                    autoClose: false,
                    closeOnClick: false,
                    className: 'running-popup',
                }
                ))
                .setPopupContent('Workout')
                .openPopup();
            })
            // this on method is not  coming from Js rather it is coming from leaflet 
            // in console i have seen that on using this on method, when i click at any point in the map it gives me different map event all the time.
            }, function(){
                alert('could not get your position')
        }
    )
}

// geolocation is a browser API, which is very easy to get
// This API gives the current location 
// this API is get by using navigator.geolocation
// and with it is the getCurrentPosition function which calls one of the two call back function. First one is on success and the second one if the API fails to return the result.


// Lecture 6: Displaying a map using leaflet

// Leaflet is the open source js library for mobile friendly interactive maps

// Lecture 7: Displaying a map marker

// in order to get this thing we need to access the exact co-ordinates where user clicks and show the popup for these co-ordinates. The thing  is like eventListener but we can not apply onclick in the event listener of the complete map because it will not specify the specif coordinates.

