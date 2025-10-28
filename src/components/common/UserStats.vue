<template>
  <div class="user-stats">
    <div class="stat">
      <span class="count">{{ formatCount(getFollowers(walletAddress)) }}</span>
      <span class="label">{{ getFollowers(walletAddress) === 1 ? "Follower" : "Followers" }}</span>
    </div>
    <div class="stat">
      <span class="count">{{ formatCount(getFollowing(walletAddress)) }}</span>
      <span class="label">Following</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from "vue";
// import { useUserFollows } from "../../stores/user-follows";

interface Props {
  walletAddress: string;
}

const props = defineProps<Props>();
// const userFollows = useUserFollows();

// Format large numbers (e.g., 1.2K, 1.5M)
function formatCount(count: number): string {
  if (count < 1000) return count.toString();
  if (count < 1000000) return (count / 1000).toFixed(1).replace(".0", "") + "K";
  return (count / 1000000).toFixed(1).replace(".0", "") + "M";
}

// // Expose store computed for template
// const { getFollowers, getFollowing } = userFollows;

// // Load stats on mount
// onMounted(() => {
//   userFollows.loadUserStats(props.walletAddress);
// });
</script>

<style lang="scss" scoped>
.user-stats {
  @include flex-row;
  gap: 1.5rem;

  .stat {
    @include flex-column;
    align-items: center;

    .count {
      font-family: var(--heading-font-family);
      font-style: var(--heading-font-style);
      font-size: 1.2rem;
      font-weight: bold;
      color: var(--white);
    }

    .label {
      font-size: 0.9rem;
      color: var(--gray);
      text-transform: lowercase;
    }
  }
}
</style>
