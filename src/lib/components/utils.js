const utils = {
    filterFieldDataTypes: {
        Number: 'number',
        String: 'string',
        Boolean: 'boolean'
    },
    fixedFilterFormat: {
        date: "YYYY-MM-DD",
        datetime: "YYYY-MM-DD hh:mm:ss a",
        dateTimeLocal: "YYYY-MM-DD hh:mm:ss a",
        OverrideDateFormat: "DD-MMM-YYYY"
    },
    t(sentence, i18nNext, options = {}) {
		if (!i18nNext) {
			return sentence;
		}
		if (!sentence) {
			return
		}
		const { t, i18n } = i18nNext;
		if (!(t || i18n)) {
			return sentence;
		}
		const isIE = /*@cc_on!@*/false || !!document.documentMode;
		const isEdge = !isIE && !!window.StyleMedia;

		// Additional condition added for Edge and Firefox as they do not return only en instead return en-IN
		if (i18n?.language === "en" || i18n?.language.split('-')[0] === "en") {
			return t(sentence, options);
		}
		const optionKeys = Object.keys(options);
		let loweredSentence = [];
		// In case of non en language do not lowercase the variable , as lowercase it will result in value not updating in string
		if (optionKeys.length) {
			loweredSentence = sentence.split(" ");
			loweredSentence = loweredSentence.map((item) => {
				if (item.includes("{{") && item.includes("}}") && isEdge) {
					return item;
				} else {
					return item.toLowerCase();
				}
			})
		}
		const tString = loweredSentence.length ? loweredSentence.join(" ") : sentence.toString().toLowerCase();
		const transformed = t(tString, options);
		if (sentence === sentence.toString().toUpperCase()) {
			return transformed.toString().toUpperCase()
		} else if (sentence === sentence.toString().toLowerCase()) {
			return transformed.toString().toLowerCase();
		} else {
			return transformed[0].toUpperCase() + transformed.substring(1)
		}
	},
	isAdminORSuperAdmin(value) {
		return Number(value) === 1;
	},
	/**
	 * Build portal-controller style filter parameters from a "where" array.
	 *
	 * Converts an array of filter descriptors into the backend-expected
	 * query parameter shape:
	 *   filter[<i>][field] = <fieldName>
	 *   filter[<i>][data][type] = <type>
	 *   filter[<i>][data][value] = <value>
	 *
	 * Behavior:
	 * - Iterates the `where` array and only processes entries that have a value:
	 *   - array values must have length > 0
	 *   - non-array values must be truthy
	 * - Uses ele.field as the field name.
	 * - Uses ele.type or defaults to 'string' for the data type.
	 * - Writes results into the provided `filterParams` object (mutates).
	 * - If `where` is falsy or empty, returns an empty object immediately.
	 *
	 * Params:
	 * @param {Array<Object>} where - Array of filter descriptors. Typical shape:
	 *    { fieldName?: string, field?: string, type?: string, value: any }
	 *    (value can be an array or scalar)
	 * @param {Object} [filterParams={}] - Optional object to populate with generated params.
	 *    This object is mutated in-place. Example after call:
	 *      filter[0][field] = 'Status'
	 *      filter[0][data][type] = 'string'
	 *      filter[0][data][value] = 'active'
	 *
	 * Returns:
	 * - undefined (function mutates filterParams).
	 * - Note: when `where` is falsy or empty the function returns an empty object {}.
	 *
	 * Usage:
	 *  const params = {};
	 *  const where = [
	 *    { field: 'Status', type: 'string', value: 'active' },
	 *    { fieldName: 'CreatedOn', type: 'date', value: ['2024-01-01','2024-12-31'] }
	 *  ];
	 *  utils.createFiltersForPortalController(where, params);
	 *  // params now has portal-style filter keys ready to be sent in request
	 * 
	 * Returns:
	 *   undefined if `where` is falsy or empty; otherwise, mutates `filterParams` in place.
	 */
	createFiltersForPortalController: function (where, filterParams = {}) {
		if (!where || !where.length) return;
		where.forEach((ele, index) => {
			if ((Array.isArray(ele.value) && ele.value?.length) || (!Array.isArray(ele.value) && ele.value)) {
				const filterKeyName = `filter[${index}][field]`;
				filterParams[filterKeyName] = ele.field;

				const typeKeyName = `filter[${index}][data][type]`;
				filterParams[typeKeyName] = ele.type || 'string';

				const valueKeyName = `filter[${index}][data][value]`;
				filterParams[valueKeyName] = ele.value;
			}
		});
	},
}

export default utils;