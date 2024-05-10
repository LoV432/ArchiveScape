import pg from 'pg';
const { Pool } = pg;

pg.types.setTypeParser(1114, function (stringValue) {
	// TODO: This seems like a better way to do this, but is it?
	// https://stackoverflow.com/questions/20712291/use-node-postgres-to-get-postgres-timestamp-without-timezone-in-utc
	return new Date(`${stringValue} +0000`);
});

export const db = new Pool({
	user: process.env.PG_USER,
	host: process.env.PG_HOST,
	database: process.env.PG_DATABASE,
	password: process.env.PG_PASSWORD,
	port: parseInt(process.env.PG_PORT || '5432')
});
