<script lang="ts">
    import { onMount } from 'svelte';
    import Button from '~components/button.svelte';

    interface $$Props {
        src: string;
    }

    export let src = '';

    let videoElement: HTMLVideoElement | null = null;
    let showNativeControls = true;
    let isPlaying = false;
    let progress = 0;
    let duration = 0;

    onMount(() => {
        showNativeControls = false;
    });

    $: duration = videoElement?.duration || 0;

    function togglePlay() {
        if (videoElement) {
            if (isPlaying) {
                videoElement.pause();
            } else {
                videoElement.play();
            }

            isPlaying = !isPlaying;
        }
    }

    function seek(
        event: Event & { currentTarget: EventTarget & HTMLInputElement },
    ) {
        if (videoElement) {
            progress = event.currentTarget?.valueAsNumber;
            videoElement.currentTime = progress;
        }
    }

    function secondsToMinutes(seconds: number) {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = `${Math.floor(seconds % 60)}`.padStart(2, '0');

        return `${minutes}:${remainingSeconds}`;
    }
</script>

<div class="relative grid gap-2">
    <!-- svelte-ignore a11y-media-has-caption -->
    <video
        {src}
        class="rounded-md"
        controls={showNativeControls}
        bind:this={videoElement}
        on:play={() => {
            isPlaying = true;
        }}
        on:pause={() => {
            isPlaying = false;
        }}
        on:timeupdate={(e) => {
            progress = e.currentTarget.currentTime;
        }}
    >
        <!-- TODO: Check a11y with captions -->
        <!-- <track kind="captions" /> -->
    </video>

    {#if !showNativeControls}
        <div class="flex gap-2 w-full">
            <Button on:click={togglePlay} extraClass="w-[15%] justify-center"
                >{isPlaying ? 'Pause' : 'Play'}</Button
            >
            <div class="flex gap-2 items-center w-[85%]">
                <span id="progress-label" class="inline-block w-10 text-right"
                    >{secondsToMinutes(progress)}</span
                >
                <input
                    aria-labelledby="progress-label"
                    type="range"
                    class="w-full dark:accent-dark-primary accent-light-primary cursor-pointer"
                    min={0}
                    max={Math.floor(duration)}
                    bind:value={progress}
                    on:input={seek}
                />
            </div>
        </div>
    {/if}
</div>
