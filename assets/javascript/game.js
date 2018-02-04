// Initialize Firebase
  var config = {
    apiKey: "AIzaSyBk7Xko-DhQZ2B9FQFDhTTEdYiEk7Z3tJo",
    authDomain: "anytime-train-6a7ae.firebaseapp.com",
    databaseURL: "https://anytime-train-6a7ae.firebaseio.com",
    projectId: "anytime-train-6a7ae",
    storageBucket: "anytime-train-6a7ae.appspot.com",
    messagingSenderId: "399978544646"
  };
  firebase.initializeApp(config);

  var database= firebase.database();

  //global variables
  var name="";
  var destination="";
  var firstTime="00:00";
  var frequency=0;



/////////////////////////////////////////////////
//fx to test next time of arrival

function nextTrain(myFreq, myTime)
{
    //creating an instance of the moment object, firstTimeConverted and passes
    // myTIme, and the format. The firstTimeConverted object is then pushed back one year 
    //by calling the subtract function and passes 1 year.
    // First Time (pushed back 1 year to make sure it comes before current time)
    var firstTimeConverted = moment(myTime, "hh:mm A").subtract(1, "years");
    //console.log(firstTimeConverted);


    // creating variable currentTime via call from moment function
    var currentTime = moment();
    //console.log("CURRENT TIME: " + moment(currentTime).format("hh:mm"));

    // First calculates the difference  between the current time and the firstTIme (in mins)
    var diffTime = moment().diff(moment(firstTimeConverted), "minutes");
   // console.log("DIFFERENCE IN TIME: " + diffTime);

    //to determine the leftover time: diffTime mod myFreq

    // modular divide the time difference by the frequency
    //to determine the leftover time based on the frequency
    var leftoverTime = diffTime % myFreq;
    //console.log(leftoverTime);

    //to determine time left until next train 
    //will based on the difference between the frequency and the leftover time
    var minNextTrain = myFreq - leftoverTime;
    //console.log("MINUTES TILL TRAIN: " + minNextTrain);

    //Next train will arrive based on the current time and the minNextTrain
    var nextTrain = moment().add(minNextTrain, "minutes");
    //console.log("ARRIVAL TIME: " + moment(nextTrain).format("hh:mm"));

    console.log("nextTrain returns: "+minNextTrain);

    return minNextTrain;
}

    

  //when user clicks on submit
  $("#submit").on("click", function()
  {
  	// Prevent default behavior
  	event.preventDefault();

	name= $("#name").val().trim();
	destination=$("#destination").val().trim();
	firstTime =$("#firstTime").val().trim();
	frequency = parseInt($("#frequency").val().trim());

	console.log(moment("24:00", "hh:mm A"));
	if(frequency>0 && firstTime.isvalid())
	{

	// creating a "temporary" myTrain object for storing train data
	var myTrain = 
	{
	    name: name,
	    destination: destination,
	    start: firstTime,
	    frequency: frequency
	  };
	  //adds the object myTrain into the firebase database 
  	database.ref().push(myTrain);

  	// Logs everything to console
	//console.log(myTrain.name);
	//console.log(myTrain.destination);
	//console.log(myTrain.start);
	//console.log(myTrain.frequency);

  // Alert
  alert("myTrain successfully added");
	}
	else
	{
		// creating a "temporary" myTrain object for storing train data
	alert("please try again, you did not enter the field correctly!");
	}
	


  	// Clears all of the text-boxes
  	$("#name").val("");
  	$("#destination").val("");
 	 $("#firstTime").val("");
 	 $("#frequency").val("");

  	//calculates when the next train will arrive
  	
  });

  //Firebase event for adding myTrain to the database 
  //and autopopulates a table of html when a user adds an entry
database.ref().on("child_added", function(snapshot, prevChildKey) 
{

  //console.log(snapshot.val());

  // Store everything into a variable.
  var name = snapshot.val().name;
  var destination = snapshot.val().destination;
  var firstTime = snapshot.val().start;
  var frequency = snapshot.val().frequency;
  //calling nextTrain function to return the time left
  var timeLeft = nextTrain(frequency, firstTime);
  //adding the time left with the current time to get the next arrival
  var nextArrival = moment().add(timeLeft, "minutes")

  // Testing display 
  console.log(name);
  console.log(destination);
  console.log(firstTime);
  console.log(frequency);
  console.log("Time Left: "+ timeLeft);
  //formating the next time
  console.log("Next Arrival time: "+moment(nextArrival).format("hh:mm A"));

  

  // Add each train's data into the table
  $(".table > tbody").append("<tr><td>" + name + "</td><td>" + destination + "</td><td>" +
  frequency + "</td><td>" + moment(nextArrival).format("hh:mm A") + "</td><td>" + timeLeft + "</td></tr>");

 // If any errors are experienced, log them to console.
}, function(errorObject) {
  console.log("The read failed: " + errorObject.code);
});
  