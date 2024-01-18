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
        .then(() => router.push({ name: 'home' }))
}
</script>

<template>
    <div class="centered layout">
        <div class="centered flex-v form">
            <h1>Sign In</h1>
            <form class="flex-v">
                <label class="label">Username</label>
                <input class="input" placeholder="username" type="text" v-model="username" />
                <label class="label">Password</label>
                <input class="input" placeholder="password" type="password" v-model="password" />
                <button class="button" type="button" @click="signIn(username, password)">Sign In</button>
            </form>
            <RouterLink class="link" to="/sign-up">Don't have an account yet? Sign up!</RouterLink>
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