<script setup lang="ts">
import router from '@/router';
import { useAccountStore } from '@/stores/account';
import { ref } from 'vue';

const store = useAccountStore();

const username = ref<string>('');
const password = ref<string>('');

const signIn = async (username: string, password: string) => {
    await fetch(`${import.meta.env.VITE_API_URL}/user`,
        {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username: username, password: password })
        }
    )
        .then(response => { if (response.ok) return response.json() })
        .then(json => { store.account = { username: username, token: json.token } })
        .then(() => router.push({name: 'home'}))
}
</script>

<template>
    <div class="flex-v centered card">
        <h1>Sign In</h1>
        <form action="/user" method="get" class="flex-v">
            <label for="name">Username</label>
            <input type="text" v-model="username" />
            <label class="label" for="mail">Password</label>
            <input type="password" v-model="password" />
            <button class="button" type="button" @click="signIn(username, password)">Sign In</button>
        </form>
        <RouterLink to="/sign-up">Don't have an account yet? Sign up!</RouterLink>
    </div>
</template>

<style lang="scss">
.card {
    background-color: var(--color-neutral-white);
    border-radius: 1em;
    gap: 1em;
    margin: auto;
    max-width: fit-content;
    padding: 2em;

    .label {
        margin-top: 1em;
    }

    .button {
        margin-top: 2em;
    }
}
</style>