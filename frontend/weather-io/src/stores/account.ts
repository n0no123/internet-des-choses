import { ref } from 'vue'
import { defineStore } from 'pinia'

type account = {
    username: string,
    token: string
}

type sensor = {
    id: number,
    type: 'TemperatureAndHumidity',
    name: string
}

export const useAccountStore = defineStore('account', () => {
    const account = ref<account>({ username: '', token: '' });
    const sensors = ref<Array<sensor>>([]);

    return { account, sensors }
})
