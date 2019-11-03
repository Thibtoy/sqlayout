const {sqlayout} = require('./lib/class/sqlayout');

module.exports = function(params) {
	return new sqlayout(params);
}