<template>
  <div class="options">
    <label
      class="options__label"
      v-for="i in playersChoice"
      :key="i"
      :class="{
        active: playersCount === i,
        disabled: isGameStart && i !== playersCount
      }"
      :style="{ pointerEvents: isGameStart ? 'none' : 'auto' }"
    >
      <input
        class="options__input"
        type="radio"
        name="persons-radio"
        :value="i"
        v-model="playersCount"
      />
      <span class="options__text">{{ i }}人</span>
    </label>
  </div>
</template>

<script>
import { eventBus } from "@/main";

export default {
  name: "GameOptions",
  props: ["isGameStart"],
  data() {
    return {
      playersChoice: [1, 2, 4],
      playersCount: 1
    };
  },
  watch: {
    playersCount(count) {
      this.$emit("updatePlayersCount", count);
    }
  },
  created() {
    eventBus.$on("resetGame", () => {
      this.playersCount = 1;
    });
  }
};
</script>

<style lang="scss">
.options {
  display: flex;
  align-items: center;

  @include respond(tab-port) {
    flex: 0 0 100%;
    margin-bottom: 0.5rem;
    justify-content: center;
  }

  &__label {
    cursor: pointer;
    border: 1px solid #fff;
    color: #fff;
    outline: none;
    background: none;

    &:not(:last-of-type) {
      margin-right: 1rem;
    }
  }

  &__label:last-of-type {
    margin-right: 0;
  }

  &__input {
    display: none;
  }

  &__text {
    padding: 0.3em 1.5em;
    font-size: 1rem;
    display: block;
    color: #fff;
    user-select: none;
  }
}

.active {
  background: $color-yellow;
}
</style>
