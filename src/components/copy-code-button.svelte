<script lang="ts">
    import { onMount } from 'svelte';

    import Button from './button.svelte';

    interface $$Props {
        prefix?: string;
    }

    export let prefix = '';

    let visible = false;
    let contentElement: HTMLDivElement | null = null;

    const copyCode = () => {
        const nextCodeSnippet = contentElement?.textContent;

        if (nextCodeSnippet) {
            navigator.clipboard.writeText(nextCodeSnippet);
        }
    };

    onMount(() => {
        visible = true;
    });
</script>

{#if visible}
    {#if prefix}
        {prefix} -
    {/if}
    <Button on:click={copyCode} extraClass="!inline-block !p-0 !px-1"
        >Copy to clipboard</Button
    >
{:else}
    {prefix}
{/if}

<div bind:this={contentElement}>
    <slot />
</div>
