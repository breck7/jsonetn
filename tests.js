"use strict"

const JsonETN = require("./jsonETN.js")

const testTree = (function() {
  const isNode = typeof require !== "undefined"

  const testTree = {}

  testTree.allTests = equal => {
    // Assert
    const runTest = (jsonStr, expectedJsonETNStr) => {
      // Act
      const actualJsonETN = JsonETN.fromJSON(jsonStr)
      const actualJson = actualJsonETN.toJSON()
      const obj = JSON.parse(jsonStr)
      const clean = JSON.stringify(obj, null, " ")

      if (expectedJsonETNStr)
        equal(
          actualJsonETN.toString(),
          expectedJsonETNStr,
          `actual jsonETN different from expected jsonETN for: ${expectedJsonETNStr}`
        )

      equal(actualJson, clean, `json to jsonETN back to json failed for: ${jsonStr}.`)
    }

    runTest(`"some\\nstring"`)

    runTest(`""`, `s `)

    runTest(`{"has a space": 2}`)

    runTest(`{"empty": [], "full" : 3}`)
    runTest(`{"empty": {}, "full" : 3}`)

    // todo: fix these
    // runTest(`["hi\\n"]`)
    // runTest(`["\\"\\\\\\/\\b\\f\\n\\r\\t"]`)
    // runTest(`{"hi\\nb" : 2}`)
    // runTest(`["new\u000Aline"]`)

    runTest(`{"empty": {}, "full" : 3}`)

    runTest(`1`, `n 1`)
    runTest(`false`, `b false`)
    runTest(`null`, `j null`)

    runTest(
      `{"foo": "bar"}`,
      `o
 s foo bar`
    )

    runTest(
      `{"foo": 2}`,
      `o
 n foo 2`
    )

    runTest(`{"deep": {"deeper": {"deepest" : "nesting"}}}`)

    runTest(
      `{"foo": 2, "nested": [2, false]}`,
      `o
 n foo 2
 a nested
  n 2
  b false`
    )

    runTest(`[[]   ]`)

    runTest(`[null, 1, "1", {}]`)

    runTest(
      `["foo","bar"]`,
      `a
 s foo
 s bar`
    )

    runTest(`[{"lines": "1\\n2\\n3"}]`)
  }

  const nodeTests = equal => {
    const fs = require("fs")
    const path = "./JSONTestSuite/test_parsing/"
    const files = fs.readdirSync(path).filter(f => f.substr(0, 1) === "y")
    files.forEach(file => {
      const content = fs.readFileSync(path + file, "utf8")
      const actualJsonETN = JsonETN.fromJSON(content)
      const actualJson = actualJsonETN.toJSON()
      const obj = JSON.parse(content)
      const clean = JSON.stringify(obj, null, " ")
      equal(actualJson, clean, `${file}`)
    })
  }

  if (isNode) testTree.nodeTests = nodeTests

  return testTree
})()

module.exports = testTree
