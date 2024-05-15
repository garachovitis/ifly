import { Flight as MyFlight } from '../model/flight.js'



const model = await import(`../model/better-sqlite/ifly-better.mjs`);

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
 
     // Convert AvSeats to a number if it's a string
     const AvSeats = parseInt(flightData.AvSeats, 10);
 
     if (isNaN(AvSeats) || AvSeats < 1) {
       throw new Error("Invalid number of available seats.");
     }
 
     // Create the newFlight object using the validated data
     const newFlight = new MyFlight(
       undefined, // Let the database handle auto-incrementing flightID
       flightData.arrival.toUpperCase(), // Standardize to uppercase
       flightData.destination.toUpperCase(),
       flightData.date,
       AvSeats, // Use the converted avSeats
       parseFloat(flightData.price) 
     );
 
     await model.addFlight(newFlight);
     response.status(201).send("Flight added successfully");
   } catch (error) {
     console.error("Error adding flight:", error); // Log the error for debugging
     response.status(500).send("Error adding flight: " + error.message); // Send a user-friendly error message
   }
 }



export async function toggleTask(request, response) {
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
      await model.toggleTask(request.params.toggleTaskId, userId);
      const allTasks = await model.getAllTasks(userId)
      response.render('tasks', { tasks: allTasks, model: process.env.MY_MODEL, _tasks: true });
   } catch (error) {
      response.send(error);
   }
}

export async function removeTask(request, response) {
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
      model.removeTask(request.params.removeTaskId, userId)
      const allTasks = await model.getAllTasks(userId)
      response.render('tasks', { tasks: allTasks, model: process.env.MY_MODEL,  _tasks: true });
   } catch (err) {
      console.log(err)
      response.send(err);
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
   else {
      request.session.userId = username;
      response.redirect("/tasks");
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
 