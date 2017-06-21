#! /usr/local/bin/node

const express = require("express")
const fs = require("fs")
const app = express()

const browserfy = file =>
	file.replace(/\nmodule\.exports \= (.*)/g, "\nwindow\.$1 = $1").replace(/\nconst .* \= require\(.*/g, "\n")

app.get("/*.js", (req, res) => {
	const filename = req.path.substr(1)
	fs.readFile(filename, "utf8", (err, file) => {
		if (err) throw err
		res.send(browserfy(file))
	})
})

app.use(express.static("."))

const port = 9999
app.listen(port, () => {
	console.log(`Listening on port ${port}`)
})
