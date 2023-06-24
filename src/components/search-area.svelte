<script lang="ts">
    import { onDestroy, onMount } from 'svelte';

    import Button from '~components/button.svelte';
    import Input from '~components/input.svelte';
    import Loader from '~components/loader.svelte';
    import { QUERY_FIELD_NAME } from '~constants';

    interface $$Props {
        q: string;
    }

    export let q: $$Props['q'];

    let inputElement: any;
    let query = q;
    let loading = false;

    const keyPressHandler = (e: KeyboardEvent) => {
        if (e.key === '/') {
            e.stopImmediatePropagation();
            inputElement.focus();
        }
    };

    onMount(() => {
        typeof document !== 'undefined' &&
            document.addEventListener('keyup', keyPressHandler);
    });

    onDestroy(() => {
        typeof document !== 'undefined' &&
            document.removeEventListener('keyup', keyPressHandler);
    });

    const onSubmit = (e: SubmitEvent) => {
        e.preventDefault();

        loading = true;

        const url = new URL(location.href);

        if (query.length > 0) {
            url.searchParams.set(QUERY_FIELD_NAME, query);
        } else {
            url.searchParams.delete(QUERY_FIELD_NAME);
        }

        window.location.href = url.toString();
    };
</script>

<form on:submit={onSubmit} class="relative flex h-16 items-center">
    <Input
        bind:this={inputElement}
        bind:value={query}
        label="Search notes"
        name={QUERY_FIELD_NAME}
        autocomplete="off"
        placeholder="Type here"
    />
    <div class="absolute bottom-0 right-0 flex h-1/2 gap-2 p-1 text-sm">
        <Button>Search</Button>
    </div>
    {#if loading}
        <Loader />
    {/if}
</form>
