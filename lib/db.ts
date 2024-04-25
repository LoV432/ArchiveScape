import pg from 'pg';
const { Pool } = pg;

pg.types.setTypeParser(1114, function (stringValue) {
	// TODO: Better way to do this?
	const date = new Date(stringValue);
	return new Date(date.getTime() - date.getTimezoneOffset() * 60000);
});

export const db = new Pool({
	user: process.env.PG_USER,
	host: process.env.PG_HOST,
	database: process.env.PG_DATABASE,
	password: process.env.PG_PASSWORD,
	port: parseInt(process.env.PG_PORT || '5432')
});
