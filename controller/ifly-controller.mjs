import { Flight as MyFlight } from '../model/flight.js'



const model = await import(`../model/better-sqlite/ifly-better.mjs`);
//------------
export async function renderNewFlightForm(request, response) {
   response.render("newflight"); 
 }

//-----------

export async function listAllTasksRender(request, response) {
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
      const tasks = await model.getAllTasks(userId)
      response.render('tasks', { tasks: tasks, model: process.env.MY_MODEL,  _tasks: true });
   }
   catch (err) {
      response.send(err);
   }
}
//-------------------------ADD FLIGHT--------------------------
export async function addFlight(request, response) {
   try {
     const flightData = request.body;
 
     // Data Validation and Sanitization (Important!)
     if (
       !flightData.arrival ||
       !flightData.destination ||
       !flightData.date ||
       !flightData.AvSeats || // Check for AvSeats directly from request body
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
          response.redirect("/tasks"); // User is already connected
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
        response.redirect("/tasks"); 
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
          response.redirect("/tasks");
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
     console.error("Error fetching flights:", error);
     response.status(500).send("Error fetching flights: " + error.message);
   }
 }
 
 export async function getFlightsPaginated(offset, limit) {
   const stmt = sql.prepare(`SELECT * FROM flight LIMIT ? OFFSET ?`);
   try {
       const flights = stmt.all(limit, offset);
       return flights;
   } catch (err) {
       throw err;
   }
}

export async function getTotalFlights() {
   const stmt = sql.prepare(`SELECT COUNT(*) as total FROM flight`);
   try {
       const result = stmt.get();
       return result.total;
   } catch (err) {
       throw err;
   }
}

//-----------------GET FILTERED FLIGHTS-------------------
export async function getFilteredFlightsPaginated(offset, limit, filters) {
  let query = 'SELECT * FROM flight WHERE 1 = 1';
   let params = [];

   if (filters.from) {
       query += ' AND arrival = ?';
       params.push(filters.from);
   }

   if (filters.to) {
       query += ' AND destination = ?';
       params.push(filters.to);
   }

   if (filters.departure_date) {
       query += ' AND date = ?';
       params.push(filters.departure_date);
   }

   query += ' LIMIT ? OFFSET ?';
   params.push(limit, offset);

   const stmt = sql.prepare(query);
   try {
       const flights = stmt.all(params);
       return flights;
   } catch (err) {
       throw err;
   }
}

export async function getTotalFilteredFlights(filters) {
  let query = 'SELECT COUNT(*) as total FROM flight WHERE 1 = 1';
   let params = [];

   if (filters.from) {
       query += ' AND arrival = ?';
       params.push(filters.from);
   }

   if (filters.to) {
       query += ' AND destination = ?';
       params.push(filters.to);
   }

   if (filters.departure_date) {
       query += ' AND date = ?';
       params.push(filters.departure_date);
   }

   const stmt = sql.prepare(query);
   try {
       const result = stmt.get(params);
       return result.total;
   } catch (err) {
       throw err;
   }
}