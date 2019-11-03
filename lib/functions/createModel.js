function createModel() {
	let emptyModel = new Object();
	for (let field in this.fields) {
		if (field === 'id' && this.fields[field].autoInc) continue;
		emptyModel[field] = {
			content: null,
			type: this.fields[field].type, 
			nullable: this.fields[field].nullable, 
			default: this.fields[field].default,
			errMessage: this.fields[field].errMessage,
			restriction: this.fields[field].restriction
		};
	}
	return emptyModel;
}

module.exports = {
	createModel: createModel
}