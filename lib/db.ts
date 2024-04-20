import sqlite3 from 'sqlite3';
import { Database, open } from 'sqlite';

let db: Database<sqlite3.Database, sqlite3.Statement>;

async function openDatabase() {
	try {
		db = await open({
			filename: './database.db',
			driver: sqlite3.Database
		});
		console.log('Database opened successfully');
	} catch (error) {
		console.error('Error opening database:', error);
	}
}

// Export a function to get the database instance
export async function getDatabase() {
	// Ensure that the database is opened before returning it
	if (!db) {
		await openDatabase();
		return db;
	}
	return db;
}
