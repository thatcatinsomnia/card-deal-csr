<template>
  <div class="desktop">
    <transition-group
      class="desktop__inner"
      :class="'desktop__inner--' + playersCount"
      @enter="enter"
      @leave="leave"
      tag="div"
    >
      <div
        class="desktop__cards"
        v-for="(round, index) in currentRound"
        :data-order="index"
        :key="round.player + '-' + round.suit + round.number"
      >
        <Card :card="round" :isStack="false"></Card>
        <span class="desktop__owner">player {{ round.player }}</span>
      </div>
    </transition-group>
  </div>
</template>

<script>
import { eventBus } from "@/main";
import Card from "@/components/Card";
import gsap from "gsap";

export default {
  name: "CardPool",
  props: ["currentRound", "playersCount"],
  data() {
    return {
      cardOwner: null,
      pos: {}
    };
  },
  components: {
    Card
  },
  methods: {
    enter(el) {
      // hide the span until card is on the desktop
      const span = el.children[1];
      span.style.opacity = 0;

      // card element, remove the start class to prevent hover effect
      el.children[0].children[0].classList.remove("start");

      const { left, top } = el.getBoundingClientRect();

      gsap.from(el, {
        x: this.pos.x - left,
        y: this.pos.y - top,
        duration: 0.3,
        onComplete: () => {
          span.style.opacity = 1;
        }
      });
    },
    leave(el, done) {
      const span = el.children[1];
      span.style.opacity = 0;

      gsap.to(el, {
        y: 350,
        rotate: gsap.utils.random(-180, 180),
        // how many time delay, decrease it to make all card disappear in the same time.
        duration: 1 - el.dataset.order * 0.1,
        opacity: 0,
        delay: el.dataset.order * 0.1,
        onComplete: () => {
          done();
        }
      });
    }
  },
  created() {
    // listen eventBus for animation from user hand to card pool
    eventBus.$on("cardLocationFromPlayer", coordinate => {
      this.pos.x = coordinate.x;
      this.pos.y = coordinate.y;
    });
  }
};
</script>

<style lang="scss">
.desktop {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, 0);
  height: 10rem;
  width: 30rem;
  pointer-events: none;

  &__inner {
    width: 100%;
    height: 100%;
    display: grid;
    gap: 1rem;
    grid-template-columns: repeat(1, 1fr);
    justify-items: center;

    &--2 {
      grid-template-columns: repeat(2, 1fr);
    }

    &--4 {
      grid-template-columns: repeat(4, 1fr);
    }
  }

  &__cards {
    display: flex;
    flex-direction: column;
    justify-content: space-evenly;
  }

  &__owner {
    display: block;
    text-align: center;
    font-size: 1.2rem;
    color: #fff;
  }
}
</style>
