<script lang="ts">
    import type { HTMLInputAttributes } from 'svelte/elements';

    interface $$Props extends HTMLInputAttributes {
        label: string;
    }

    let instance: HTMLInputElement;

    export let label: $$Props['label'];
    export let value = '';

    export function focus() {
        instance.focus();
    }
</script>

<label class="flex h-full w-full flex-col">
    <span>{label}</span>
    <input
        {...$$restProps}
        bind:value
        bind:this={instance}
        class="h-1/2 rounded border-[1px] border-solid border-light-border bg-transparent pl-2 text-sm dark:border-0 dark:bg-neutral-800 dark:placeholder-gray-300 dark:placeholder-opacity-60"
    />
</label>
