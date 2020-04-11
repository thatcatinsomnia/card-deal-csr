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
      @click="$emit('dealAllCards')"
      :class="{ disabled: isGameStart }"
      :disabled="isGameStart"
    >
      發牌
    </button>
    <button class="cta__button cta__button--reset" @click="$emit('resetGame')">
      重新
    </button>
  </div>
</template>

<script>
export default {
  name: "CallToAction",
  props: ["isGameStart"]
};
</script>

<style lang="scss">
.cta {
  @include respond(tab-port) {
    flex: 0 0 100%;
  }

  &__button {
    padding: 0.5em 2em;
    font-size: 1.2rem;
    cursor: pointer;
    border-radius: 3px;
    border: none;
    outline: none;

    &:not(:last-of-type) {
      margin-right: 2rem;

      @include respond(phone) {
        margin-right: 0.5rem;
      }
    }

    &:hover {
      background: rgb(204, 185, 14);
      color: #fff;
    }
  }
}

.disabled {
  background: rgb(224, 224, 224);
  color: rgb(189, 189, 189);
  cursor: auto;

  &:hover {
    background: rgb(224, 224, 224);
    color: rgb(189, 189, 189);
  }
}
</style>
