const glob = require('glob');
const path = require('path');
const expressListEndpoints = require('express-list-endpoints');
const config = require('./config.json');
const swaggerDocument = require('./swagger.json');

const URL = config.server.url;
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
					url: URL
				}]
			},
			tags: [],
			components: {
				schemas: {}
			},
			paths: {}
		},
		apis: [],
		security: [{
			JWT: []
		}]

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
			const pathName = route.path.replace(/:(\w+)/g, '{$1}');
			const path = '/' + routerName + pathName;

			if (!swaggerOptions.swaggerDefinition.paths[path]) {
				swaggerOptions.swaggerDefinition.paths[path] = {};
			}

			swaggerOptions.swaggerDefinition.paths[path][method] = {
				tags: [routerName],
				summary: route.description,
				parameters: [],
				responses: {
					200: {
						description: 'OK'
					},
					400: {
						description: 'Bad Request'
					},
					401: {
						description: 'Unauthorized'
					},
					403: {
						description: 'Forbidden'
					},
					404: {
						description: 'Not Found'
					},
					500: {
						description: 'Internal Server Error'
					}
				}
			};

			if (route.middlewares.length > 0) {
				route.middlewares.forEach(middleware => {
					if (middleware.name === 'authenticate') {
						swaggerOptions.swaggerDefinition.paths[path][method].security = [{
							JWT: []
						}];
					}
				});
			}

			if (route?.parameters?.length > 0) {
				route.parameters.forEach(parameter => {
					swaggerOptions.swaggerDefinition.paths[path][method].parameters.push({
						name: parameter.name,
						in: parameter.in,
						required: parameter.required,
						description: parameter.description,
						schema: {
							type: parameter.type
						}
					});
				});
			}

			if (route?.responses?.length > 0) {
				route.responses.forEach(response => {
					swaggerOptions.swaggerDefinition.paths[path][method].responses[response.code] = {
						description: response.description
					};
				});
			}

			if (route.requestBody) {
				swaggerOptions.swaggerDefinition.paths[path][method].requestBody = {
					content: {
						'application/json': {
							schema: {
								$ref: '#/components/schemas/' + route.requestBody
							}
						}
					}
				};
			}



		});

		swaggerOptions.swaggerDefinition.components.securitySchemes = {
			cookieAuth: {
				type: 'apiKey',
				in: 'header',
				name: 'Authorization',
				description: '',
			}
		};
	});

	glob.sync('./models/postmodel/*.js').forEach(file => {
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

	swaggerOptions.swaggerDefinition.components.schemas['Error'] = {
		type: 'object',
		properties: {
			message: {
				type: 'string'
			},
			stack: {
				type: 'string'
			}
		}

	};

	swaggerDocument.components = swaggerOptions.swaggerDefinition.components;
	swaggerDocument.paths = swaggerOptions.swaggerDefinition.paths;
	swaggerDocument.tags = swaggerOptions.swaggerDefinition.tags;
	swaggerDocument.security = swaggerOptions.security;
};

module.exports = { updateSwaggerDocument };
