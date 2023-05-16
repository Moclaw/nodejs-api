
class BaseService {
	constructor(model) {
		this.model = model;
	}

	async create(data) {
		return await this.model.create(data);
	}

	async getAll(flag) {
		return await this.model.findAll(flag);
	}

	async getById(id) {
		return await this.model.findOne({ where: { id: id } });
	}

	async update(id, data) {
		return await this.model.update(data, { where: { id: id } });
	}
}

module.exports = BaseService;
