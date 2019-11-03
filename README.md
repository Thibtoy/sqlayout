Sqlayout is an entity manager or an Object Relationnal Mapper, built for mysql, that is aimed at beeing easy to use.

Is not yet disponible on npm but you can use it by downloading it manually in your project.

Feel free to contribute on this project, there's still a lot to do!



Precautions:

	Connection: 

		Sqlayout open a connection for each request and close it automatically after each responses. I don't know
		yet how to use pool connections or how to keep a connection alive correctly so i'll wont change it for
		now.

		
	Warnings:
			
		Once sqlayout will be initialised, you'll need to access the same sqlayout item in all your application,
		basically, you can store it or bind it through your roads and controllers or you can initialise it in a
		separated file and then export it to require it later. 



Introduction:

	Models:

		Thoses models will represent your database's tables structures, they're the core of sqlayout, they'll
		permit us to create update and drop our tables or to record read update and delete datas.

		Sqlayout models own their owns tcheck method to validate data type (currents type allowed: password,
		email, date, datetime, year, time, timestamp, int, VARCHAR(0-255)). 

		Email and password type are automatically transformed into VARCHAR(75) in your db, the Email type will
		automatically tcheck a valide email format, and the Password type will automatically require a password
		with a minimum of 8 characters, with one majuscule, one minuscule, one digit and one special character.

		The restrictions are using a regular expression to validate data, for the email, password and varchar
		type, you can declare and use your own regular expression.

		If your models have relations, when you'll get a data which is linked to another, you'll have the
		possibility to get the linked data with a `get[TABLE_NAME]`function. 

		Imagine you get an users table and a comments table, each comment is related to the id of
		the user who posted it, so on the user, you'll have a method getComments, if you call it without options
		you'll get all comments, if you pass one or multiple ids(presents in user.comments_idList) in an array
		through the getComments method, you'll get only thoses that you want. 

	
	Examples: 

			->`user.getComments()` 

		return all the comments posted by the user.


			->`user.getComments([user.comments_idList[0]]) 
			
		return the first comment of the user's comments list.

			->`user.getComments([user.comments_idList[0], user.comments_idList[user.comments_idList.length-1]])`
			
		return the first and the last comments of the user's comments list.



Start with sqlayout:

	initialise sqlayout:

		Import sqlayout: `const sqlayout = require('path_to_sqlayout_FOLDER');`, 
			
			for example -> `const sqlayout = require('./sqlayout');`

		Initialise it directly(recommanded): 
				->`const sqlayout = require('./sqlayout')({	
						host: process.env.DATABASE_URL || 'databaseUrl',	        //helpers: 'localhost'//
						user: process.env.DATABASE_USER || 'databasUser',			//helpers: 'root'//
						password: process.env.DATABASE_PASS || 'databasePassword',	//helpers: null or 'root'//
						database: process.env.DATABASE_NAME || 'databaseName'
				});`

		Initialise it later: 
				->`var sqlayout = require('./sqlayout');` 		//helpers: use a var it'll wont work instead//
				  `sqlayout = sqlayout({
					   host: process.env.DATABASE_URL || 'databaseUrl',			//helpers: 'localhost'//
					   user: process.env.DATABASE_USER || 'databasUser',			//helpers: 'root'//
					   password: process.env.DATABASE_PASS || 'databasePassword',	//helpers: null or 'root'//
					   database: process.env.DATABASE_NAME || 'databaseName'
				   });`


	createModel:

		Model Format:

			Your model will be an object, it's better to declare it in a separated file and then export it.

			The minimum to create a model is to declare it with a table property, which will be the table name,
			then declare an id property, which will represent the id's column of your table, and at least one 
			other property which will represent another column in your table.

			Except the table property, each other property of your model is an object that set the parameters of 
			your table's field.

			The id properties must be declared like this:

					->`id: {type: 'INT', autoInc: true, primaryKey: true}`,

				except that the autoInc param is not required, don't pass it if you want to disable it.

				
			The foreign keys properties must be declared like this:

					->`linkedTable_id: {type: 'INT', foreignKey: {refTable: 'linkedTable', refField: 'id'}}`

				We strongly recomand you to name your tables's ids and foreign keys like shown before if you
				want sqlayout to work correctly.


			For the other fields, the only parameter required is the type so you can easily declare a field
			like this:

					->`email: {type: 'EMAIL'}`

				By default, a field declared like this will be automatically set to 'NOT NULLABLE'.

			All the parameters of a field:

					->`field: {
							type: string awaited,
							nullable: boolean awaited,
							default: the data that will be set if none is given to this field before to record,
							autoInc: boolean awaited,
							primaryKey: boolean awaited,
							foreignKey: object awaited{refTable: string awaited, refField: string awaited},
							errMessage: string awaited,
							restriction: regular expression awaited,
						}

			For example you can declare a userModel like this:

					->`userModel = {
							table: 'users',
							id: {type: 'INT', autoInc: true, primaryKey: true},
							name: {type: 'VARCHAR(55)', nullable: true, restriction: /^[a-zA-Z- ]+$/},
							password: {type: 'PASSWORD'},
							email: {type: 'EMAIL'}
						};`


	Initialise Model: 

		Now that you created the model of your table, you want it to be created and related in the database, for
		this, use the `sqlayout.initModel(model)` method.

				->`sqlayout.initModel(userModel);`

		This method must be use only once at the launching of your server, if you use it later this is not
		a normal utilisation of sqlayout.

		This method will request the schema of your table in your database, if their is no such table, it
		will create it in your database, if this table already exist, it will search for and show you the
		differences between your actual model and the table in the database and then, it'll propose you in
		the server console to update the database schema (the second part of this method is not yet implemented :s);


	Using sqlayout models:

		Accessing an initialised model:

			Each initialised model is stored in the `sqlayout.models` object, you can access them like this:

					->`sqlayout.models.tableName`

				For example, to access our userModel, use:

					->`sqlayout.models.users`

				You can use a shortCut in your code like this:

					->`let models = sqlayout.models;

				or

					->`let userModel = sqlayout.models.users`


		Using a model:

			Once you access your initialised model, you can now use his methods:

			requireModel(): 

				This method will return you an empty model that allow you to use the `recordSafe()` method
				once you have fill it.

				You can fill the empty model by accessing the 'content' property of each field:

						->`let record = sqlayout.models.tableName.getModel()
							record.columnName.content = dataToRecord`

					with our userModel:

						->`let newUser = sqlayout.models.users.getModel()
							newUser.name = 'Thibault';
							newUser.email = 'thibault@jaimail.coum';
							newUser.password = '1PassWordP4sSiCompliqué?';

					Since we declared `autoInc = true` for the id field of our userModel, we don't have to care
					about it.


			recordSafe(record):

				This method will insert the new record in your database, and it will tcheck the validity of the 
				record before to perform it (for example with our user, it will tcheck the format of the email
				and if the password fill all conditions) it also tcheck if you filled a not nullable field or 
				not.

				If the record is not correct, the method will return an array of all error messages and
				correspondent fields (by default: 'incorrect' + columnName if data is not valid, columnName +
				'must be filled' if the field is empty and not nullable).

				recordSafe return a callback:

						->`sqlayout.models.tableName.recordSafe(record, function(success, data) {
								if (!success) throw data;
								console.log(data) //outpout the inserted id of your record
							});`

					If the request fail, data will be the sql error message.

					With our userModel:

						->`sqlayout.models.users.recordSafe(newUser, function(success, data) {
								if (!success) throw data;
							});`


		  
			