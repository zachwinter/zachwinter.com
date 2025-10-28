<template>
  <canvas ref="canvas" />
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted, onBeforeUnmount } from "vue";
import { interpolateNumber, interpolateRgb } from "d3-interpolate";
import { useRAF, useViewport } from "@/stores";
import { useCanvas2d, useAnimation } from "@/composables";
import { ease } from "@/constants/easing";

const props = defineProps<{
  volume?: number;
  stream?: number;
}>();

const canvas = ref();
const raf = useRAF();
const viewport = useViewport();
const artboard = computed(() => viewport.artboard);
const { draw, clear, normalize, circle } = useCanvas2d(canvas, artboard);
const clicked = ref(false);
const radius = ref(10);
const box = ref({
  target: null,
  x: -1,
  y: -1,
  width: 0,
  height: 0
});

const orbs = ref<any[]>([]);
const ORB_COUNT = 40;
const ORB_RADIUS = ref(3);
const borderRadius = ref(10);
const cursorColor = ref("#ff0b5c");
const pathPadding = ref(10);
const spotlightMode = ref(true);
const overlayOpacity = ref(0);

let fromRadius = radius.value;
let fromOrbRadius = ORB_RADIUS.value;
let fromPathPadding = pathPadding.value;

watch(
  () => clicked.value,
  val => {
    if (val) {
      fromRadius = radius.value;
      fromOrbRadius = ORB_RADIUS.value;
      fromPathPadding = pathPadding.value;
      const iR = interpolateNumber(radius.value, radius.value * 0.9);
      const iP = interpolateNumber(pathPadding.value, pathPadding.value * 2);
      const iOR = interpolateNumber(ORB_RADIUS.value, ORB_RADIUS.value * 2);
      raf.remove("clicked");
      raf.add(
        (now, progress) => {
          radius.value = iR(progress);
          pathPadding.value = iP(progress);
          ORB_RADIUS.value = iOR(progress);
        },
        {
          duration: 120,
          id: "clicked"
        }
      );
    } else {
      const iR = interpolateNumber(radius.value, fromRadius);
      const iP = interpolateNumber(pathPadding.value, fromPathPadding);
      const iOR = interpolateNumber(ORB_RADIUS.value, fromOrbRadius);
      raf.remove("clicked");
      raf.add(
        (now, progress) => {
          radius.value = iR(progress);
          pathPadding.value = iP(progress);
          ORB_RADIUS.value = iOR(progress);
        },
        {
          duration: 120,
          id: "clicked"
        }
      );
    }
  }
);

// Detect the border radius of an element
function detectBorderRadius(element: HTMLElement) {
  if (!element) return 10;
  const style = window.getComputedStyle(element);
  const radiusStr = style.borderRadius;
  if (radiusStr && radiusStr !== "0px") {
    // Parse the border radius - handle cases like '20px' or '20%'
    const radius = parseFloat(radiusStr);
    return isNaN(radius) ? 16 : radius;
  }
  // Default fallback
  return 16;
}

