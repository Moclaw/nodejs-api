
class QueryFlag {
	static Flag = Object.freeze({
		NONE: 0,
		DISABLED: 1,
		ENABLED: 2,
	});
}

class BaseService {
	constructor(model) {
		this.model = model;
	}

	async getAll(QueryFlag = QueryFlag.Flag.NONE) {
		const results = null;
		try {
			if (QueryFlag === QueryFlag.Flag.DISABLED) {
				results = await this.model.findAll({ where: { is_disabled: true } });
			} else if (QueryFlag === QueryFlag.Flag.ENABLED) {
				results = await this.model.findAll({ where: { is_disabled: false } });
			}
			else {
				results = await this.model.findAll();
			}
		} catch (error) {
			console.log(error);
		}
		return results;
	}

	async getById(id, QueryFlag = QueryFlag.Flag.NONE) {
		const result = null;
		try {
			if (QueryFlag === QueryFlag.Flag.DISABLED) {
				result = await this.model.findOne({ where: { id: id, is_disabled: true } });
			}
			else if (QueryFlag === QueryFlag.Flag.ENABLED) {
				result = await this.model.findOne({ where: { id: id, is_disabled: false } });
			}
			else {
				result = await this.model.findOne({ where: { id: id } });
			}
		} catch (error) {
			console.log(error);
		}
		return result;
	}

	async getByKey(key, value, QueryFlag = QueryFlag.Flag.NONE) {
		const result = null;
		try {
			if (QueryFlag === QueryFlag.Flag.DISABLED) {
				result = await this.model.findOne({ where: { [key]: value, is_disabled: true } });
			}
			else if (QueryFlag === QueryFlag.Flag.ENABLED) {
				result = await this.model.findOne({ where: { [key]: value, is_disabled: false } });
			}
			else {
				result = await this.model.findOne({ where: { [key]: value } });
			}
		} catch (error) {
			console.log(error);
		}
		return result;
	}

	async getByListKey(key, values, QueryFlag = QueryFlag.Flag.NONE) {
		const result = null;
		try {
			if (QueryFlag === QueryFlag.Flag.DISABLED) {
				result = await this.model.findAll({ where: { [key]: { [Op.in]: values } } });
			}
			else if (QueryFlag === QueryFlag.Flag.ENABLED) {
				result = await this.model.findAll({ where: { [key]: { [Op.in]: values }, is_disabled: false } });
			}
			else {
				result = await this.model.findAll({ where: { [key]: { [Op.in]: values } } });
			}
		}
		catch (err) {
			console.log(err);
		}
		return result;
	}

	async create(data) {
		try {
			const result = await this.model.create(data);
			return result;
		}
		catch (err) {
			console.log(err);
			return null;
		}
	}
	async createMultiple(data) {
		try {
			const result = await this.model.bulkCreate(data);
			return result;
		}
		catch (err) {
			console.log(err);
			return null;
		}
	}

	async update(id, data) {
		try {
			const result = await this.model.update(data, { where: { id: id } });
			return result;
		}
		catch (err) {
			console.log(err);
			return null;
		}
	}

	async updateMultiple(ids, data) {
		try {
			const result = await this.model.update(data, { where: { id: { [Op.in]: ids } } });
			return result;
		}
		catch (err) {
			console.log(err);
			return null;
		}
	}

	async delete(id) {
		try {
			const result = await this.model.update({ is_disabled: true }, { where: { id: id } });
			return result;
		} catch (error) {
			console.log(error);
			return null;
		}
	}

	async deleteMultiple(ids) {
		try {
			const result = await this.model.update({ is_disabled: true }, { where: { id: { [Op.in]: ids } } });
			return result;
		} catch (error) {
			console.log(error);
			return null;
		}
	}

}

module.exports = BaseService;
