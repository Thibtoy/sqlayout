function restriction(field, restriction = null) {
	switch (true) {
		case field.type === 'INT':
		 	return function(data, callback) {
				if (typeof data === 'number') return callback(true);
				else return callback(false, field.errMessage); 
			};
		case /varchar/i.test(field.type):
			let limit = parseInt(field.type.split('(')[1], 10);
			if (restriction) {
				return function(data, callback) {
					if (restriction.test(data) && data.length <= limit) return callback(true);
					else return callback(false, field.errMessage);
				};
			}
			else {
				return function(data, callback) {
					return callback(true);
				};
			};
		case /email/i.test(field.type):
			restriction = (restriction != null)? restriction : /^[a-z0-9._-]+@[a-z0-9._-]+\.[a-z]{2,6}$/;
			return function(data, callback) {
				if (restriction.test(data)) return callback(true);
				else return callback(false, field.errMessage);
			};
		case /password/i.test(field.type):
			restriction = (restriction != null)? restriction : /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
			return function(data, callback) {
				if (restriction.test(data)) return callback(true);
				else return callback(false, field.errMessage+', must contain at least one upper case,'+
				 	' one lower case, one digit and one special character');
			};
		case /date|time|year/i.test(field.type):
			return buildDateRestriction(field);
		default:
			break;
	}
	return false;
}

function buildDateRestriction(field) {
	switch (true) {
		case /^date$/i.test(field.type):
			return function(data, callback) {
				let regexp = /^([1-9][0-9])?([0-9]{2})+[-@$!%*?&]?(0[1-9]|1[0-2])+[-@$!%*?&]?([0-2][0-9]|3[0-1])$/;
				if (regexp.test(data)) return callback(true);
				else return callback(false, field.errMessage);
			};
		case /^datetime$/i.test(field.type):		
			return function(data, callback) {
				let regexp = new RegExp('^([1-9][0-9])?([0-9]{2})+[-@$!%*?&]?(0[1-9]|1[0-2])+'+
					'[-@$!%*?&]?([0-2][0-9]|3[0-1])+( ([0-1][0-9]|2[0-3])+'+
					'[-@$!%*?&]?([1-5][0-9]|60)+[-@$!%*?&]?([1-5][0-9]|60))?$');
				let toTest = data;
				if (data.toString().length === 14) toTest = data.toString().slice(0, 8)+' '+data.toString().slice(8); 
				if (data.toString().length === 12) toTest = data.toString().slice(0, 6)+' '+data.toString().slice(6);
				if (regexp.test(toTest)) return callback(true);
				else return callback(false, field.errMessage);
			};
		case /^time$/i.test(field.type):
			return function(data, callback) {
				let regexp = /^([0-1][0-9]|2[0-3])+[-@$!%*?&]?([1-5][0-9]|60)+[-@$!%*?&]?([1-5][0-9]|60)$/;
				if (regexp.test(data)) return callback(true);
				else return callback(false, field.errMessage);
			};
		case /^year$/i.test(field.type):
			return function(data, callback) {
				let regexp = /^((19[0-9]{2})|(20[0-9]{2})|(21[0-4][0-9])|(215[0-5]))$/;
				if (regexp.test(data)) return callback(true);
				else return callback(false, field.errMessage);
			};
		case /^timestamp$/i.test(field.type):
			return function(data, callback) {
				let regexp = new RegExp('^([1-9][0-9]{3})+(0[1-9]|1[0-2])+'+
					'([0-2][0-9]|3[0-1])+([0-1][0-9]|2[0-3])+([1-5][0-9]|60)+([1-5][0-9]|60)$');
				if (regexp.test(data)) return callback(true);
				else return callback(false, field.errMessage);
			};
		default:
			break;
	};
}

module.exports = {
	restriction: restriction
}