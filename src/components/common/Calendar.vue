<template>
  <aside class="date-picker" :class="{ expanded }">
    <section class="days" :class="{ visible: showDays }">
      <section class="selected">
        <Button @click="prevMonth"> < </Button>

        <Row>
          <h3 class="month">{{ selectedMonth?.name }}</h3>
          <h3 class="year">{{ selectedYear }}</h3>
        </Row>

        <Button @click="nextMonth"> > </Button>
      </section>
      <header>
        <Button :disabled="true" :square="true">S</Button>
        <Button :disabled="true" :square="true">M</Button>
        <Button :disabled="true" :square="true">T</Button>
        <Button :disabled="true" :square="true">W</Button>
        <Button :disabled="true" :square="true">Th</Button>
        <Button :disabled="true" :square="true">F</Button>
        <Button :disabled="true" :square="true">S</Button>
      </header>
      <Button
        v-for="i in totalDaysInMonth"
        :key="i"
        :square="true"
        :disabled="!isInRange(i)"
        :style="{
          'margin-left': i === 1 ? `calc(${monthStart} * (400px / 7))` : ''
        }"
        @click="selectDay(i - 1)"
        :class="{ active: isActiveDay(i) }">
        {{ i }}
      </Button>
    </section>
  </aside>
</template>

<script setup lang="ts">
import { ref, computed, watch, type Ref } from "vue";
import { addYears, getDaysInMonth, startOfMonth, isAfter, isBefore } from "date-fns";
import { Row, Button } from "@/components";
import { generateMonthMap, type Month, type Months } from "@kaleidosync/util";

const props = withDefaults(
  defineProps<{
    range?: [Date, Date];
    date?: Date;
  }>(),
  {
    range: [new Date(), addYears(new Date(), 1)] as any,
    date: new Date() as any
  }
);

const emit = defineEmits<{
  select: [value: Date];
}>();

watch(
  () => props.date,
  val => update(val)
);

const months: Months = generateMonthMap();
const showDays = ref(true);
const expanded = ref(true);
const selectedYear = ref(props.date.getFullYear());
const selectedMonth: Ref<Month | null> = ref(months[props.date.getMonth()]);
const selectedDay: Ref<number | null> = ref(props.date.getDay());

const totalDaysInMonth = computed(() => {
  const i = selectedMonth?.value?.index;
  if (typeof i !== "number") return 0;
  return getDaysInMonth(new Date(selectedYear.value, i));
});

const monthStart = computed(() => {
  const i = selectedMonth?.value?.index;
  if (typeof i !== "number") return 0;
  return startOfMonth(new Date(selectedYear.value, i)).getDay();
});

function update(date: Date) {
  selectedYear.value = date.getFullYear();
  selectedMonth.value = months[date.getMonth()];
  selectedDay.value = date.getDay() - 1;
}

function selectMonth(i: number) {
  selectedMonth.value = months[i];
  showDays.value = true;
}

function prevMonth() {
  if (!selectedMonth.value) return;
  selectMonth(Math.max(selectedMonth.value.index - 1, 0));
}

function nextMonth() {
  if (!selectedMonth.value) return;
  selectMonth(Math.min(selectedMonth.value.index + 1, 11));
}

function selectDay(i: number) {
  if (!selectedYear.value || !selectedMonth.value) return;
  selectedDay.value = i;
  const date = `${selectedMonth.value.index + 1}/${selectedDay.value + 1}/${selectedYear.value}`;
  emit("select", new Date(date));
}

function isInRange(i: number) {
  if (!selectedYear.value || !selectedMonth.value) return false;
  const date = new Date(`${selectedMonth.value.index + 1}/${i}/${selectedYear.value}`);
  return !(isAfter(date, props.range[1]) || isBefore(date, props.range[0]));
}

function isActiveDay(i: number) {
  if (!selectedYear.value || !selectedMonth.value) return false;
  const value = props.date.valueOf();
  const date = new Date(`${selectedMonth.value.index + 1}/${i}/${selectedYear.value}`).valueOf();
  return value === date;
}
</script>

<style lang="scss" scoped>
$size: 400px;

.date-picker {
  @include box(0.5, 0.5);
  border-radius: 2rem;

  button {
    box-shadow: none;
  }

  &.expanded {
    transform: translateY(0%);
  }
}

button {
  @include size(calc(#{$size} / 7), 3rem);
  transition: none;
  background-color: transparent;
  border-radius: 0;
  padding: 0;
}

.days {
  display: flex;
  width: $size;
  flex-wrap: wrap;

  button {
    &:disabled {
      opacity: 0.2;
    }
  }

  header {
    width: #{$size};
    display: flex;
  }

  header button {
    opacity: 0.5 !important;
    flex-grow: 0;
  }
}

.selected {
  @include flex-row(space-between, center);
  @include box(0, 0.5);
  width: 100%;

  .month {
    text-transform: uppercase;
  }
}
</style>
