<template>
  <div
    class="card-container"
    @click="playCard"
    :style="{
      position: isStack ? 'absolute' : 'initial'
    }"
  >
    <div class="card" :class="showBackSide ? 'showBackSide' : ''">
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
import { eventBus } from "@/main";
export default {
  name: "Card",
  props: ["card", "isStack", "showBackSide"],
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
  },
  methods: {
    playCard(event) {
      // check if card contains class: "card-start"
      // card-start class means all card is deal to player's hand
      const card = event.target.closest(".card-start");

      if (card) {
        const { left, top } = card.getBoundingClientRect();

        this.$emit("playCard", {
          suit: this.card.suit,
          number: this.card.number,
          index: this.card.index
        });
        eventBus.$emit("cardLocationFromPlayer", { x: left, y: top });
      }
    }
  }
};
</script>

<style lang="scss">
.card-container {
  display: inline-block;
  width: 5rem;
  height: 7.5rem;
  perspective: 50rem;
  position: absolute;
  z-index: 10;

  &:hover .card.card-start,
  &:active .card.card-start {
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
    height: 5.5rem;

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

.showBackSide {
  transform: rotateY(180deg);
}
</style>
