'use strict';

const form = document.querySelector('.form');
const containerWorkouts = document.querySelector('.workouts');
const inputType = document.querySelector('.form__input--type');
const inputDistance = document.querySelector('.form__input--distance');
const inputDuration = document.querySelector('.form__input--duration');
const inputCadence = document.querySelector('.form__input--cadence');
const inputElevation = document.querySelector('.form__input--elevation');

class workout {
    date = new Date();
    id = (Date.now() + '').slice(-10)
    clicks = 0

    constructor(coords, distance, duration) {
        this.coords = coords;
        this.distance = distance;
        this.duration =duration ;
    }

    _setDescription() {
        // prettier-ignore
        const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
        this.description = `${this.type[0].toUpperCase()}${this.type.slice(1)} on ${months[this.date.getMonth()]} ${this.date.getDate()}`
        // type is defined in the child class and not here. No problem, we have called this method in the child and in child class it  will get type. 
    }

    click() {
        this.clicks++;
    }
}

class running extends workout {
    type = 'running';
    constructor(coords, distance, duration, cadence) {
        super(coords, distance, duration);
        this.cadence = cadence;
        this.calcPace();
        this._setDescription()
    }

    calcPace(){
        //min/km
        this.pace = this.duration / this.distance
        return this.pace
    }
}
class cycling extends workout {
    type = 'cycling'
    constructor(coords, distance, duration, elevationGain) {
        super(coords, distance, duration);
        this.elevationGain = elevationGain;
        this.calcSpeed();
        this._setDescription()
        // Through scope chain the child class will have access of all methods defined in the parent class
    }

    calcSpeed(){
        // km/h
        this.speed = this.distance / (this.duration / 60)
        return this.speed;
    }
}

// const run1 = new running([39,-12],5.2,24,78);
// const cycling1 = new cycling([39,-12],27,95,523)
// console.log(run1,cycling1)

class App {
    #map;
    #mapEvent;
    #mapZoomLevel = 13;
    #workouts = []
    constructor(){
        // get user position
        this._getPosition();

        // get data from local storage
        this._getLocalStorage();

        // Attach event listener
        // This will give the map as soon as the page is loaded
        form.addEventListener('submit',this._newNetwork.bind(this))
        // Due to eventListener the this keyword  was pointing to the form and not the form so to resolve this issue we need to bind the this keyword
        inputType.addEventListener('change', this._toggleElevationField)
        containerWorkouts.addEventListener('click', this._moveToPopup.bind(this))
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
        this.#map = L.map('map').setView([51.5, -0.09], this.#mapZoomLevel); 
        console.log(map)
        L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(this.#map);
        this.#map.on('click', this._showForm.bind(this))

        this.#workouts.forEach(work => {
            this.renderWorkoutMarker(work)
        })   
        
