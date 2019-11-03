function getColumnParams(column) {
	let columnParams = {
		type: (column.DATA_TYPE.toUpperCase())+
		((column.CHARACTER_MAXIMUM_LENGTH != null)? '('+column.CHARACTER_MAXIMUM_LENGTH+')': ''),
		nullable: (column.IS_NULLABLE === 'NO')? false : true,
		default: column.COLUMN_DEFAULT,
		autoInc: (column.EXTRA === 'auto_increment')? true : false,
		primaryKey: (column.COLUMN_KEY === 'PRI')? true: false,
		foreignKey: (column.CONSTRAINT_TYPE === 'FOREIGN KEY')? {refTable: column.REFERENCED_TABLE_NAME, refField: column.REFERENCED_COLUMN_NAME} : false,
	};
	return columnParams;
};

module.exports = {
	getColumnParams: getColumnParams
};