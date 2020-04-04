<template>
  <div class="card" ref="card">
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

  @for $i from 1 to 53 {
    &:nth-of-type(#{$i}) {
      left: (#{($i - 1) * 0.8rem});
    }
  }

  @include respond(tab-port) {
    width: 3.5rem;

    @for $i from 1 to 53 {
      &:nth-of-type(#{$i}) {
        left: (#{($i - 1) * 0.5rem});
      }
    }
  }

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
