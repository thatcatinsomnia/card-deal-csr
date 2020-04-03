<template>
  <div class="rule">
    <label
      class="rule__label"
      v-for="i in playersChoice"
      :key="i"
      :class="{ active: playersCount === i }"
      :style="{ pointerEvents: isGameStart ? 'none' : 'auto' }"
    >
      <input
        class="rule__input"
        type="radio"
        name="persons-radio"
        :value="i"
        v-model="playersCount"
      />
      <span class="rule__text">{{ i }}人</span>
    </label>
  </div>
</template>

<script>
export default {
  props: ["isGameStart", "isReset"],
  data() {
    return {
      playersChoice: [1, 2, 4],
      playersCount: 1
    };
  },
  watch: {
    playersCount(newValue) {
      this.$emit("onUpdatePlayersCount", newValue);
    },
    isReset(newValue) {
      if (newValue) {
        this.playersCount = 1;
      }
    }
  }
};
</script>

<style lang="scss">
.rule {
  display: flex;
  align-items: center;

  &__label {
    cursor: pointer;
    margin-right: 1rem;
  }

  &__input {
    display: none;
  }

  &__text {
    display: block;
    padding: 0.5rem 1.55rem;
    color: #fff;
    user-select: none;
  }
}

.active {
  background: rgb(218, 191, 41);
}
</style>
