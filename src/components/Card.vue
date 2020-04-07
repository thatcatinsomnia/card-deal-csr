<template>
  <div class="card-container ">
    <div class="card card-initial">
      <div class="card__front">
        <img
          :src="
            require(`@/assets/images/${card.suit}/${card.suit}_${card.number}.png`)
          "
          :alt="card.suit + ' ' + card.number"
        />
      </div>

      <div class="card__back">
        <img
          :src="require(`@/assets/images/${cardBackImage.maroon}`)"
          alt="card back side image"
        />
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: ["card", "index"],
  data() {
    return {
      cardBackImage: {
        default: "back-default.png",
        black: "back-black.png",
        maroon: "back-maroon.png",
        gray: "back-gray.png",
        teal: "back-teal.png"
      }
    };
  }
};
</script>

<style lang="scss">
.card-container {
  width: 5rem;
  height: 7.5rem;
  perspective: 50rem;
  position: absolute;

  &:hover .card.card-start {
    transition: transform 0.08s cubic-bezier(0, 0, 0.3, 1);
    transform: translateY(-1rem);
  }

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
}

.card {
  width: 100%;
  height: 100%;
  transform-style: preserve-3d;
  position: relative;
  transition: all 0.3s cubic-bezier(0, 0, 0.3, 1);

  &__front {
    height: 100%;
    width: 100%;
    backface-visibility: hidden;
    position: absolute;
    top: 0;
  }

  &__back {
    height: 100%;
    width: 100%;
    backface-visibility: hidden;
    position: absolute;
    top: 0;
    left: 0;
    transform: rotateY(180deg);
  }

  img {
    display: block;
    height: 100%;
    width: 100%;
  }
}

.card-initial {
  transform: rotateY(180deg);
}
</style>
