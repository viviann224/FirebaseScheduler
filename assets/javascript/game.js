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


//fx to calculate the next time of arrival
//passes in the frequency and the inital time
//returns the time for the next train arrival (in minutes)
function nextTrain(myFreq, myTime)
{
    //creating an instance of the moment object, firstTimeConverted and passes
    // myTime, and the format. The firstTimeConverted object is then pushed back one year 
    //by calling the subtract function and passes 1 year.
    // First Time (pushed back 1 year to make sure it comes before current time)
    var firstTimeConverted = moment(myTime, "hh:mm A").subtract(1, "years");

    // creating variable currentTime via call from moment function
    var currentTime = moment();

    // First calculates the difference  between the current time and the firstTIme (in mins)
    var diffTime = moment().diff(moment(firstTimeConverted), "minutes");

    //to determine the leftover time: diffTime mod myFreq
    // modular divide the time difference by the frequency
    //to determine the leftover time based on the frequency
    var leftoverTime = diffTime % myFreq;

    //to determine time left until next train 
    //will based on the difference between the frequency and the leftover time
    var minNextTrain = myFreq - leftoverTime;

    return minNextTrain;
}

//when user clicks on submit
$("#submit").on("click", function()
{
  	// Prevent default behavior
  	event.preventDefault();
  	//set the values based on user input
	name= $("#name").val().trim();
	destination=$("#destination").val().trim();
	firstTime =$("#firstTime").val().trim();
	frequency = parseInt($("#frequency").val().trim());

	//max variable for miliary time
	var max=parseInt(moment("24:00", "hh:mm").format("hh:mm"));
	//min variable for military time
	var min =0;
	//converted firstTime variable to test
	var myvar =parseInt(moment(firstTime, "hh:mm").format("hh:mm"))
	//user input validation
	//there must be a valid time frequency greater than 0 mins
	//firstTime must be a valid military time
	if(frequency>0 && myvar<=max && myvar>=min)
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
	}
	else
	{
		// else tell the user that the input is incorrect and let user try again
		alert("Please try again, you did not enter the field correctly!");
	}

  	// Clears all of the text-boxes
  	$("#name").val("");
  	$("#destination").val("");
 	 $("#firstTime").val("");
 	 $("#frequency").val("");
});

//Firebase event for adding myTrain to the database 
//and autopopulates a table of html when a user adds an entry
database.ref().on("child_added", function(snapshot, prevChildKey) 
{
  // Store everything into a variable.
  var name = snapshot.val().name;
  var destination = snapshot.val().destination;
  var firstTime = snapshot.val().start;
  var frequency = snapshot.val().frequency;
  //calling nextTrain function to return the time left
  var timeLeft = nextTrain(frequency, firstTime);
  //Next train will arrive based on the current time and the nextArrival
  var nextArrival = moment().add(timeLeft, "minutes")

  // Add each train's data into the table
  $(".table > tbody").append("<tr><td>" + name + "</td><td>" + destination + "</td><td>" +
  frequency + "</td><td>" + moment(nextArrival).format("hh:mm A") + "</td><td>" + timeLeft + "</td></tr>");

 // If any errors are experienced, log them to console.
}, function(errorObject) {
  console.log("The read failed: " + errorObject.code);
});
  