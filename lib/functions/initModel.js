const {Model} = require('../class/model');
const {readDatabase} = require('./readDatabase');

function initModel(model) {
	let that = {ref: this,
 				db: this.database(),
				model: new Model(this, model)};

	this.models[model.table] = that.model;

	that.db.connect(err => {
		if (err) throw err;
		that.db.query(
			'SELECT DISTINCT col.COLUMN_NAME, col.DATA_TYPE, col.CHARACTER_MAXIMUM_LENGTH, col.IS_NULLABLE,'+
					' col.COLUMN_DEFAULT, col.EXTRA, col.COLUMN_KEY, col.TABLE_NAME,'+
					' k.REFERENCED_TABLE_NAME, k.REFERENCED_COLUMN_NAME, k.CONSTRAINT_NAME, c.CONSTRAINT_TYPE'+
				' FROM INFORMATION_SCHEMA.COLUMNS AS col '+
				' LEFT JOIN INFORMATION_SCHEMA.KEY_COLUMN_USAGE AS k'+
					' ON k.TABLE_SCHEMA = col.TABLE_SCHEMA AND k.COLUMN_NAME = col.COLUMN_NAME'+
				' LEFT JOIN INFORMATION_SCHEMA.TABLE_CONSTRAINTS AS c ON c.CONSTRAINT_NAME = k.CONSTRAINT_NAME'+
				' WHERE col.TABLE_SCHEMA = \''+that.ref.params.database+'\''+
					' AND col.TABLE_NAME = \''+that.model.table+'\';'
			, function(err, data) {
				if (err) throw err;
				readDatabase(data, that);
		});
	});
};

module.exports = {
	initModel: initModel
}