<template>
  <div class="cta">
    <button
      class="cta__button cta__button--shuffle"
      @click="$emit('shuffleDeck')"
      :class="{ disabled: isGameStart }"
      :disabled="isGameStart"
    >
      洗牌
    </button>
    <button
      class="cta__button cta__button--deal"
      @click="dealAllCards"
      :class="{ disabled: isGameStart }"
      :disabled="isGameStart"
    >
      發牌
    </button>
    <button class="cta__button cta__button--reset" @click="resetGame">
      重新
    </button>
  </div>
</template>

<script>
import { eventBus } from "@/main";

export default {
  name: "CallToAction",
  props: ["isGameStart"],
  methods: {
    dealAllCards() {
      this.$emit("dealAllCards");
    },
    resetGame() {
      eventBus.$emit("resetGame");
    }
  }
};
</script>

<style lang="scss">
.cta {
  display: flex;

  @include respond(tab-port) {
    flex: 0 0 100%;
    justify-content: center;
  }

  &__button {
    padding: 0.2em 1.3em;
    font-size: 1rem;
    cursor: pointer;
    border: 1px solid #fff;
    color: #fff;
    outline: none;
    background: none;

    &:not(:last-of-type) {
      margin-right: 1rem;
    }

    &:hover {
      background: $color-yellow;
      color: #fff;
    }
  }
}

.disabled {
  opacity: 0.2;
  cursor: auto;

  &:hover {
    background: none;
  }
}
</style>
