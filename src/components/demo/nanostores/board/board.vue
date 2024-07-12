<script setup lang="ts">
import { useStore } from '@nanostores/vue';

import * as cn from './board.css';
import { BOARD } from './constants';
import { $activeCell, isCellVisible } from './store';

const { offset } = defineProps<{ offset: number }>();

const cell = useStore($activeCell);
</script>

<template>
    <div :class="cn.container">
        <span :class="cn.title" style="color: #42b883">Vue</span>
        <div :class="cn.board">
            <div v-for="column in BOARD" :class="cn.column">
                <div v-for="[col, row] in column">
                    <div :class="cn.cell">
                        <svg
                            v-if="isCellVisible({ cell, col, offset, row })"
                            width="100%"
                            height="100%"
                        >
                            <circle fill="red" cy="50%" cx="50%" r="5" />
                        </svg>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
