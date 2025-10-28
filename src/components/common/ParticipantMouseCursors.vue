<template>
  <div class="participant-cursors">
    <div
      v-for="cursor in cursors"
      :key="cursor.walletAddress"
      class="cursor"
      :style="{
        transform: `translate(${cursor.x - scrollX}px, ${cursor.y - scrollY}px)`,
        '--cursor-color': getCursorColor(cursor.walletAddress)
      }">
      <!-- Cursor SVG -->
      <svg class="cursor-icon" width="20" height="20" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
        <path d="M2 2L18 8L10 10L8 18L2 2Z" :fill="getCursorColor(cursor.walletAddress)" stroke="white" stroke-width="1" />
      </svg>

      <!-- User label -->
      <div class="cursor-label">
        {{ getDisplayName(cursor.walletAddress) }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";

interface ProjectCursor {
  walletAddress: string;
  x: number;
  y: number;
  timestamp: number;
}

const props = defineProps<{
  cursors: ProjectCursor[];
  scrollX?: number;
  scrollY?: number;
}>();

// Default scroll values
const scrollX = computed(() => props.scrollX || 0);
const scrollY = computed(() => props.scrollY || 0);

// Generate consistent color for each wallet address
const getCursorColor = (walletAddress: string): string => {
  const colors = [
    "#FF6B35", // Orange
    "#8B5CF6", // Purple
    "#10B981", // Emerald
    "#3B82F6", // Blue
    "#EF4444", // Red
    "#F59E0B", // Amber
    "#06B6D4", // Cyan
    "#EC4899", // Pink
    "#84CC16", // Lime
    "#F97316", // Orange-600
    "#A855F7", // Violet
    "#059669" // Emerald-600
  ];

  // Create hash from wallet address
  let hash = 0;
  for (let i = 0; i < walletAddress.length; i++) {
    const char = walletAddress.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash; // Convert to 32-bit integer
  }

  return colors[Math.abs(hash) % colors.length];
};

// Get display name from wallet address
const getDisplayName = (walletAddress: string): string => {
  if (walletAddress.startsWith("user_")) {
    return `Guest ${walletAddress.slice(-4)}`;
  }

  if (walletAddress.startsWith("0x")) {
    return `${walletAddress.slice(0, 6)}...${walletAddress.slice(-4)}`;
  }

  return walletAddress.slice(0, 10);
};
</script>

<style lang="scss" scoped>
.participant-cursors {
  @include position(fixed, 0 null null 0);
  @include size(100vw, 100vh);
  pointer-events: none;
  z-index: 50;
  overflow: hidden;
}

.cursor {
  @include position(absolute, 0 null null 0);
  pointer-events: none;
  transition: transform 0.1s ease-out;

  .cursor-icon {
    filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.2));
  }

  .cursor-label {
    position: absolute;
    top: 22px;
    left: 8px;
    background: var(--cursor-color);
    color: white;
    padding: 0.25rem 0.5rem;
    border-radius: 0.375rem;
    font-size: 0.75rem;
    font-weight: 600;
    white-space: nowrap;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);

    // Arrow pointing to cursor
    &::before {
      content: "";
      position: absolute;
      top: -4px;
      left: 8px;
      width: 0;
      height: 0;
      border-left: 4px solid transparent;
      border-right: 4px solid transparent;
      border-bottom: 4px solid var(--cursor-color);
    }
  }
}
</style>
