class DefaultResponse {
	constructor(data, message) {
		this.message = message;
		if (data != null) {
			if (data.is_deleted != null) {
				delete data.is_deleted;
			}
			if (data.is_disabled != null) {
				delete data.is_disabled;
			}
		}
		this.data = data;
	}
}

module.exports = DefaultResponse;