        // So here the load map is inside the getPosition and getPosition is inside the constructor 
        // As this load map is rendering the marker
        // And on page load all the workouts does persist so all the time marker remains appear. 
    }

    _showForm(mapE){
        this.#mapEvent = mapE
        form.classList.remove('hidden')
        inputDistance.focus()
    }

    _hideForm(){
        // empty the input
        inputDistance.value = inputDuration.value = inputCadence.value = inputElevation.value = ''
        form.style.display = 'none'
        form.classList.add('hidden') 
        setTimeout(()=>(form.style.display='grid'),1000)
        // the second property was enough to hide the form. But we added property 1 and property 3 by which our whole desire is completed.
        // Because we want that when enter is clicked it should appear like form is replaced by the current entry and before these two properties form was removed with animation as at start it comes with animation and when the style is removed instantly then form has gone instantly and no animation comes up at removal. And after one second we have give its style back by setTimeout that next time form will open with its animation. 
    }

    _toggleElevationField(){
        inputElevation.closest('.form__row').classList.toggle('form__row--hidden');
        inputCadence.closest('.form__row').classList.toggle('form__row--hidden')
    }

    _newNetwork(e){ 
        e.preventDefault()
        const validInputs = (...inputs) => inputs.every(inp => Number.isFinite(inp) )
        const allPositive = (...inputs) => inputs.every(inp => inp > 0 )
            // Get data from form & Check if data is valid 
            const type = inputType.value;
            const distance = +inputDistance.value;
            const duration = +inputDuration.value
            const {lat,lng} = this.#mapEvent.latlng;
            let workout;
            // + sign over here gives us that if the value is array then it will automatically be change into the number

            if(type==='running') {
                const cadence = +inputCadence.value
                // check if the data is valid
                if (
                    // !Number.isFinite(distance) ||
                    // !Number.isFinite(duration) ||
                    // !Number.isFinite(cadence)
                    // This validation can come from the code
                    !validInputs(distance,duration,cadence) || !allPositive(distance,duration,cadence)
                ) { return alert('Input has to be +ve number') }
                // if workout is running, create running object
                workout = new running([lat,lng], distance, duration, cadence)
                
            }

            if(type==='cycling') {
                const elevation = +inputElevation.value
                if(!validInputs(distance,duration,elevation) || !allPositive(distance,duration)) {
                    return alert('Input has to be +ve number')
                }
                // if workout is cycling, create cycling object
                // this object is created from ES6 class cycling inside the ES6 class app.
                workout = new cycling([lat,lng], distance, duration, elevation)
            }
            // in this way two or more classes can interact together to give other objects



            // Add new object to workout array
            this.#workouts.push(workout)
            console.log(this.#workouts);

            // Render workout on map as marker
            this.renderWorkoutMarker(workout)
            // No need to bind with this keyword in this case because we are call the mentioned method with this keyword
                
            // Render workout in list

            this._renderWorkout(workout);

            // hide + clear the input fields
            this._hideForm() 

            // set locale storage to all workouts

            this._setLocalStorage();
    }

    renderWorkoutMarker(workout){
        // const {lat,lng} = this.#mapEvent.latlng; these are mentioned above
        L.marker(workout.coords).addTo(this.#map)
                .bindPopup(L.popup({
                    maxWidth: 250,
                    minWidth: 100,
                    autoClose: false,
                    closeOnClick: false,
                    className: `${workout.type}-popup`,
                }
                ))
                .setPopupContent(`${workout.type === 'running' ? '🏃‍♂️' : '🚴‍♀️'}  ${workout.description}`)
                .openPopup();
    }

    _renderWorkout(workout) {
        let abc = `
        <li class="workout workout--${workout.type}" data-id="${workout.id}">
            <h2 class="workout__title">${workout.description}</h2>
            <div class="workout__details">
                <span class="workout__icon">${workout.type === 'running' ? '🏃‍♂️' : '🚴‍♀️'}</span>
                <span class="workout__value">${workout.distance}</span>
                <span class="workout__unit">km</span>
            </div>
            <div class="workout__details">
                <span class="workout__icon">⏱</span>
                <span class="workout__value">${workout.duration}</span>
                <span class="workout__unit">min</span>
            </div>  
        `;

        if (workout.type === 'running') {
            abc += `
                <div class="workout__details">
                    <span class="workout__icon">⚡️</span>
                    <span class="workout__value">${workout.pace.toFixed(1)}</span>
                    <span class="workout__unit">min/km</span>
                </div>
                <div class="workout__details">
                    <span class="workout__icon">🦶🏼</span>
                    <span class="workout__value">${workout.cadence}</span>
                    <span class="workout__unit">spm</span>
                </div>
            </li>`;
        }

        if (workout.type === 'cycling') {
            abc += `
                <div class="workout__details">
                    <span class="workout__icon">⚡️</span>
                    <span class="workout__value">${workout.speed.toFixed(1)}</span>
                    <span class="workout__unit">km/h</span>
                </div>
                <div class="workout__details">
                    <span class="workout__icon">⛰</span>
                    <span class="workout__value">${workout.elevationGain}</span>
                    <span class="workout__unit">m</span>
                </div>
            </li>`;
        }

        form.insertAdjacentHTML('afterend', abc);

        // by this we have added the HTML element as the sibling of form right after the from
    }

    _moveToPopup(e){
        const workoutEl = e.target.closest('.workout');
        console.log(workoutEl)
        // I have multiple workout cards whenever i click inside of any card, the element which is clicked can be span, text or any emoji of that card, this thing will reference to this card as well.
        // the thing which we want to have is that whenever i click on any of the card, then in the map i scroll to its respective popup.
        // So by the closest method i get the specific card and for each card data-id is the unique thing. So by this id we will move to the related popup.
        // whenever we click inside the container but not of any card, then it returns the null 
        
        if (!workoutEl) return; // Guard clause

        // Now, getting the data outside the workout array

        const workout = this.#workouts.find(
            work => work.id === workoutEl.dataset.id
        )
        // This find method will give the element of the workout array whose id matches with the id of the workoutElement.
        console.log(workout)
        // in console both workoutEl and workout are pointing to the same element.
        // now take the co-ordinates of this element we can move to its pop-up
        // in leaflet, one of the method does exist, which is setView method. In this setView method first argument is the co-ordinates and second argument is zoom-level
        this.#map.setView(workout.coords,this.#mapZoomLevel, {
            animate: true,
            pan: {
                duration: 1,
            }
        })

        // using the public interface
        // workout.click();
    }

    _setLocalStorage() {
        // Local storage is the browser API.
        localStorage.setItem('workouts', JSON.stringify(this.#workouts))
        // setItem method takes two string param, first is the name and second is the data string which is needed to store in the local storage.
        // So, we convert the object to the string by JSON.stringify methods 
        // In local storage it is shown that the object is stored in form of string.
        // Js somehow returns the string back to the object
        // when more workouts are added the string is larger containing multiple objects
        // Now all the time we have local storage the workout entries even the page loaded
        // but the workout in the UI has gone. the thing we need to show the workout list all the time even the page is loaded
        //when the application is loaded, the code in the constructor is run so requirement is achieved by writing the code in constructor.

    }

    _getLocalStorage() {
        const data = JSON.parse(localStorage.getItem('workouts'))
        // JSON.parse is the opposite of JSON.stringify which takes the string and return the object 
        // The getItem method takes the param key which is set before and return the complete data
        if(!data) return; // Guard clause

        // Restore the complete workouts data
        this.#workouts = data

        // Render the workout list by forEach method

        this.#workouts.forEach(work => {
            this._renderWorkout(work)
            // the advantage of writing the renderWorkout outside is that it has been used in two methods separately
            // All is the case while using any method this way. It will reduce the effort while using one method multiple times
            // So all the time even the page is loaded, the workout cards remain persist in the screen.
            // the error is given the reason is that we use to load the marker at the very beginning but at start of the page load, it takes the position, then it show the map and then it shows the marker, so this is the first glimpse of asynchronous js and this thing will not work in this  way  
            // this.renderWorkoutMarker(work)
            // so we will take the marker and render it in the loadMap
        })

        // So all the time even the page is loaded, the workout cards remain persist in the screen.
        
        // One problem that we face that when the objects are converted in the  string and then back to the object then they are not the object coming from cycling  or running class they are just regular objects and they have lost their prototype chain.


    }

    reset() {
        localStorage.removeItem('workouts')
        location.reload()
        // location is the bigger which contains lot more methods
    }
    // i have called this method in the console and with this local storage is cleared 
    // So removeItem is used to clear the localStorage.
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

// Lecture 11: Managing workout data Creating classes
// implement classes to manage the data for cycling and running workout that are coming from the UI.
// There is the concept of parent and child classes as Distance and duration is present in both cycling and running while cadence is present in running while elevation gain is present in cycling. 

// Lecture 12: Creating a new workout


// use the locale storage api in order to make the workout data persist in multiple reload

// The idea is that when a new workout is added the whole workout array is stored in the locale storage.

// And when the page is loaded all the workouts are loaded from locale storage and rendered in the UI.

// 
