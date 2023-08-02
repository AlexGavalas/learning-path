<script>
    const CELLS_NUM = 100;
    const ROWS = 5;
</script>

<div
    class="wrapper"
    style="--cells: {CELLS_NUM}; --columns: {CELLS_NUM / ROWS}"
>
    {#each Array(CELLS_NUM) as _, idx}
        <div class="item" style="--idx: {idx}"></div>
    {/each}
</div>

<style>
    @property --t {
        syntax: '<number>';
        initial-value: 0;
        inherits: true;
    }

    @property --counter {
        syntax: '<number>';
        initial-value: 0;
        inherits: true;
    }

    @keyframes time {
        100% {
            --t: 30;
        }
    }

    @keyframes incrementCounter {
        100% {
            --counter: 40;
        }
    }

    :root {
        --t: 0;
        --counter: 0;
    }

    .wrapper {
        --item-stagger: 0.1s;
        --total-stagger: calc(var(--cells) * var(--item-stagger));

        display: grid;
        grid-template-columns: repeat(var(--columns), 1fr);
        gap: 10px;
    }

    .item {
        aspect-ratio: 1;
        border-radius: 5px;

        animation:
            30s time infinite linear,
            1000s incrementCounter infinite linear;

        animation-delay: calc(
            -1 * var(--total-stagger) + var(--idx) * var(--item-stagger) - 25s
        );

        animation-play-state: paused;

        --x: calc(0.5 + 0.5 * sin(4.284 * var(--counter)));
        --y: calc(0.5 + 0.5 * sin(7.284 * var(--counter)));
        --z: calc(0.5 + 0.5 * sin(4 * var(--counter) + 2 * var(--t)));
        --a: calc(
            0.5 + 0.5 *
                sin(
                    (0.2 * cos(var(--t) / 100) + 0.8) * 49.123 * var(--counter) +
                        var(--t)
                )
        );

        background: rgba(
            calc(100 + 90 * var(--x)),
            calc(100 + 90 * var(--y)),
            calc(100 + 90 * var(--z)),
            calc(0.3 + var(--a))
        );
    }
</style>
