const express = require('express');
const fs = require("fs");
const ejs = require("ejs");
const path = require("path");
const app = express();
require('dotenv').config()
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, "public")));

app.get("/", (req, res) => {
  fs.readdir("./files", "utf-8", (err, files) => {
    if (err) console.log("Error", err);

    res.render("show", { files });
  });
});

app.get("/create", (req, res) => {
  res.render("index");
});

app.post("/hisabcreated", (req, res) => {
  const today = new Date();
  const dd = String(today.getDate()).padStart(2, "0");
  const mm = String(today.getMonth() + 1).padStart(2, "0");
  const yyyy = today.getFullYear();
  const baseFilename = `${dd}-${mm}-${yyyy}`;
  let { hisab } = req.body;

  let fileNumber = 0;
  let filename = `./files/${baseFilename}.txt`;

  while (fs.existsSync(filename)) {
    fileNumber += 1;
    filename = `./files/${baseFilename}.${fileNumber}.txt`;
  }

  // Write the hisab to the file
  fs.writeFile(filename, hisab, (err) => {
    if (err) console.log(err);
  });

  res.redirect("/");
});

app.get("/edit/:filename", (req, res) => {
  let filename = req.params.filename;

  fs.readFile(`./files/${filename}`, "utf-8", (err, data) => {
    if (err) console.log(err);
    // console.log('data: ', {data});
    res.render("edit", { data, filename });
  });
});

app.post("/update", (req, res) => {
  let { hisab, filename } = req.body;
  fs.writeFile(`./files/${filename}`, hisab, (err) => {
    if (err) console.log(err);
  });
  res.redirect("/");
});

app.get("/details/:filename", (req,res) => {

let fn = req.params.filename;
fs.readFile(`./files/${fn}`, "utf-8", (err , data) => {
  if(err) console.log(err);
  
  res.render("details" , {fn, data});
})

  
})

app.get("/delete/:filename", (req,res) => {

let fn = req.params.filename;
fs.unlink(`./files/${fn}`, (err)=>{
  if(err) console.log(err); 
  res.redirect("/")
})

  
})


app.listen(port, () => console.log(`Example app listening on port ${port}!`));