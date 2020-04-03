<template>
  <div id="app">
    <div class="container">
      <div class="header">
        <div class="system">
          <app-rule
            @onUpdatePlayersCount="updatePlayersCount"
            :isGameStart="isGameStart"
            :isReset="isReset"
          ></app-rule>
          <div class="cta">
            <button
              class="cta__button cta__button--shuffle"
              @click="shuffleDeck"
              :class="{ disabled: isGameStart }"
            >
              洗牌
            </button>
            <button
              class="cta__button cta__button--deal"
              @click="dealCard"
              :class="{ disabled: isGameStart }"
              :disabled="isGameStart"
            >
              發牌
            </button>
            <button class="cta__button cta__button--reset" @click="reset">
              重新
            </button>
          </div>
        </div>
        <div class="deck-container">
          <Deck
            @onGenerateDeck="updateDeck"
            @onResetDeck="resetRule"
            :deck="deck"
            :isReset="isReset"
          ></Deck>
        </div>
      </div>
      <div class="desktop">
        <app-player
          v-for="(count, index) in playersCount"
          :key="'player-' + index"
          :id="index"
          :playerDeck="players[index].deck"
        >
        </app-player>
      </div>
    </div>
  </div>
</template>

<script>
import AppRule from "@/components/AppRule";
import AppPlayer from "@/components/AppPlayer";
import Deck from "@/components/Deck";
import sleep from "@/utils/sleep";

export default {
  name: "App",
  components: {
    AppRule,
    AppPlayer,
    Deck
  },
  data() {
    return {
      playersCount: 1,
      players: [{ id: 0, deck: [] }],
      deck: [],
      isGameStart: false,
      isReset: false
    };
  },
  watch: {
    playersCount(count) {
      this.players.length = count;

      // set each player id and  empty deck
      for (let i = 0; i < this.players.length; i++) {
        this.players[i] = {
          id: i,
          deck: []
        };
      }
    }
  },
  methods: {
    updatePlayersCount(value) {
      this.playersCount = value;
    },
    shuffleDeck() {
      // Yates Shuffle
      // start from the end, pick random position
      // change with the end position, until first position
      for (let i = this.deck.length - 1; i > 0; i--) {
        let randomIndex = Math.floor(Math.random() * i);
        let temp = this.deck[i];

        // this point to vue instance
        this.$set(this.deck, i, this.deck[randomIndex]);
        this.$set(this.deck, randomIndex, temp);
      }
    },
    async dealCard() {
      this.isGameStart = true;
      let currentPlayerIndex = 0;

      for (let i = this.deck.length; i > 0; i--) {
        this.players[currentPlayerIndex].deck.push(this.deck.shift());

        currentPlayerIndex++;

        if (currentPlayerIndex === this.playersCount) {
          currentPlayerIndex = 0;
        }

        await sleep(100);
      }
    },
    updateDeck(deck) {
      this.deck = deck;
    },
    reset() {
      this.deck = [];
      this.isReset = true;
    },
    resetRule() {
      this.playersCount = 1;
      this.players = [{ id: 0, deck: [] }];
      this.isGameStart = false;
      this.isReset = false;
    }
  }
};
</script>

<style lang="scss">
*,
*::after,
*::before {
  padding: 0;
  margin: 0;
  box-sizing: border-box;
}

body {
  background: rgb(24, 145, 98);
}

.container {
  padding: 4rem;
  height: 100vh;
  display: flex;
  flex-direction: column;
}

.desktop {
  padding: 0 4rem;
  flex: 1;
  display: flex;
  align-items: center;
  flex-wrap: wrap;
}

.system {
  display: flex;
  justify-content: space-around;
  width: 80%;
}

.deck-container {
  padding: 2rem 4rem;
  display: flex;
  height: 10rem;
}

.header {
  display: flex;
  flex-direction: column;
}

.cta {
  &__button {
    padding: 0.5em 2em;
    font-size: 1.2rem;
    cursor: pointer;
    border-radius: 3px;
    border: none;
    outline: none;

    &:not(:last-of-type) {
      margin-right: 2rem;
    }

    &:hover {
      background: rgb(204, 185, 14);
      color: #fff;
    }
  }
}

.disabled {
  background: rgb(224, 224, 224);
  color: rgb(189, 189, 189);
  cursor: auto;

  &:hover {
    background: rgb(224, 224, 224);
    color: rgb(189, 189, 189);
  }
}
</style>
