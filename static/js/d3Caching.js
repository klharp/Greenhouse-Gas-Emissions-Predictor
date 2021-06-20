console.log("d3Cashing is loaded");

(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
		typeof define === 'function' && define.amd ? define(['exports'], factory) :
			(global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.kerry = global.kerry || {}));
}(this, (function (exports) {
	'use strict';

	const urlMap = new Map();

	/**
	 * Gets a TSV file that is cached.
	 * @param {string} url - Url pointing to a TSV file
	 * @param {callback} callback - Same function you would pass into the .then for d3.tsv
	 */
	exports.tsv = function (url, callback) {
		getValue(d3.tsv, url, callback);
	}

	/**
	 * Gets a CSV file that is cached.
	 * @param {string} url - Url pointing to a CSV file
	 * @param {callback} callback - Same function you would pass into the .then for d3.csv
	 */
	exports.csv = function (url, callback) {
		getValue(d3.csv, url, callback);
	}

	/**
	 * Gets a JSON file that is cached.
	 * @param {string} url - Url pointing to a JSON file
	 * @param {callback} callback - Same function you would pass into the .then for d3.json
	 */
	exports.json = function (url, callback) {
		getValue(d3.json, url, callback);
	}

	/**
	 * Gets a text file that is cached.
	 * @param {string} url - Url pointing to a text file
	 * @param {callback} callback - Same function you would pass into the .then for d3.text
	 */
	exports.text = function (url, callback) {
		getValue(d3.text, url, callback);
	}

	function getValue(d3Func, url, callback) {
		const WAITING_STATUS = 0;
		const COMPLETE_STATUS = 1;
		let cached = urlMap.get(url);

		//has not seen value before
		if (cached == undefined) {
			let functionQueue = [callback];
			urlMap.set(url, {
				status: WAITING_STATUS,
				queue: functionQueue,
			});

			//execute request and handle the queue
			d3Func(url).then(data => {
				functionQueue.forEach(callback => callback(data));
				urlMap.set(url, {
					status: COMPLETE_STATUS,
					data: data,
				});
			});
		}

		else {
			switch (cached.status) {
				//add to queue when still waiting
				case WAITING_STATUS:
					cached.queue.push(callback);
					break;
				//call if data is already found
				case COMPLETE_STATUS:
					callback(cached.data);
					break;
				default:
					throw "Invalid cache status";
			}
		}
	}
})));