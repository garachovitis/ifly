import { Flight as MyFlight } from '../model/flight.js'


const model = await import(`../model/ifly-better.mjs`);


export async function renderNewFlightForm(request, response) {
   response.render("newflight",{renderNewFlightForm:renderNewFlightForm,model: process.env.MY_MODEL, _newflight: true}); 
 }

export async function adminrender(req, res) { 
  try {
    const userId = req.session.userId;
    if (!userId || userId !== 'admin') { 
      res.redirect("/login");
      return;
    }

    const flights = await model.getFlights(); 

    res.render('admin', { flights, _admin: true });
  } catch (err) {
    console.error(err);
    res.status(500).send("An error occurred while fetching flights."); 
  }
}


export async function indexrender(request, response) {
  try {
    const userId = request.session.userId;
    if (userId === undefined || userId === null) {
      response.redirect("/login");
      return;      
    }

    const index = await model.getIndex(userId);

    response.render('index', { 
      index: index, 
      model: process.env.MY_MODEL,  
      _index: true
    });
  } catch (err) {
    console.log(err);
    response.send(err);
  }
}



export async function addFlight(request, response) {


  
   try {
     const flightData = request.body;
 
     if (
       !flightData.airline ||
       !flightData.arrival ||
       !flightData.destination ||
       !flightData.date ||
       !flightData.AvSeats || 
       !flightData.price
     ) {
       throw new Error("Missing or invalid flight data.");
     }
 
     const AvSeats = parseInt(flightData.AvSeats, 10);
 
     if (isNaN(AvSeats) || AvSeats < 1) {
       throw new Error("Invalid number of available seats.");
     }
 
     const newFlight = new MyFlight(
       undefined, 
       flightData.airline.toUpperCase(),
       flightData.arrival.toUpperCase(), 
       flightData.destination.toUpperCase(),
       flightData.date,
       AvSeats, 
       parseFloat(flightData.price) 
     );
 
     await model.addFlight(newFlight);
     response.status(201).send("Flight added successfully");
   } catch (error) {
     console.error("Error adding flight:", error); 
     response.status(500).send("Error adding flight: " + error.message); 
   }
 }



export async function renderLogin(request, response) {
   try {
      const userId = request.session.userId;
      if (userId === undefined || userId === null) {
          response.render("login", {_login: true , hideNav: true});
      }
      else {
          response.redirect("/admin"); 
      }
  }
  catch (err) {
      console.log(err);
      response.render("login", {_login: true});
  }
}

export async function login(request, response) {
   const username = String(request.body.username);
   const password = String(request.body.password);
   const userFound = await model.findUser(username, password);

   if (userFound === undefined) {
      response.render("login", {_login: true, _wrong_password: true});
   }
   else if (userFound === false) {
    response.render("login", {_login: true, _wrong_password: true});
  }
   else {
      request.session.userId = username;
  
      if (username === "admin") {
        response.redirect("/admin"); 
      } else {
        response.redirect("/index"); 
      }
    }
  }

export async function signup(request, response) {
   try {
      request.session.destroy();
      const username = String(request.body.username);
      const password = String(request.body.password);
      const userId = await model.addUser(username, password);
      if (userId === false) {
          response.redirect("/login");
      }
      else {
          response.redirect("/index");
      }
  }
  catch (err) {
      response.render("signup", {_signup: true});
  }
}




export async function search(request, response) {
  try {
    const userId = request.session.userId;
 }
 catch (err) {
    console.log(err);
    response.redirect("/login");
    return;
 }
  try {
      const { from, to, departure_date, return_date } = request.query;

      if (!from || !to || from.trim() === '' || to.trim() === '') {
          response.status(400).send("Error fetching flights: From and To fields are required.");
          return;
      }

      const _from = from.toUpperCase();
      const _to = to.toUpperCase();

      const goFlights = await model.search(_from, _to, departure_date);
      const returnFlights = return_date ? await model.search(_to, _from, return_date) : []; 

      const bookedArrivalFlightID = request.cookies.bookedArrivalFlightID || null;
      const bookedReturnFlightID = request.cookies.bookedReturnFlightID || null;

      response.render('search', {
          goFlights,
          goFlights_not_found: goFlights.length === 0,
          returnFlights,
          returnFlights_not_found: returnFlights.length === 0 && return_date !== undefined && return_date !== '',
          model: process.env.MY_MODEL,
          _search: true,
          booked_arrival_flight_id: bookedArrivalFlightID,
          booked_return_flight_id: bookedReturnFlightID
      });
  } catch (err) {
      console.error("Error fetching flights:", err);
      response.status(500).send("Error fetching flights: " + err.message);
  }
}



export async function removeFlight(req, res) {
  try {
      const userId = req.session.userId;
      
        if (userId === undefined || userId === null) {
          res.redirect("/login");
          return;
        }

        const flightID = req.params.flightID; 
        const wasDeleted = model.removeFlight(flightID, userId); 

        if (wasDeleted) {
          const flights = await model.getFlights(); 
          res.render('admin', { flights, _admin: true }); 
        } else {
          res.status(404).send("Flight not found"); 
        }
  } catch (err) {
      console.error(err);
      res.status(500).send("An error occurred while deleting the flight");
  }
}


export async function myFlights(request, response) {
  try {
    const userId = request.session.userId; 

    if (!userId) {
      response.redirect("/login");
      return;
    }

    const flights = await model.getMyFlights(userId); 
    response.render("myflights", { flights, _myflights: true }); 
  } catch (err) {
    console.error("Error fetching my flights:", err);
    response.status(500).send("An error occurred while fetching your flights.");
  }
}

export async function booking(request, response) {
  try {
    const userId = request.session.userId;
 }
 catch (err) {
    console.log(err);
    response.redirect("/login");
    return;
 }
 const userId = request.session.userId;
 if (userId === undefined || userId === null) {
    response.redirect("/login");
    return;      
 }

  try {
      const bookedArrivalFlightID = request.cookies.bookedArrivalFlightID;
      const bookedReturnFlightID = request.cookies.bookedReturnFlightID;

      if (!bookedArrivalFlightID && !bookedReturnFlightID) {
          response.status(400).send("At least one flight must be booked.");
          return;
      }

      const arrivalFlight = await model.getFlightByID(bookedArrivalFlightID);
      const returnFlight = await model.getFlightByID(bookedReturnFlightID);

      response.render('booking', {
          arrivalFlight,
          returnFlight,
          model: process.env.MY_MODEL,
          _booking: true
      });
  } catch (err) {
      console.error("Error fetching booking summary:", err);
      response.status(500).send("Error fetching booking summary: " + err.message);
  }
}



export async function completeBooking(request, response) {
  try {
    const userId = request.session.userId;

    if (!userId) {
      response.redirect("/login");
      return;
    }

    const { flights } = request.body;

    console.log("flights:", flights);
    console.log("userId:", userId);

    if (!flights || flights.length === 0) {
      response.status(400).json({ success: false, message: "At least one flight must be booked, and user must be logged in." });
      return;
    }

    try {
      flights.forEach(async (flight) => {
        await model.bookFlight(userId, flight.flightID);
      });

      console.log("Booking Completed. Have a nice trip✈️");
      response.status(201).json({ success: true, message: "Booking Completed. Have a nice trip✈️" });
    } catch (err) {
      console.error("Error completing booking:", err);
      response.status(500).json({ success: false, message: "Error completing booking: " + err.message });
    }
  } catch (err) {
    console.log(err);
    response.redirect("/login");
    return;
  }
}

export async function supportrender(request, response) {
  response.render("support",{_support:true}); 
}


