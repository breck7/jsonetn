"use strict"

const TreeNotation = require("treenotation")

class JsonETN extends TreeNotation {
	parseNodeType(line) {
		const head = line.split(" ")[0]
		const nodeTypes = {
			s: StringNode,
			n: NumberNode,
			a: ArrayNode,
			o: ObjectNode,
			b: BooleanNode,
			j: OtherNode
		}
		return nodeTypes[head]
	}

	toObject() {
		return this.isRoot() ? this.nodeAt(0).toObject() : super.toObject()
	}

	getName() {
		return this.getWord(1)
	}

	_toObjectTuple() {
		return [this.getName(), this.getValue()]
	}

	_getSize() {
		return 3
	}

	toJSON() {
		return JSON.stringify(this.toObject(), null, " ")
	}

	static fromJSON(str) {
		return new JsonETN(JsonETN.fromObjectToJsonETN(JSON.parse(str)))
	}

	static getTypeChar(v) {
		const type = typeof v
		if (type === "string") return "s"
		else if (type === "boolean") return "b"
		else if (v === null) return "j"
		else if (type === "object") return v instanceof Array ? "a" : "o"
		else if (type === "number") return "n"
		return "j"
	}

	static fromObjectToJsonETN(obj, name = "", indentLevel = 0) {
		const typeOfObj = typeof obj
		const nodeDelimiter = "\n"
		const wordDelimiter = " "
		const spaces = wordDelimiter.repeat(indentLevel + 1)
		if (typeOfObj !== "object" || obj === null) {
			const typeChar = this.getTypeChar(obj) + " "
			if (typeOfObj === "string" && obj.indexOf(nodeDelimiter) > -1)
				return typeChar + name + nodeDelimiter + spaces + obj.replace(/\n/g, nodeDelimiter + spaces)

			if (name.indexOf(wordDelimiter) > -1) return typeChar + name + nodeDelimiter + spaces + obj
			return typeChar + name + wordDelimiter + obj
		}

		if (obj instanceof Array) {
			const parts = obj.map(v => spaces + this.fromObjectToJsonETN(v, undefined, indentLevel + 1))
			parts.unshift("a " + name)
			return parts.join(nodeDelimiter)
		} else {
			const parts = Object.keys(obj).map(k => spaces + this.fromObjectToJsonETN(obj[k], k, indentLevel + 1))
			parts.unshift("o " + name)
			return parts.join(nodeDelimiter)
		}
	}
}

class JsonETNLeafNode extends JsonETN {
	parseNodeType(line) {
		// allow multiline strings to pass through.
		return TreeNotation
	}

	toObject() {
		return this.getValue()
	}

	getValue() {
		return JSON.parse(this.length ? this.childrenToString() : this.getTail())
	}

	getName() {
		return this.length ? this.getRest() : this.getWord(1)
	}
}

class StringNode extends JsonETNLeafNode {
	getValue() {
		if (this.length) return this.childrenToString()
		return this.getTail()
	}
}
class NumberNode extends JsonETNLeafNode {}
class BooleanNode extends JsonETNLeafNode {}
class OtherNode extends JsonETNLeafNode {}
class ArrayNode extends JsonETN {
	_toObjectTuple() {
		return [this.getName(), this.getChildren().map(node => node.toObject())]
	}

	toObject() {
		return this.getChildren().map(node => node.toObject())
	}
}
class ObjectNode extends JsonETN {
	_toObjectTuple() {
		return [this.getName(), this.toObject()]
	}
}

module.exports = JsonETN
