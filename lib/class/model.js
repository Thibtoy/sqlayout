const {createModel} = require('../functions/createModel');
const {restriction} = require('../functions/restriction');
const {findAll} = require('../functions/findAll');
const {formatResult} = require('../functions/formatResult');

class Model {
	constructor(sqlayout, model) {
		this.sqlayout = sqlayout;
		this.fields = new Object();
		for (let prop in model) {
			if (typeof model[prop] === 'object') {	
				this.fields[prop] = new Object();
				this.fields[prop].type = model[prop].type || false;			
				this.fields[prop].nullable = model[prop].nullable || false;
				this.fields[prop].default = model[prop].default || null;
				this.fields[prop].autoInc = model[prop].autoInc || false;
				this.fields[prop].primaryKey = model[prop].primaryKey || false;
				this.fields[prop].foreignKey = model[prop].foreignKey || false;
				this.fields[prop].errMessage = model[prop].errMessage || 'Incorrect '+prop;
				this.fields[prop].restriction = restriction(this.fields[prop], model[prop].restriction);
				if (this.fields[prop].foreignKey) {
					let table = this.fields[prop].foreignKey.refTable;
					this.sqlayout.models[table].fields[this.table+'_id'] = {
						type: 'falseLiaison',
						refColumn: prop, 
						refTable: this.table,
						list : new Array()
					}; 
				}
			}
			else this[prop] = model[prop];
		}
		this.createModel = createModel;
		this.findAll = findAll;
		this.formatResult = formatResult;
	}

	requireModel = () => {
		return this.createModel();
	}

	recordSafe = (model, callback) => {
		let db = this.sqlayout.database(),
			query = 'INSERT INTO `'+this.table+'` (',
			values = new Array(),
			errField = new Array(),
			i = 0,
			n = Object.keys(model).length;

			for (let field in model) {
				i++
				if (model[field].primaryKey) continue;
				if (!model[field].content) {
					if (!model[field].nullable) errField.push({field, errMessage: field+' must be filled'});
					else {
						values.push(null);
						query += field;
						query += (i < n)? ', ': ') ';
					}
					continue;
				}
				model[field].restriction(model[field].content, function(success, data){
					if (success) {
						query += field;
						query += (i < n)? ', ': ') ';
						values.push(model[field].content);
					}
					else errField.push({field, errMessage: data});
				})
			}
			if (errField.length > 0) return callback(false, errField);
			else {
				query += 'VALUES ?';
				db.query(query, [[values]], function(err, data) {
					db.end();
					if(err) throw err;
					else return callback(true, data);
				});
			}
	}

	recordEaz = (records) => {
		let values = handleFormat(records),
			db = this.sqlayout.database(),
			query = 'INSERT INTO `'+this.table+'` (',
			i = 0,
			n = Object.keys(this.fields).length;
			
			for (let field in this.fields) {
				i++
				if (this.fields[field].primaryKey) continue;
				query += field;
				query += (i < n)? ', ': ')';
			}

		query += 'VALUES ?';
		return new Promise(function(resolve, reject) {
			db.query(query, [values], function(err, data) {
				db.end();
				if (err) reject(err);
				resolve(data);
			});
		});
	}
}

function handleFormat(records) {
	let values = new Array();
		switch (true) {
			case !records.length && typeof records === 'object': 
				values.push(formatObject(records));
				break;
			case records.length > 0 && typeof records === 'object':
				if (typeof records[0] === 'string') values.push(records);
				else {
					for (let i = 0, n = records.length; i < n; i++) {
						if (typeof records[0] === 'object' && !records[0].length) values.push(formatObject(records[i]));
						else values.push(records[i])
					}
				}
				break;
			default:
				break;
		}
	return values;
}

function formatObject(records) {
	let rowValues = new Array();
	for (let prop in records) {
		rowValues.push(records[prop]);
	}
	return rowValues;
}

module.exports = {
	Model: Model
}