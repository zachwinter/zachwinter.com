<template>
  <View>
    <WorkItem v-for="(item, i) in workItems" :key="i" :item="item" />
  </View>
</template>

<script setup lang="ts">
const workItems = ref([
  {
    title: '5HT',
    description:
      'A WebGL music visualizer that integrates with Spotify, Audius, or your microphone.',
    link: 'https://www.kaleidosync.com',
    github: 'https://github.com/zachwinter/kaleidosync',
    tags: [
      'UI Design',
      'Vue',
      'TypeScript',
      'Sass',
      'WebGL',
      'GLSL',
      'Web Audio',
      'Vite',
      'Node',
      'Express',
      'MongoDB',
      'CI / CD'
    ],
    images: [
      '/screenshots/5ht.01.jpg',
      '/screenshots/5ht.02.jpg',
      '/screenshots/5ht.03.jpg',
      '/screenshots/5ht.04.jpg'
    ]
  },

  {
    title: 'COVID-USA',
    description:
      'An interactive timeseries visualizing the spread of COVID-19 through the United States.',
    link: 'https://covid-usa.herokuapp.com',
    github: 'https://github.com/zachwinter/COVID-USA',
    tags: [
      'UI Design',
      'D3',
      'Vue',
      'TypeScript',
      'Sass',
      '2D Canvas',
      'Vite',
      'Node',
      'Express',
      'CI / CD'
    ],
    features: [
      'Novel. Visualize derived county-level active cases (per capita) on any day between Jan. 22, 2020 and Mar. 9, 2023.',
      'Fast. Thanks to instancing techniques and a hardware-accelerated ctx.drawImage(), rasterization of the map and datapoints only happens once – giving you a fluid, jank-free experience even when zooming or panning.',
      'Compare. Click on any county to open a chart visualizing its data over time. Select multiple counties simultaneously and compare them within a shared, synchronized date range.',
      'Mobile-friendly. Full touch gesture interactions for both map &amp; charts.',
      'Share. Copy a URL to the clipboard linking directly to the visualization on a selected day.'
    ],
    images: ['/screenshots/covid.01.png', '/screenshots/covid.02.png', '/screenshots/covid.03.png']
  },

  {
    title: 'MSF',
    description:
      'Corporate website & application portal for a non-profit recovery housing program.',
    link: 'https://www.mindfulservice.org',
    tags: [
      'UI Design',
      'Vue',
      'JavaScript',
      'Sass',
      'WebGL',
      'GLSL',
      'Webpack',
      'Node',
      'Express',
      'MongoDB',
      'CI / CD'
    ],
    images: [
      '/screenshots/msf.01.jpg',
      '/screenshots/msf.02.jpg',
      '/screenshots/msf.03.jpg',
      '/screenshots/msf.04.jpg'
    ]
  }
])
</script>
