<template>
  <div class="player">
    <h1 class="player__name">player {{ id }}</h1>
    <div class="player__cards">
      <transition-group name="card-anim">
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

export default {
  props: ["playerDeck", "id"],
  components: {
    Card
  },
  data() {
    return {
      deck: []
    };
  },
  watch: {
    playerDeck(newValue) {
      this.deck = newValue;
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

  &__name {
    font-size: 1.2rem;
    color: rgb(218, 191, 41);
  }
}

.card-anim-enter-active,
.card-anim-leave-active {
  transition: transform 0.1s cubic-bezier(0, 0, 0.3, 1);
}

.card-anim-enter,
.card-anim-leave-to {
  opacity: 0;
  transform: translateY(-0.8rem);
}
</style>
