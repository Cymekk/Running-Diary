import { defineStore } from 'pinia'

export const useStoreNotes = defineStore('storeNotes', {
	state: () => {
		return {
			notes: [],
		}
	},
	actions: {},
	getters: {},
})
