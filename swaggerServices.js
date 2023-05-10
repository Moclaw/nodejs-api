const glob = require('glob');
const path = require('path');
const swaggerDocument = require('./swagger.json');
const expressListEndpoints = require('express-list-endpoints');

const updateSwaggerDocument = () => {
	const swaggerOptions = {
		swaggerDefinition: {
			openapi: '3.0.0',
			info: {
				title: 'Nodejs API',
				description: 'Pet project for learning Nodejs',
				contact: {
					name: 'Moc Lam Developer'
				},
				servers: [{
					url: 'http://localhost:4000'
				}]
			},
			tags: [],
			components: {
				schemas: {}
			},
			paths: {}
		},
		apis: []
	};

	glob.sync('./routes/*.js').forEach(file => {
		const routerName = path.basename(file, '.js');
		const router = require('./' + file);

		swaggerOptions.swaggerDefinition.tags.push({
			name: routerName,
			description: router.description
		});

		swaggerOptions.apis.push('./routes/' + routerName + '.js');
		swaggerOptions.swaggerDefinition.components.schemas[routerName] = router.schemas;

		const routes = expressListEndpoints(router);
		routes.forEach(route => {
			const method = route.methods[0].toLowerCase();
			const path = route.path.replace(/:(\w+)/g, '{$1}');

			if (!swaggerOptions.swaggerDefinition.paths[path]) {
				swaggerOptions.swaggerDefinition.paths[path] = {};
			}

			swaggerOptions.swaggerDefinition.paths[path][method] = {
				summary: '',
				tags: [routerName],
				description: '',
				produces: ['application/json'],
				responses: {
					'200': {
						description: 'OK'
					}
				}
			};
		});
	});

	glob.sync('./models/*.js').forEach(file => {
		const model = require(path.resolve(file));
		const modelName = path.basename(file, '.js');
		swaggerOptions.swaggerDefinition.components.schemas[modelName] = {
			type: 'object',
			properties: {}
		};
		for (const key in model) {
			if (model.hasOwnProperty(key)) {
				const element = model[key];
				swaggerOptions.swaggerDefinition.components.schemas[modelName].properties[key] = {
					type: typeof element
				};
			}
		}
	});

	// ghi đè lên file swagger.json
	swaggerDocument.openapi = swaggerOptions.swaggerDefinition.openapi;
	swaggerDocument.info = swaggerOptions.swaggerDefinition.info;
	swaggerDocument.tags = swaggerOptions.swaggerDefinition.tags;
	swaggerDocument.components = swaggerOptions.swaggerDefinition.components;
	swaggerDocument.paths = swaggerOptions.swaggerDefinition.paths;
	swaggerDocument.apis = swaggerOptions.apis;
};

module.exports = { updateSwaggerDocument };
