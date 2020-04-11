<template>
  <div class="deck">
    <transition-group name="shuffle" @before-leave="beforeLeave">
      <Card
        v-for="card in deck"
        :key="'initial-' + card.suit + card.number"
        :card="card"
        :isStack="true"
        :showBackSide="true"
      ></Card>
    </transition-group>
  </div>
</template>

<script>
import Card from "@/components/Card";
import { eventBus } from "@/main";

export default {
  name: "DeckOfCard",
  components: {
    Card
  },
  props: ["deck", "isGameOver"],
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
      ]
    };
  },
  methods: {
    generateDeck() {
      let i = 0;
      for (let suit of this.suits) {
        for (let number of this.numbers) {
          this.deck.push({ suit, number, index: i });
          i++;
        }
      }
    },
    beforeLeave(el) {
      const { top, left } = el.getBoundingClientRect();
      eventBus.$emit("cardLocationFromDeck", { x: left, y: top });
    }
  },
  watch: {
    deck() {
      this.$emit("updateDeck", this.deck);
    },
    isGameOver(isGameOver) {
      if (isGameOver === true) {
        this.generateDeck();
        this.$emit("reset", this.deck);
      }
    }
  },
  mounted() {
    this.generateDeck();
  }
};
</script>

<style lang="scss">
.deck {
  position: relative;
  display: flex;
}

.shuffle-move {
  transition: transform 0.2s ease-out;
}
</style>
