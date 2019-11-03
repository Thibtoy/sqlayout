const {initModel} = require('../functions/initModel');

class sqlayout {
	constructor(params) {
		this.params = params;
		this.mysql = require('mysql');
		this.models = new Object();
		this.initModel = initModel;
	}

	database = () => {
		return this.mysql.createConnection(this.params);
	}
}

module.exports = {
	sqlayout: sqlayout
}