// Generate points along a rounded rectangle path
function generatePathPoints(x: number, y: number, width: number, height: number, cornerRadius: number, numPoints: number) {
  const points = [];
  const cr = Math.min(cornerRadius, width / 2, height / 2);

  // Function to add points along a quarter circle (corner)
  const addCornerPoints = (centerX: number, centerY: number, startAngle: number, pointsPerCorner: number) => {
    for (let i = 0; i <= pointsPerCorner; i++) {
      const angle = startAngle + (i / pointsPerCorner) * (Math.PI / 2);
      const pointX = centerX + cr * Math.cos(angle);
      const pointY = centerY + cr * Math.sin(angle);
      points.push({ x: pointX, y: pointY });
    }
  };

  // Calculate points per segment based on perimeter proportion
  const perimeter = 1 * (width + height) - 4 * (cr - (cr * Math.PI) / 2);
  const cornerPerimeter = (cr * Math.PI) / 2;

  // Points for each corner and straight segment
  const pointsPerCorner = Math.floor(numPoints * (cornerPerimeter / perimeter));
  const remainingPoints = numPoints - pointsPerCorner * 4;
  const pointsPerStraight = Math.floor(remainingPoints / 4);

  // Top right corner
  addCornerPoints(x + width - cr, y + cr, -Math.PI / 2, pointsPerCorner);

  // Top straight
  const topStep = (width - 2 * cr) / pointsPerStraight;
  for (let i = 1; i <= pointsPerStraight; i++) {
    points.push({ x: x + width - cr - i * topStep, y: y });
  }

  // Top left corner
  addCornerPoints(x + cr, y + cr, Math.PI, pointsPerCorner);

  // Left straight
  const leftStep = (height - 2 * cr) / pointsPerStraight;
  for (let i = 1; i <= pointsPerStraight; i++) {
    points.push({ x: x, y: y + cr + i * leftStep });
  }

  // Bottom left corner
  addCornerPoints(x + cr, y + height - cr, Math.PI / 2, pointsPerCorner);

  // Bottom straight
  const bottomStep = (width - 2 * cr) / pointsPerStraight;
  for (let i = 1; i <= pointsPerStraight; i++) {
    points.push({ x: x + cr + i * bottomStep, y: y + height });
  }

  // Bottom right corner
  addCornerPoints(x + width - cr, y + height - cr, 0, pointsPerCorner);

  // Right straight
  const rightStep = (height - 2 * cr) / pointsPerStraight;
  for (let i = 1; i <= pointsPerStraight; i++) {
    points.push({ x: x + width, y: y + height - cr - i * rightStep });
  }

  return points;
}

// Create orbs when hovering over a data-dots element
function createOrbs() {
  orbs.value = [];

  if (box.value.target) {
    // Detect the border radius of the element
    const detectedRadius = detectBorderRadius(box.value.target);
    borderRadius.value = detectedRadius;

    // Generate path points along the rounded rectangle
    const pathPoints = generatePathPoints(box.value.x, box.value.y, box.value.width, box.value.height, borderRadius.value, ORB_COUNT);

    // Create orbs at each path point
    for (let i = 0; i < pathPoints.length; i++) {
      const point = pathPoints[i];
      const orbitSpeed = 0.0001 + Math.random() * 0.01;
      const orbRadius = ORB_RADIUS.value * (Math.random() * 2.25);

      orbs.value.push({
        x: point.x,
        y: point.y,
        pathIndex: i,
        totalPoints: pathPoints.length,
        orbitSpeed,
        radius: 0,
        targetRadius: orbRadius,
        born: window.performance.now(),
        iR: interpolateNumber(0, orbRadius),
        color: Math.round(Math.random()) ? "#f764f7" : "#ff0b5c"
      });
    }
  }
}

function mouseover(e: any) {
  if (typeof e.target.dataset.dots !== "undefined") {
    const { x, y, width, height } = e.target.getBoundingClientRect();

    box.value = {
      target: e.target,
      x: x - pathPadding.value / 2,
      y: y - pathPadding.value / 2,
      width: width + pathPadding.value,
      height: height + pathPadding.value
    };
    fromRadius = radius.value;
    fromPathPadding = pathPadding.value;

    const iO = interpolateNumber(overlayOpacity.value, 0.5);
    const iR = interpolateNumber(radius.value, 150);
    const iP = interpolateNumber(pathPadding.value, 100);
    const iS = interpolateRgb("#ff0b5c", "#fff");
    raf.remove("clicked");
    raf.add(
      (now, progress) => {
        overlayOpacity.value = iO(progress);
        cursorColor.value = iS(progress);
        pathPadding.value = iP(progress);
        radius.value = iR(progress);
      },
      {
        duration: 150,
        id: "clicked"
      }
    );

    createOrbs();
  }
}

