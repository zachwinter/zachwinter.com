<template>
  <Up
    :visible="!navigation.disabled && !navigation.navigating && navigation.index !== 0"
    @click="() => navigation.index--"
  />

  <Down
    :visible="!navigation.disabled && !navigation.navigating && navigation.index !== 3"
    @click="() => navigation.index++"
  />
</template>

<script setup lang="ts">
const navigation = useNavigation()
</script>
