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

if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(function(position){
        const { latitude } = position.coords
        const { longitude } = position.coords
        console.log(longitude, latitude )
    }, function(){
        alert('could not get your position')
    })
}

// geolocation is a browser API, which is very easy to get
// This API gives the current location 
// this API is get by using navigator.geolocation
// and with it is the getCurrentPosition function which calls one of the two call back function. First one is on success and the second one if the API fails to return the result.
 
