<template>
  <div class="player">
    <h1 class="player__name">player {{ id }}</h1>
    <div class="player__cards">
      <transition-group name="deal-card" @enter="enter">
        <Card
          v-for="(card, index) in deck"
          :key="'player-' + card.suit + card.number"
          :index="index"
          :card="card"
          ref="card"
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
  props: ["playerDeck", "id", "cardPositionX", "cardPositionY", "isDeckEmpty"],
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
    },
    isDeckEmpty() {
      // sort deck first

      //animattion
      this.$refs.card.forEach(card => {
        gsap
          .to(card.$el, {
            rotate: 0,
            duration: 0.3,
            clearProps: "transform,left"
          })
          .then(() => {
            gsap.from(card.$el, {
              left: 0,
              duration: 0.3
            });
          });
      });
      this.deck.sort((a, b) => {
        if (a.index > b.index) {
          return 1;
        } else {
          return -1;
        }
      });
    }
  },
  methods: {
    enter(el) {
      let { left, top } = el.getBoundingClientRect();
      let positionX = left - this.cardPositionX;
      let positionY = top - this.cardPositionY;

      var timeline = gsap.timeline();
      timeline
        .fromTo(
          el,
          { x: -positionX, y: -positionY },
          { x: 0, y: 0, left: 0, duration: 0.2 }
        )
        .to(el, {
          rotation: this.generateRotation(),
          x: Math.floor(Math.random() * 30),
          y: Math.floor(Math.random() * 30),
          duration: 0.1,
          delay: -0.1
        });
    },
    generateRotation() {
      return Math.floor(Math.random() * 360) + 7;
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
