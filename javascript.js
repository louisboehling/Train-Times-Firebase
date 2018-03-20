// Initialize Firebase
var config = {
    apiKey: "AIzaSyBXAZqXWJhF18HKt2Fo32AB9zYVdn9TwFw",
    authDomain: "train-times-firebase.firebaseapp.com",
    databaseURL: "https://train-times-firebase.firebaseio.com",
    projectId: "train-times-firebase",
    storageBucket: "train-times-firebase.appspot.com",
    messagingSenderId: "1084460973222"
  };
  firebase.initializeApp(config);

// Database variable 
var database = firebase.database();

// Other variables 
var train = "";
var destination = "";
var frequency = "";
var arrivalTime = "";
var minutesAway = "";

// Doc ready function 
$(document).ready(function () {

// Submit a new train button 
$("#submit-button").on("click", function(event) {
   event.preventDefault();

   // Get values from the form 
   train = $("#train-input").val().trim();
   destination = $("#destination-input").val().trim();
   arrivalTime = $("#time-input").val().trim();
   frequency = $("#frequency-input").val().trim();

   // Push to Firebase
   database.ref().push({
    train: train,
    destination: destination,
    arrivalTime: arrivalTime,
    frequency: frequency,
    dateAdded: firebase.database.ServerValue.TIMESTAMP
})
   
// End New train button ---------------------
});


// Firebase watcher + initial loader + order/limit 
database.ref().orderByChild("dateAdded").on("child_added", function(snapshot) {
    
    // storing the snapshot.val() in a variable for convenience
    var sv = snapshot.val();
    
    // Console.loging the last user's data
    console.log(sv.train);
    console.log(sv.destination);
    console.log(sv.arrivalTime);
    console.log(sv.frequency);

// Moment.js (has to be in the database function)

var tFrequency = sv.frequency;
var firstTime = sv.arrivalTime;

// First Time (pushed back 1 year to make sure it comes before current time)
var firstTimeConverted = moment(firstTime, "HH:mm").subtract(1, "years");
console.log(firstTimeConverted);

// Current Time
var currentTime = moment();
console.log("CURRENT TIME: " + moment(currentTime).format("hh:mm"));

// Difference between the times
var diffTime = moment().diff(moment(firstTimeConverted), "minutes");
console.log("DIFFERENCE IN TIME: " + diffTime);

// Time apart (remainder)
var tRemainder = diffTime % tFrequency;
console.log(tRemainder);

// Minute Until Train
var tMinutesTillTrain = tFrequency - tRemainder;
console.log("MINUTES TILL TRAIN: " + tMinutesTillTrain);

// Next Train
var nextTrain = moment().add(tMinutesTillTrain, "minutes");
console.log("ARRIVAL TIME: " + moment(nextTrain).format("hh:mm A"));

var nextTrainArrival = (moment(nextTrain).format("hh:mm A"));


// Makes a new row in the table 

var tableRow =
`
<tr>
    <th scope="row">${sv.train}</th>
    <td>${sv.destination}</td>
    <td>${sv.frequency}</td>
    <td>${nextTrainArrival}</td>
    <td>${tMinutesTillTrain}</td>
</tr>
`
$('tbody').append(tableRow);

}); // End of databse function 

}); // End Doc ready function 