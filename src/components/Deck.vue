<template>
  <div class="deck">
    <transition-group
      class="deck__inner"
      name="shuffle"
      @enter="enter"
      @before-leave="beforeLeave"
      tag="div"
      :css="false"
    >
      <Card
        v-for="(card, index) in deck"
        :key="'initial-' + card.suit + card.number"
        :card="card"
        :data-index="index"
        :isStack="isStack"
        :showBackface="showBackface"
      ></Card>
    </transition-group>
  </div>
</template>

<script>
import Card from "@/components/Card";
import { gsap } from "gsap";
import { eventBus } from "@/main";

export default {
  name: "Deck",
  components: {
    Card
  },
  props: ["deck"],
  data() {
    return {
      suits: ["club", "diamond", "heart", "spade"],
      numbers: [
        "A",
        "2",
        "3",
        "4",
        "5",
        "6",
        "7",
        "8",
        "9",
        "10",
        "J",
        "Q",
        "K"
      ],
      showBackface: true,
      isStack: true
    };
  },
  methods: {
    generateDeck() {
      let i = 0;
      for (let suit of this.suits) {
        for (let number of this.numbers) {
          this.$emit("updateDeck", { suit, number, index: i });
          i++;
        }
      }
    },
    enter(el) {
      const index = el.getAttribute("data-index");
      el.classList.add("initial");

      gsap.fromTo(
        el,
        {
          opacity: 0,
          x: 400
        },
        {
          opacity: 1,
          x: index * 0.2 * -1,
          y: index * 0.3 * -1,
          delay: index * 0.05,
          ease: "power2.in",
          duration: 0.5,
          clearProps: "opacity"
        }
      );
    },
    beforeLeave(el) {
      const { top, left } = el.getBoundingClientRect();
      eventBus.$emit("cardLocationFromDeck", { x: left, y: top });
    }
  },
  mounted() {
    this.generateDeck();
  },
  created() {
    eventBus.$on("resetGame", () => {
      // update the dom first, then render the initial card animation
      this.$nextTick(() => {
        this.generateDeck();
      });
    });
  }
};
</script>

<style lang="scss">
.deck {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 100%;
  height: 85vh;

  &__inner {
    width: 10rem;
    height: 10rem;
    position: absolute;
    left: 50%;
    top: 58%;
  }
}

.shuffle-move {
  transition: transform 0.3s ease-out;
}
</style>
