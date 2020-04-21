<template>
  <div
    class="card-container"
    @click="playCard"
    :style="{
      position: isStack ? 'absolute' : 'initial'
    }"
  >
    <div class="card" :class="showBackface ? 'showBackface' : 'start'">
      <div class="card__front">
        <img :src="src" :alt="card.suit + ' ' + card.number" />
      </div>

      <div class="card__back">
        <img :src="backfaceSrc" alt="card back side image" />
      </div>
    </div>
  </div>
</template>

<script>
import { eventBus } from "@/main";
export default {
  name: "Card",
  props: ["card", "isStack", "showBackface"],
  data() {
    return {
      cardBackImage: {
        default: "back-default.png",
        black: "back-black.png",
        maroon: "back-maroon.png",
        gray: "back-gray.png",
        teal: "back-teal.png"
      },
      src: "",
      backfaceSrc: ""
    };
  },
  methods: {
    playCard(event) {
      // check if card contains class: "start"
      // start class means all card is deal to player's hand
      const card = event.target.closest(".card");

      if (card && card.classList.contains("showBackface")) {
        return;
      }

      if (card && card.classList.contains("start")) {
        const { left, top } = card.getBoundingClientRect();
        this.$emit("playCard", {
          suit: this.card.suit,
          number: this.card.number,
          index: this.card.index
        });
        eventBus.$emit("cardLocationFromPlayer", { x: left, y: top });
      }
    }
  },
  mounted() {
    this.backfaceSrc = require(`@/assets/images/back-maroon.png`);
    this.src = require(`@/assets/images/${this.card.suit}/${this.card.suit}_${this.card.number}.png`);
  }
};
</script>

<style lang="scss">
.card-container {
  display: inline-block;
  width: 5rem;
  height: 7rem;
  perspective: 50rem;
  position: absolute;
  user-select: none;

  &.initial {
    transform: translate(-50%, -50%);
  }

  &:hover .card.start,
  &:active .card.start {
    transition: transform 0.05s cubic-bezier(0, 0, 0.3, 1);
    transform: translateY(-1rem);
  }

  .card.showBackface {
    transform: rotateY(180deg);
  }

  &:hover .card.showBackface,
  &:active .card.showBackface {
    transform: rotateY(180deg);
  }

  @include respond(phone) {
    width: 4rem;
    height: 5.5rem;
  }
}

.player__cards .card-container {
  @for $i from 1 to 53 {
    &:nth-of-type(#{$i}) {
      left: (#{($i - 1) * 1rem});
    }
  }
}

.card {
  width: 100%;
  height: 100%;
  transform-style: preserve-3d;
  position: relative;
  transition: all 0.3s cubic-bezier(0, 0, 0.3, 1);
  background: #fff;

  &__front {
    border-radius: 4px;
    height: auto;
    width: 100%;
    backface-visibility: hidden;
    position: absolute;
    top: 0;
  }

  &__back {
    border-radius: 4px;
    backface-visibility: hidden;
    position: absolute;
    top: 0;
    left: 0;
    transform: rotateY(180deg);
  }

  img {
    pointer-events: none;
    display: block;
    height: 100%;
    width: 100%;
  }
}
</style>
