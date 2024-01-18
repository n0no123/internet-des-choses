<script setup lang="ts">
import { ref } from 'vue';

defineEmits(['submit', 'cancel']);

const serialNumber = ref<number>();
</script>

<template>
    <div class="centered layout">
        <div class="centered flex-v form">
            <h1>Claim sensor</h1>
            <form class="flex-v">
                <label class="label">Serial Number</label>
                <input class="input" placeholder="serial number" type="text" v-model="serialNumber" />
                <button class="button" type="button" @click="$emit('submit', serialNumber)">Submit</button>
                <button class="button" type="button" @click="$emit('cancel')">Cancel</button>
            </form>
        </div>
    </div>
</template>

<style scoped lang="scss">
.layout {
    bottom: 0;
    display: flex;
    height: 100vh;
    left: 0;
    position: fixed;
    right: 0;
    top: 0;
    width: 100vw;
    z-index: 1;
}

.form {
    background-color: var(--color-secondary-container);
    border-radius: 0.3em;
    color: var(--color-on-secondary-container);
    height: 24em;
    padding: 1.5em;
    width: 20em;

    .label {
        margin-top: 1em;
    }

    .input {
        background-color: var(--color-tertiary-container);
        border: 0.1em solid var(--color-outline);
        border-radius: 0.3em;
        height: 2em;
        width: 16em;
    }

    .button {
        background-color: var(--color-tertiary);
        border: none;
        border-radius: 0.3em;
        color: var(--color-on-tertiary);
        cursor: pointer;
        font-weight: bold;
        height: 2.5em;
        margin-top: 2em;

        &:hover {
            border: 0.2em solid var(--color-outline);
        }
    }
}
</style>