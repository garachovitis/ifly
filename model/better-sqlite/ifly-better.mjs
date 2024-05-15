'use strict';

import db from 'better-sqlite3';
import bcrypt from 'bcrypt';
const sql = new db('model/db/tasks.sqlite', { fileMustExist: true });

export let getAllTasks = (userId) => {
    const stmt = sql.prepare("SELECT * FROM task WHERE user_id = ?");
    let tasks;
    try {
        tasks = stmt.all(userId);
        return tasks;
    } catch (err) {
        throw err;
    }
}

export let addTask = (newTask, userId) => {
    const stmt = sql.prepare('INSERT INTO task VALUES (null, ?, ?, CURRENT_TIMESTAMP, ?)');
    let info;

    try {
        info = stmt.run(newTask.task, newTask.status, userId);
        return true;
    }
    catch (err) {
        console.log(err);
        throw err;
    }
}

export let toggleTask = (taskId, userId) => {
    const stmt1 = sql.prepare('SELECT status FROM task WHERE id = ? AND user_id = ?');
    const stmt2 = sql.prepare('UPDATE task SET status = ? WHERE id = ? AND user_id = ?');
    let info;

    try {
        info = stmt1.all(taskId, userId);
        const newStatus = 2 - info[0].status - 1;
        info = stmt2.run(newStatus, taskId, userId);
    }
    catch (err) {
        console.log(err);
        throw err;
    }
}

export let removeTask = (taskId, userId) => {
    const stmt = sql.prepare('DELETE FROM task WHERE id = ? AND user_id = ?');
    let info;

    try {
        info = stmt.run(taskId, userId);
        return true;
    }
    catch (err) {
        console.log(err);
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
                arrival, 
                destination, 
                date, 
                AvSeats, 
                price
            ) VALUES (?, ?, ?, ?, ?)
    `);
    

        const result = stmt.run(
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
        throw err; // Re-throw other errors
    }
}; 

export let getAllFlights = () => {
    const stmt = sql.prepare("SELECT * FROM flight"); // Update to your actual table name 
    let flights;
    try {
        flights = stmt.all();
        return flights;
    } catch (err) {
        throw err;
    }
}