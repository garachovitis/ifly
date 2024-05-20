//ifly-better.mjs the model
'use strict';

 import db from 'better-sqlite3';
import bcrypt from 'bcrypt';
const sql = new db('model/db/ifly.sqlite', { fileMustExist: true });

export let getAdmin = (userId) => {
     const stmt = sql.prepare("SELECT * FROM ticket WHERE user_id = ?");
     let admin;
     try {
         admin = stmt.all(userId);
         return admin;
     } catch (err) {
         throw err;
     }
 }



 export let getIndex = (userId) => {
    const stmt = sql.prepare("SELECT * FROM ticket WHERE user_id = ?");
    let index;
    try {
        index = stmt.all(userId);
        return index;
    } catch (err) {
        throw err;
    }
}




export let findUser = async (username, password) => {
    const stmt = sql.prepare('SELECT id, password FROM user WHERE username = ?');
    try {
        const user = stmt.get(username);
        if (!user) {
            return false; 
        }
        
        const hashedPassword = user.password;
        const passwordMatch = await bcrypt.compare(password, hashedPassword);
        return passwordMatch ? user.id : undefined;
    }
    catch (err) {
        throw err;
    }
}

export let addUser = async (username, password) => {
    const stmt = sql.prepare('SELECT id FROM user WHERE username = ?');
    const insertStmt = sql.prepare('INSERT INTO user (username, password) VALUES (?, ?)');
    
    try {
        const existingUser = stmt.all(username);
        if (existingUser.length > 0) {
            return false; 
        }
        
        const hashedPassword = await bcrypt.hash(password, 10);
        const result = insertStmt.run(username, hashedPassword);
        const userId = result.lastID;

        return userId;
    } catch (err) {
        console.log(err);
        throw err;
    }
}



export let addFlight = (flightData) => {

    try {
        const stmt = sql.prepare(`
            INSERT INTO flight (
                airline,
                arrival, 
                destination, 
                date, 
                AvSeats, 
                price
            ) VALUES (?, ?, ?, ?, ?, ?)
    `);
    

        const result = stmt.run(
            flightData.airline,
            flightData.arrival,
            flightData.destination,
            flightData.date,
            flightData.AvSeats, 
            flightData.price
        );
        console.log(`Flight added with ID: ${result.lastInsertRowid}`);

        return true;
    }
    catch (err) {
        if (err.code === 'SQLITE_CONSTRAINT') {
            if (err.message.includes('UNIQUE constraint failed')) {
                throw new Error('This flight already exists.');
            } else if (err.message.includes('NOT NULL constraint failed')) {
                throw new Error('Missing required data for the flight.');
            } else if (err.message.includes('CHECK constraint failed')) {
                throw new Error('The date must be from tomorrow onward.');
            }
        } 
        throw err; 
    }
}; 




export const search = (arrival, destination, date) => {
    try {
        const stmt = sql.prepare(`
            SELECT arrival, destination, price, date, airline FROM flight
            WHERE arrival = ? AND destination = ? AND date = ?
        `);

        const result = stmt.all(arrival, destination, date);

        return result;
    }   
    catch(err) {
        throw new Error(err);
    }
}
export const getFlightsForBooking = (flightIds) => {
    if (!Array.isArray(flightIds) || flightIds.length === 0) {
        return []; 
    }

    const placeholders = flightIds.map(() => '?').join(','); 
    try {
        const stmt = sql.prepare(`
            SELECT * FROM flight WHERE flightID IN (${placeholders})
        `);
        const result = stmt.all(flightIds); // Use the flightIds array directly
        return result;
    }   
    catch(err) {
        throw new Error("Error fetching flights for booking: " + err);
    }
}

export let bookTicket = (flightId, userId) => {
    try {
        const stmt = sql.prepare(`
            INSERT INTO ticket (flight_id, user_id) VALUES (?, ?)
        `);

        const result = stmt.run(flightId, userId);
        console.log(`Ticket booked with ID: ${result.lastInsertRowid}`);

        return true;
    }
    catch(err) {
        throw new Error(err); 
    }
}


export async function getFlights() { 
    try {
        const stmt = sql.prepare(`
            SELECT * FROM flight 
        `);

        const result = stmt.all(); 
        return result;
    } catch (err) {
        throw new Error("Error fetching flights: " + err);
    }
}
export let removeFlight = (flightID) => {
    const stmt = sql.prepare('DELETE FROM flight WHERE flightID = ?'); // Remove user_id check
    let info;

    try {
        info = stmt.run(flightID);
        return info.changes > 0; // Return true if at least one row was affected
    } catch (err) {
        console.error('Error deleting flight:', err);
        throw err; 
    }
};


export let getMyFlights = (userId) => {
    const stmt = sql.prepare(`
        SELECT * FROM flight
        JOIN ticket ON flight.flightID = ticket.flight_id
        WHERE ticket.user_id = ?
    `);
    let flights;
    try {
        flights = stmt.all(userId);
        return flights;
    } catch (err) {
        throw err;
    }
}