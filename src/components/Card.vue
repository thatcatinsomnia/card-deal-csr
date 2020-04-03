<template>
  <div class="card" :style="{ left: index * 12 + 'px' }">
    <img
      :src="require(`@/assets/images/${card.suit}/${card.number}.png`)"
      :alt="card.suit + ' ' + card.number"
    />
  </div>
</template>

<script>
export default {
  props: ["card", "index"],
  data() {
    return {};
  }
};
</script>

<style lang="scss">
.card {
  width: 5rem;
  position: absolute;

  img {
    display: block;
    height: auto;
    width: 100%;
  }

  &:hover {
    transform: translateY(-0.8rem);
    cursor: pointer;
  }
}
</style>
