function findAll(options = new Object()) {
	let db = this.sqlayout.database();
	let query = 'SELECT';
	let foreignKeys = new Array();
	let count = 0;
	let that = this;
	for (let field in this.fields) {
		count++;
		if (this.fields[field].foreignKey || this.fields[field].type === 'falseLiaison') {
			let table = (this.fields[field].foreignKey)? this.fields[field].foreignKey.refTable : this.fields[field].refTable;
			let param1 = (this.fields[field].foreignKey)? '`'+this.table+'`.`'+field+'`' : '`'+this.table+'`.`id`';
			let param2 = (this.fields[field].foreignKey)? '`'+table+'`.`id`' : '`'+table+'`.`'+this.fields[field].refColumn+'`';
			query += 'GROUP_CONCAT(DISTINCT `'+table+'`.`id`) AS '+field+'List';
			foreignKeys.push({table: table, query: ' LEFT JOIN `'+table+'` ON '+param1+' = '+param2});
		}
		else query += '`'+this.table+'`.`'+field+'`';
		query += (count >= Object.keys(this.fields).length)? ' FROM `'+this.table+'`' : ', ';
	}
	if (foreignKeys.length) {
		for (let i = 0, n = foreignKeys.length; i < n; i++) query += foreignKeys[i].query;
		query += ' GROUP BY `'+this.table+'`.`id`';
	}
	if (options.orderBy && foreignKeys.length === 0) query += ' ORDER BY '+options.orderBy.field+' '+options.orderBy.param;
	if (options.limit) query += ' LIMIT '+limit;
	query += ';';
	console.log(query);
	return new Promise (function(resolve, reject) {
		db.query(query, function(err, data) {
			db.end();
			if (err) reject(err);
			console.log(data);
			let results = new Array();
			for (let i = 0, n = data.length; i < n; i++) {
				results.push(that.formatResult(data[i]));
			}
			return resolve(results);
		});
	});
}

module.exports = {
	findAll: findAll
}