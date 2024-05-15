CREATE TABLE "user" (
	"id"	INTEGER PRIMARY KEY AUTOINCREMENT,
	"username"	TEXT,
	"password"	TEXT
)

CREATE TABLE "task" (
	"id"	INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
	"task"	TEXT NOT NULL,
	"status"	INTEGER NOT NULL DEFAULT 1,
	"created_at"	TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
	"user_id"	INTEGER,
	FOREIGN KEY("user_id") REFERENCES "user"("id") on delete cascade on update cascade
)

CREATE TABLE tickets (
    flightID INTEGER PRIMARY KEY AUTOINCREMENT, -- Auto-incrementing
    arrival TEXT NOT NULL,
    destination TEXT NOT NULL,
    date TEXT NOT NULL,
    avSeats INTEGER NOT NULL,
    price REAL NOT NULL
);
