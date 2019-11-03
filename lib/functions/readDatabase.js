const {createTable} = require('./createTable');
const {getColumnParams} = require('./getColumnParams');
const {Model} = require('../class/model');

function readDatabase(data, that) {
	if (data.length === 0)	return createTable(that.model, that.db);
	that.db.end(); // à retirer dans le cas du alter table

	let existantModel = new Object();
	let update = {toDo: false, fieldsToUpdate: new Array()};
		existantModel.table = data[0].TABLE_NAME;
				
	for (let i = 0, n = data.length; i < n; i++) {
		existantModel[data[i].COLUMN_NAME] = getColumnParams(data[i]);
	};
	existantModel = new Model(that.ref, existantModel);

	for (let field in existantModel.fields) {
		if (/^email|password$/i.test(that.model.fields[field].type)) existantModel.fields[field].type = that.model.fields[field].type;
		for (let prop in existantModel.fields[field]) {
			if (prop === 'restriction') continue;
			if (existantModel.fields[field].type === 'TIMESTAMP' && existantModel.fields[field].default === 'CURRENT_TIMESTAMP') {
				that.model.fields[field].type = existantModel.fields[field].type;
				that.model.fields[field].default = existantModel.fields[field].default;
			}
			console.log(!that.model.fields[field] || existantModel.fields[field][prop] != that.model.fields[field][prop], existantModel.fields[field][prop], that.model.fields[field][prop])
			if (!that.model.fields[field] || existantModel.fields[field][prop] != that.model.fields[field][prop]){
				update.toDo = true;
				update.fieldsToUpdate.push({[field]: that.model.fields[field]});
			};
		};
	};
	if (update.toDo) console.log('update to do on '+that.model.table);
	else console.log(that.model.table+' is up to date');
};

module.exports = {
	readDatabase: readDatabase
};