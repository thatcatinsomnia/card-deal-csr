<template>
  <div class="deck">
    <transition-group name="shuffle" mode="out-in" @before-leave="leave">
      <Card
        v-for="(card, index) in deck"
        :index="index"
        :key="'initial-' + card.suit + card.number"
        :card="card"
      ></Card>
    </transition-group>
  </div>
</template>

<script>
import Card from "@/components/Card";

export default {
  components: {
    Card
  },
  props: ["deck", "isReset"],
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
    leave(el) {
      const { top, left } = el.getBoundingClientRect();
      this.$emit("onUpdatePosition", { x: left, y: top });
    }
  },
  watch: {
    deck() {
      this.$emit("onGenerateDeck", this.deck);
    },
    isReset(newValue) {
      if (newValue === true) {
        this.generateDeck();
        this.$emit("onResetDeck", this.deck);
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
  transition: transform 0.2s;
}
</style>
