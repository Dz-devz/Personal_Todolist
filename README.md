This is my Personal Todo list with CRUD method, if you want to improve or take a look at it

just clone the app
after cloning the app

go to your terminal type
npm i

after that download postgresSQL application to make your database
after downloading create your own database called permalist or if you want to change the name of your database it to something
just change the database: "permalist", in db = new pg.client and change it to your database name
after that create your own table inside the postgresSQL.

you can copy and paste this or type it yourself
CREATE TABLE items(
  id SERIAL PRIMARY KEY,
  title VARCHAR(100) NOT NULL,
  days_id VARCHAR(10) NOT NULL
);

and now try to run it in your terminal using
nodemon todo.js

enjoy :)
