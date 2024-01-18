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
    <div class="centered layout">
        <div class="centered flex-v form">
            <h1>Sign Up</h1>
            <form class="flex-v">
                <label class="label">Username</label>
                <input class="input" placeholder="username" type="text" v-model="username" />
                <label class="label">Password</label>
                <input class="input" placeholder="password" type="password" v-model="password" />
                <label class="label">Zip Code</label>
                <input class="input" placeholder="zip code" type="text" v-model="zipCode" />
                <button class="button" type="button" @click="signUp(username, password, zipCode)">Sign Up</button>
            </form>
            <RouterLink class="link" to="/sign-in">Already have an account? Sign in!</RouterLink>
        </div>
    </div>
</template>

<style scoped lang="scss">
.layout {
    display: flex;
    height: 100vh;
    width: 100vw;
}

.form {
    background-color: var(--color-primary-container);
    border-radius: 0.3em;
    color: var(--color-on-primary-container);
    height: 24em;
    padding: 1.5em;
    width: 20em;

    .label {
        margin-top: 1em;
    }

    .input {
        background-color: var(--color-secondary-container);
        border: 0.1em solid var(--color-outline);
        border-radius: 0.3em;
        height: 2em;
        width: 16em;
    }

    .button {
        background-color: var(--color-primary);
        border: none;
        border-radius: 0.3em;
        color: var(--color-on-primary);
        cursor: pointer;
        font-weight: bold;
        height: 2.5em;
        margin-top: 2em;
    }

    .link {
        color: var(--color-on-primary-container);
        margin-top: 2em;
    }
}
</style>