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

class App {
    #map;
    #mapEvent
    constructor(){
        this._getPosition();
        // This will give the map as soon as the page is loaded
        form.addEventListener('submit',this._newNetwork.bind(this))
        // Due to eventListener the this keyword  was pointing to the form and not the form so to resolve this issue we need to bind the this keyword
        inputType.addEventListener('change', this._toggleElevationField)
    }

    _getPosition(){
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(this._loadMap.bind(this), function(){
                    alert('could not get your position')
                }
            )
        }
    }
    
    _loadMap(position){
        const { latitude } = position.coords
        const { longitude } = position.coords
        console.log(longitude, latitude )
        const coords = [longitude,latitude]
        this.#map = L.map('map').setView([51.5, -0.09], 13); 
        console.log(map)
        L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(this.#map);
        this.#map.on('click', this._showForm.bind(this))
    }

    _showForm(mapE){
        this.#mapEvent = mapE
        form.classList.remove('hidden')
        inputDistance.focus()
    }

    _toggleElevationField(){
        inputElevation.closest('.form__row').classList.toggle('form__row--hidden');
        inputCadence.closest('.form__row').classList.toggle('form__row--hidden')
    }

    _newNetwork(e){
        e.preventDefault()
            // clear the input fields
            inputDistance.value = inputDuration.value = inputCadence.value = inputElevation.value = ''
            // Showing the popup
                        const {lat,lng} = this.#mapEvent.latlng;
                        L.marker([lat, lng]).addTo(this.#map)
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
    }
}

const app = new App();

/*
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
        map = L.map('map').setView([51.5, -0.09], 13); 
        console.log(map)
        // Here down the prototype chain i have seen the on method and this method will be used to  get the co-ordinates where the user has specifically clicked   
        // the second param in the setView method will set the zoom larger the value more it is zoomed in, lesser the value less will be zoom in.

        L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(map);

        // The map we see in the UI is made up of small tiles and these tiles they come from the URL tile.openstreetmap.org. This open street map is an open source map which every one can use for free but leaflet can work with all kind of maps even the google map all is on the personal preference. 

        // L.marker([51.5, -0.09]).addTo(map)

        // handling clicks 
            map.on('click', function(mapE){
                mapEvent = mapE
                form.classList.remove('hidden')
                inputDistance.focus()
                // console.log(mapEvent)
                // const {lat,lng} = mapEvent.latlng;
                // L.marker([lat, lng]).addTo(map)
                // .bindPopup(L.popup({
                //     maxWidth: 250,
                //     minWidth: 100,
                //     autoClose: false,
                //     closeOnClick: false,
                //     className: 'running-popup',
                // }
                // ))
                // .setPopupContent('Workout')
                // .openPopup();
            })
            // this on method is not  coming from Js rather it is coming from leaflet 
            // in console i have seen that on using this on method, when i click at any point in the map it gives me different map event all the time.
            }, function(){
                alert('could not get your position')
        }
    )
}

form.addEventListener('submit',function(e){
    e.preventDefault()
    // clear the input fields
    inputDistance.value = inputDuration.value = inputCadence.value = inputElevation.value = ''
    // Showing the popup
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

// toggling for input type to show and hide inputElevation and inputCadence;

inputType.addEventListener('change', function(){
    inputElevation.closest('.form__row').classList.toggle('form__row--hidden');
    inputCadence.closest('.form__row').classList.toggle('form__row--hidden')
})
*/


// geolocation is a browser API, which is very easy to get
// This API gives the current location 
// this API is get by using navigator.geolocation
// and with it is the getCurrentPosition function which calls one of the two call back function. First one is on success and the second one if the API fails to return the result.


// Lecture 6: Displaying a map using leaflet

// Leaflet is the open source js library for mobile friendly interactive maps

// Lecture 7: Displaying a map marker

// in order to get this thing we need to access the exact co-ordinates where user clicks and show the popup for these co-ordinates. The thing  is like eventListener but we can not apply onclick in the event listener of the complete map because it will not specify the specif coordinates.

// Lecture 8: Displaying the form and then onsubmit of the form, which in our case is the return button show the popup -> This thing is achieved and mention in the code snippet above

// Lecture 9: Project Architecture
// The website is all about data and there is no meaning of web page without data.
// Here in our case the data is directly coming from the UI 
// log my running workout with location, distance, time, pace and steps/minutes.
// log my cycling workout with location, distance, time, pace and elevation gain.

// So we need to build the structure that user data filled by the input fields should be added in an object.

// So using ES6, there will be child two child classes running and cycling and there is one parent class workout.

// distance, duration and coords properties will be in parent class Parent class also have the properties like id and date and the need of these properties will be seen while coding. Child class cycling will take these 3 properties and will have two further properties cadence and pace. while child class running elevation gain and speed. Thats all about data
// in classes structure be like 
// properties, constructor and then add the methods.

// At this point we have our different logics working like receive geolocation position, click on map, change input and submit form and all are separate chunks.

// Now we will have one class with name app which have all the stuff mention above in the one code block

//it will contain (1): Workout array -> Array holding all running and cycling objects (2): Map 
// (3): constructor -> Load page (4): _getPosition() method
// (5): _loadMap() to receive position (6): _showForm() -> click on map (7): _toggleElevationFields -> when input type is changed (8): _newWorkout() -> submit form and all the data filled in this method will go to the workouts array. 

// Lecture 10: Implementation the Architecture

// class with the name and snippet is mentioned above

