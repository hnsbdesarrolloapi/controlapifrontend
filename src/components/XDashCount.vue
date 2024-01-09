<template>
  <q-card flat :style="{'background-color': bgColor, 'color': textColor}">
    <q-card-section>
      <div class="flex justify-between items-center">
        <div class="label">{{ label }}</div><div class="count">{{ count }}</div>
      </div>
    </q-card-section>
  </q-card>
</template>

<style lang="scss" scoped>
.q-card {
  border-radius: 4px;
  .label {
    font-weight: 500;
    font-size: 15px;
  }
  .count {
    font-size: 36px;
  }
}
</style>

<script>
export default {
  name: 'XDashCount',
  props: {
    label: {
      type: String,
      required: true,
    },
    count: {
      type: Number,
      required: true,
    },
    bgColor: {
      type: String,
      default: '#fff',
    },
    textColor: {
      type: String,
      default: '#fff',
    },
  }
}
</script>
