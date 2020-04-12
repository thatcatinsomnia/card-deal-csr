<template>
  <div class="card-pool">
    <transition-group
      class="card-pool__inner"
      :class="'card-pool__inner--' + playersCount"
      @enter="enter"
      @leave="leave"
      tag="div"
    >
      <div
        class="card__outer"
        v-for="(round, index) in currentRound"
        :data-index="index"
        :key="round.player + '-' + round.suit + round.number"
      >
        <Card :card="round" :isStack="false"></Card>
        <span class="card-pool__owner">player {{ round.player }}</span>
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
      positionX: 0,
      positionY: 0
    };
  },
  components: {
    Card
  },
  methods: {
    enter(el) {
      const { left, top } = el.getBoundingClientRect();
      gsap.from(el, {
        x: this.positionX - left,
        y: this.positionY - top,
        duration: 0.3
      });
    },
    leave(el, done) {
      gsap.to(el, {
        y: 400,
        rotate: gsap.utils.random(-90, 90),
        // how many time delay, decrease it to make all card disappear in the same time.
        duration: 1 - el.dataset.index * 0.1,
        opacity: 0,
        delay: el.dataset.index * 0.1,
        onComplete: () => {
          done();
        }
      });
    }
  },
  created() {
    // listen eventBus for animation from user hand to card pool
    eventBus.$on("cardLocationFromPlayer", coordinate => {
      this.positionX = coordinate.x;
      this.positionY = coordinate.y;
    });
  }
};
</script>

<style lang="scss">
.card-pool {
  margin: 0 auto;
  height: 100%;
  width: 30rem;

  &__inner {
    display: grid;
    gap: 4rem;
    grid-template-columns: repeat(1, 1fr);
    justify-items: center;

    &--2 {
      grid-template-columns: repeat(2, 1fr);
    }

    &--4 {
      grid-template-columns: repeat(4, 1fr);
    }
  }

  &__owner {
    display: block;
    text-align: center;
    font-size: 1.2rem;
    color: rgb(204, 185, 14);
  }
}
</style>
