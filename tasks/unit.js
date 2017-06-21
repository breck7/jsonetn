#! /usr/local/bin/node

const test = require("tape")
const testTree = require("../tests.js")

Object.keys(testTree).forEach(key => {
	test(key, assert => {
		testTree[key](assert.strictEqual)
		assert.end()
	})
})
