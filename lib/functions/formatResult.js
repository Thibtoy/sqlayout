function formatResult(data) {
	let result = new Object();
	for (let field in this.fields) {
		if (this.fields[field].type === 'falseLiaison') result[field+'List'] = data[field+'List'];
		else result[field] = data[field];
		if (this.fields[field].foreignKey || this.fields[field].type === 'falseLiaison') {
			let table = (this.fields[field].foreignKey)? this.fields[field].foreignKey.refTable : this.fields[field].refTable;
			let alias = table+'_idList';
			console.log(alias);
			result['get'+table[0].toUpperCase()+table.slice(1)] = () => {
				let db = this.sqlayout.database();			
				let query = 'SELECT * FROM '+table;
				query += ' WHERE `id` IN ('+data[alias]+');';
				return new Promise(function(resolve, reject) {
					if (data[alias] && data[alias].length > 0) {
						console.log(query);
						db.query(query, function(err, data) {
							db.end();
							if (err) reject(err);
							else resolve(data)
						});
					}
					else resolve(false);
				})			
			};
		}
	}
	return result;
};

module.exports = {
	formatResult: formatResult
}