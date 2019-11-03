function createTable(model, db) {
	let query = 'CREATE TABLE '+model.table+' (';
	prepareFields(model.fields, function(result) {
		let id = result.pkField;
			query += result.query;
			query += 'PRIMARY KEY (`'+id+'`)'
			if (result.foreignKeys.length > 0) {
				query += constraintForeignKeys(result.foreignKeys, model);
			};
			query += ');';
			db.query(query, function(err, data) {
				db.end();
				if (err) throw err;
				console.log('model `'+model.table+'` successfully created in the database');
			});
	})
		
			
		
		
	
}

function prepareFields(fields, callback) {
	let result = {query: '', pkField: '', foreignKeys: new Array()};
	for (let columnName in fields) {
		let field = fields[columnName];
		field.type = (/email|password/i.test(field.type))? 'VARCHAR(75)' : field.type;			
		if (field.type === 'falseLiaison') continue;
		result.query += '`'+columnName+'` '+field.type;
		result.query += (field.nullable)? ' NULL': ' NOT NULL';
		if (field.autoInc) result.query += ' AUTO_INCREMENT';
		if (field.default != null) result.query += ' DEFAULT\''+field.default+'\'';
		if (field.primaryKey) result.pkField = columnName;
		if (field.foreignKey) {
			result.foreignKeys.push({
				field: columnName, 
				refTable: field.foreignKey.refTable, 
				refField: field.foreignKey.refField
			});	
		};
		result.query += ', ';
	};
	return callback(result);
};

function constraintForeignKeys (foreignKeys, model) {
	let query = ',';
	for (let i = 0, n = foreignKeys.length; i < n; i++) {
		let index = 'fk_'+model.table+'_'+(i+1)+'idx';
		query+= ' INDEX `'+index+'` (`'+foreignKeys[i].field+'` ASC),';
		query+= ' CONSTRAINT `'+index+'` FOREIGN KEY (`'+foreignKeys[i].field+'`) REFERENCES `'+
			foreignKeys[i].refTable+'` (`'+foreignKeys[i].refField+'`)';
		if (i < (n-1)) query += ','; 
	}
	return query;	
}

module.exports = {
	createTable: createTable
}