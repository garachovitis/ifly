import { Flight as MyFlight } from '../model/flight.js'



const model = await import(`../model/better-sqlite/ifly-better.mjs`);
//------------
export async function renderNewFlightForm(request, response) {
   response.render("newflight"); 
 }

//-----------

export async function adminrender(request, response) {
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
      const admin = await model.getAdmin(userId)
      response.render('admin', { admin: admin, model: process.env.MY_MODEL,  _admin: true });
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



export async function getAllFlights(request, response) {
   try {
     const flights = await model.getAllFlights();
     response.json(flights); 
   } catch (error) {
     console.error("Error fetching flights: get all", error);
     response.status(500).send("Error fetching flights: get all2 " + error.message);
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


