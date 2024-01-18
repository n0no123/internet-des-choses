<script setup lang="ts">
defineProps<{ serialNumber: number }>()

defineEmits(['submit', 'cancel']);
</script>

<template>
    <div class="centered layout">
        <div class="centered flex-v form">
            <h1>Release sensor #{{ serialNumber }}</h1>
            <button class="button" type="button" @click="$emit('submit', serialNumber)">Confirm</button>
            <button class="button" type="button" @click="$emit('cancel')">Cancel</button>
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

    .button {
        background-color: var(--color-tertiary);
        border: none;
        border-radius: 0.3em;
        color: var(--color-on-tertiary);
        cursor: pointer;
        font-weight: bold;
        height: 2.5em;
        margin-top: 2em;
        width: 16em;

        &:hover {
            border: 0.2em solid var(--color-outline);
        }
    }
}
</style>