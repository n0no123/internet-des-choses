<script setup lang="ts">
import router from '@/router';
import { ref } from 'vue';

const username = ref<string>('');
const password = ref<string>('');
const zipCode = ref<string>('');

const signUp = async (username: string, password: string, zipCode: string) => {
    await fetch(`${import.meta.env.VITE_API_URL}/user`,
        {
            method: "PUT",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username: username, password: password, zipcode: zipCode })
        }
    )
        .then(response => { if (response.ok) return response.json() })
        .then(() => router.push({ name: 'sign-in' }))
}
</script>

<template>
    <div class="flex-v centered card">
        <h1>Sign Up</h1>
        <form action="/user" method="get" class="flex-v">
            <label>Username</label>
            <input type="text" v-model="username" />
            <label class="label">Password</label>
            <input type="password" v-model="password" />
            <label class="label">Zip Code</label>
            <input type="text" v-model="zipCode" />
            <button class="button" type="button" @click="signUp(username, password, zipCode)">Sign Up</button>
        </form>
        <RouterLink to="/sign-in">Already have an account? Sign in!</RouterLink>
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