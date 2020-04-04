<template>
  <div class="player">
    <h1 class="player__name">player {{ id }}</h1>
    <div class="player__cards">
      <transition-group name="deal-card" @enter="enter" :css="false">
        <Card
          v-for="(card, index) in deck"
          :key="'player-' + card.suit + card.number"
          :index="index"
          :card="card"
        >
        </Card>
      </transition-group>
    </div>
  </div>
</template>

<script>
import Card from "@/components/Card";
import gsap from "gsap";

export default {
  props: ["playerDeck", "id", "cardPositionX", "cardPositionY"],
  components: {
    Card
  },
  data() {
    return {
      deck: [],
      dealCardStart: null
    };
  },
  watch: {
    playerDeck(newValue) {
      this.deck = newValue;
    }
  },
  methods: {
    enter(el, done) {
      let { left, top } = el.getBoundingClientRect();
      let positionX = left - this.cardPositionX;
      let positionY = top - this.cardPositionY;

      gsap
        .fromTo(
          el,
          { x: -positionX, y: -positionY },
          { x: 0, y: 0, duration: 0.2 }
        )
        .then(done);
    },
    updatePosition() {
      console.log("position update");
    }
  },
  mounted() {
    this.deck = this.playerDeck;
  }
};
</script>

<style lang="scss">
.player {
  flex: 0 0 50%;
  height: 8rem;
  position: relative;

  @include respond(small-phone) {
    flex: 0 0 100%;
  }

  &__name {
    font-size: 1.2rem;
    color: rgb(218, 191, 41);
  }
}

// .deal-card {
//   animation: deal-animate 1s ease-out;
// }

@keyframes dealAnimate {
  to {
    transform: translate(0);
  }
}
</style>
