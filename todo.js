import bodyParser from "body-parser";
import env from "dotenv";
import express from "express";
import pg from "pg";

const app = express();
const port = 3000;
env.config();

const db = new pg.Client({
  user: process.env.PG_USER,
  host: process.env.PG_HOST,
  database: process.env.PG_DATABASE,
  password: process.env.PG_PASSWORD,
  port: process.env.PG_PORT,
});
db.connect();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

let todayItems = [];
let weekItems = [];
let monthItems = [];
let yearItems = [];

app.get("/", async (req, res) => {
  try {
    // const result = await db.query("SELECT * FROM items WHERE days_id = 'Today' ORDER BY id ASC");
    const todayResult = await db.query(
      "SELECT * FROM items WHERE days_id = 'Today' ORDER BY id ASC"
    );
    const weekResult = await db.query(
      " SELECT * FROM items WHERE days_id = 'Week' ORDER BY id ASC"
    );
    const monthResult = await db.query(
      " SELECT * FROM items WHERE days_id = 'Month' ORDER BY id ASC"
    );
    const yearResult = await db.query(
      " SELECT * FROM items WHERE days_id = 'Year' ORDER BY id ASC"
    );
    todayItems = todayResult.rows;
    weekItems = weekResult.rows;
    monthItems = monthResult.rows;
    yearItems = yearResult.rows;
    res.render("index.ejs", {
      todayTitle: "Today",
      weekTitle: "Week",
      monthTitle: "Month",
      yearTitle: "Year",
      todayItems: todayItems,
      weekItems: weekItems,
      monthItems: monthItems,
      yearItems: yearItems,
    });
  } catch (err) {
    console.log(err);
  }
});

app.post("/add", async (req, res) => {
  const todayItem = req.body["newItemToday"];
  const weekItem = req.body["newItemWeek"];
  const monthItem = req.body["newItemMonth"];
  const yearItem = req.body["newItemYear"];
  todayItems.push({ title: todayItem });
  weekItems.push({ title: weekItem });
  monthItems.push({ title: monthItem });
  yearItems.push({ title: yearItem });
  try {
    if (todayItem) {
      await db.query("INSERT INTO items (title, days_id) VALUES ($1, $2)", [
        todayItem,
        "Today",
      ]);
    }
    if (weekItem) {
      await db.query("INSERT INTO items (title, days_id) VALUES ($1, $2)", [
        weekItem,
        "Week",
      ]);
    }
    if (monthItem) {
      await db.query("INSERT INTO items (title, days_id) VALUES ($1, $2)", [
        monthItem,
        "Month",
      ]);
    }
    if (yearItem) {
      await db.query("INSERT INTO items (title, days_id) VALUES ($1, $2)", [
        yearItem,
        "Year",
      ]);
    }
    res.redirect("/");
  } catch (err) {
    console.log(err);
  }
});

app.post("/edit", async (req, res) => {
  const item = req.body.updatedItemTitle;
  const id = req.body.updatedItemId;

  try {
    await db.query("UPDATE items SET title = ($1) WHERE id = $2", [item, id]);
    res.redirect("/");
  } catch (err) {
    console.log(err);
  }
});

app.post("/delete", async (req, res) => {
  const id = req.body.deleteItemId;
  try {
    await db.query("DELETE FROM items WHERE id = $1", [id]);
    res.redirect("/");
  } catch (err) {
    console.log(err);
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
