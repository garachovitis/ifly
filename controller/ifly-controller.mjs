//ifly-controller.mjs
import { Flight as MyFlight } from '../model/flight.js'



const model = await import(`../model/better-sqlite/ifly-better.mjs`);
//------------
export async function renderNewFlightForm(request, response) {
   response.render("newflight"); 
 }

//-----------
export async function adminrender(req, res) { 
  try {
    const userId = req.session.userId;
    if (!userId || userId !== 'admin') { 
      res.redirect("/login");
      return;
    }

    const flights = await model.getFlights(); // Fetch all flights (no user filtering)

    res.render('admin', { flights, _admin: true });
  } catch (err) {
    console.error(err);
    res.status(500).send("An error occurred while fetching flights."); 
  }
}



export async function indexrender(request, response) {
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
    const index = await model.getIndex(userId)
    response.render('index', { index: index, model: process.env.MY_MODEL,  _index: true });
 }
 catch (err) {
    response.send(err);
 }
}

//-------------------------ADD FLIGHT--------------------------
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
          response.redirect("/admin"); // User is already connected
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
      response.redirect("/signup");
   }
   //admin check--------
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

    const { from, to, departure_date, return_date} = request.query;
    const _from = from.toUpperCase();
    const _to = to.toUpperCase();

    const go_flights = await model.search(_from, _to, departure_date,);
    const return_flights = await model.search(_to, _from, return_date);

    response.render(
      'search',
      {
        go_flights,
        go_flights_not_found : go_flights.length === 0,
        return_flights,
        return_flights_not_found : return_flights.length === 0 && return_date !== undefined && return_date !== '',
      }
    )
  }
  catch (err) {
   console.error("Error fetching flights: search contr", err);
    response.status(500).send("Error fetching flights: search-control -500 " + err.message);
 
    return;
  }
}

// ifly-controller.mjs
export async function renderBookingPage(req, res) { // Add 'res' parameter here
  try {
    const userId = req.session.userId;
    if (!userId) {
      res.redirect("/login");
      return;
    }

    const flightIds = req.query.flightIds?.split(',').map(Number) || [];

    const flights = await model.getFlightsForBooking(flightIds);

    // Calculate total price
    const total_price = flights.reduce((sum, flight) => sum + flight.price, 0);

    res.render('booking', { 
      flights, 
      userId, 
      _booking: true, 
      total_price,
    });
  } catch (err) {
    console.error(err);
    res.status(500).send("An error occurred while processing your booking."); 
  }
}


export async function completeBooking(request, response) {
  try {
    const { userId, flightIds } = request.body;
    // Loop through flightIds and book tickets
    for (const flightId of flightIds) {
      await model.bookTicket(flightId, userId); 
    }

    response.status(200).send("Booking completed successfully");
  } catch (error) {
    console.error("Error completing booking:", error);
    response.status(500).send("Error completing booking");
  }
}
// ifly-controller.mjs

export async function getFlightsForBooking(request, response) {
  try {
    const { flightIds } = request.body;
    const flights = await model.getFlightsForBooking(flightIds); 
    response.json(flights);
  } catch (err) {
    console.error(err);
    response.status(500).json({ error: 'Failed to fetch flight data' });
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
        const wasDeleted = model.removeFlight(flightID, userId); // Pass userId, even though it's not used in the model

        if (wasDeleted) {
          const flights = await model.getFlights(); // Re-fetch all flights
          res.render('admin', { flights, _admin: true }); // Re-render the admin page with updated data
        } else {
          res.status(404).send("Flight not found"); // Handle flight not found
        }
  } catch (err) {
      console.error(err);
      res.status(500).send("An error occurred while deleting the flight");
  }
}