function mouseout(e: any) {
  if (typeof e.target.dataset.dots !== "undefined") {
    box.value = {
      target: null,
      x: -1,
      y: -1,
      width: 0,
      height: 0
    };

    const iR = interpolateNumber(radius.value, fromRadius);
    const iS = interpolateRgb("#fff", "#ff0b5c");
    const iP = interpolateNumber(pathPadding.value, fromPathPadding);
    const iO = interpolateNumber(overlayOpacity.value, 0);
    raf.remove("clicked");
    raf.add(
      (now, progress) => {
        cursorColor.value = iS(progress);
        radius.value = iR(progress);
        pathPadding.value = iP(progress);
        overlayOpacity.value = iO(progress);
      },
      {
        duration: 300,
        id: "clicked"
      }
    );
  }
}

function mousedown(e: any) {
  clicked.value = true;
}

function mouseup(e: any) {
  clicked.value = false;
}

function drawSpotlight(ctx: CanvasRenderingContext2D, x: number, y: number, radius: number) {
  // Save the current canvas state
  ctx.save();

  // Create a path for the entire canvas
  ctx.beginPath();
  ctx.rect(0, 0, ctx.canvas.width, ctx.canvas.height);

  // Create a circular path for the cutout
  ctx.arc(x, y, radius, 0, Math.PI * 2, true);

  // Set the "hole" using the 'evenodd' fill rule
  ctx.fill("evenodd");

  // Restore canvas state
  ctx.restore();
}

useAnimation(_now => {
  const now = props.stream || _now;

  clear();
  normalize();
  draw(ctx => {
    const [x, y] = viewport.mouse;

    // Draw the main cursor circle
    circle({
      x,
      y,
      radius: radius.value,
      lineWidth: 1,
      strokeStyle: cursorColor.value
    });

    // Draw and update orbiting particles
    if (box.value.target && orbs.value.length > 0) {
      // Generate path points for the current frame
      const pathPoints = generatePathPoints(
        box.value.x,
        box.value.y,
        box.value.width,
        box.value.height,
        borderRadius.value,
        orbs.value.length
      );

      orbs.value.forEach(orb => {
        // Update orb position along the path
        orb.pathIndex = (orb.pathIndex + orb.orbitSpeed * (now / 2000)) % orb.totalPoints;
        const pointIndex = Math.floor(orb.pathIndex);
        const nextPointIndex = (pointIndex + 1) % orb.totalPoints;

        // Interpolate between points for smoother movement
        const t = orb.pathIndex - pointIndex;
        const currentPoint = pathPoints[pointIndex];
        const nextPoint = pathPoints[nextPointIndex];

        orb.x = currentPoint.x * (1 - t) + nextPoint.x * t;
        orb.y = currentPoint.y * (1 - t) + nextPoint.y * t;

        const radius = orb.iR(ease(clamp((now - orb.born) / 200))) * (props.volume || 1);

        // Draw the orb
        circle({
          x: orb.x,
          y: orb.y,
          radius,
          fillStyle: orb.color
        });
      });
    }

    // If spotlight mode is enabled, draw the dark overlay with circular cutout
    if (spotlightMode.value) {
      // Set the globalCompositeOperation to "source-over" (default)
      ctx.globalCompositeOperation = "source-over";

      // Set the fill color for the overlay (black with opacity)
      ctx.fillStyle = `rgba(0, 0, 0, ${overlayOpacity.value})`;

      // Draw the spotlight effect
      drawSpotlight(ctx, x, y, radius.value);
    }
  });
});

onMounted(() => {
  document.body.addEventListener("mouseout", mouseout);
  document.body.addEventListener("mousedown", mousedown);
  document.body.addEventListener("mouseup", mouseup);
  document.body.addEventListener("mouseover", mouseover);
});

onBeforeUnmount(() => {
  document.body.removeEventListener("mouseup", mouseup);
  document.body.removeEventListener("mousedown", mousedown);
  document.body.removeEventListener("mouseover", mouseover);
  document.body.removeEventListener("mouseout", mouseout);
});
</script>

<style lang="scss" scoped>
canvas {
  @include position(fixed, 0 0 0 0, 1100);
  pointer-events: none;
}
</style>
