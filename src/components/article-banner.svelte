<script>
    const CELLS_NUM = 125;
    const ROWS = 5;
</script>

<div
    class="wrapper"
    style="--cells: {CELLS_NUM}; --columns: {CELLS_NUM / ROWS}"
>
    {#each Array(CELLS_NUM) as _, idx}
        <div
            class="item bg-light-primary dark:bg-dark-primary"
            style="--idx: {idx}"
        ></div>
    {/each}
</div>

<style>
    @keyframes blink {
        0%,
        100% {
            opacity: 0.75;
        }
        50% {
            opacity: 0.25;
        }
    }

    .wrapper {
        --item-stagger: 0.1s;
        --total-stagger: calc(var(--cells) * var(--item-stagger));

        display: grid;
        grid-template-columns: repeat(var(--columns), 1fr);
        gap: 0.3rem;
    }

    .item {
        aspect-ratio: 1;
        border-radius: 20%;
        animation: 3s blink infinite alternate ease-in-out;

        animation-delay: calc(
            -1 * var(--total-stagger) + var(--idx) * var(--item-stagger)
        );
    }
</style>
