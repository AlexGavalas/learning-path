<script lang="ts">
    import type { HTMLButtonAttributes } from 'svelte/elements';

    type ButtonVariant = 'wrapper' | 'default';

    interface $$Props extends HTMLButtonAttributes {
        variant?: ButtonVariant;
        extraClass?: string;
    }

    const bgClassNamesPerVariant: Record<ButtonVariant, string> = {
        default:
            'bg-slate-300 hover:bg-slate-300/75 dark:bg-slate-600 dark:hover:bg-slate-600/75',
        wrapper: 'bg-transparent hover:bg-slate-300 dark:hover:bg-slate-600',
    };

    export let variant: ButtonVariant = 'default';
    export let extraClass = '';

    let bgClass = bgClassNamesPerVariant[variant];
</script>

<button
    {...$$restProps}
    on:click
    class={`flex items-center rounded border-0 p-2 ${bgClass} ${extraClass}`}
>
    <slot />
</button>
