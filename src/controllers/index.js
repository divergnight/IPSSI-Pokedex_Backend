require('dotenv').config()

const { SECRET, NODE_ENV } = process.env

module.exports = {
	SECRET,
	NODE_ENV,
}
