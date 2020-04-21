<template>
  <div id="app">
    <notifications position="center" :width="350" classes="notifications" />
    <div class="system-bar">
      <GameOptions
        @updatePlayersCount="playersCount = $event"
        :isGameStart="isGameStart"
      >
      </GameOptions>

      <CallToAction
        @shuffleDeck="shuffleDeck"
        @dealAllCards="dealAllCards"
        :isGameStart="isGameStart"
      ></CallToAction>
    </div>

    <div class="container">
      <div class="card-dealer">
        <img
          class="card-dealer__img"
          :src="require('@/assets/images/girl.png')"
          alt="casino girl"
        />
      </div>

      <Deck @updateDeck="updateDeck" :deck="deck"></Deck>

      <Player
        v-for="(count, index) in playersCount"
        :key="'player-' + index"
        :id="index"
        :playerDeck="players[index].deck"
        :isDeckEmpty="isDeckEmpty"
        :currentRoundPlayed="currentRoundPlayed"
        @playCard="playCard"
      >
      </Player>
      <Desktop
        :currentRound="currentRound"
        :playersCount="playersCount"
      ></Desktop>

      <footer class="footer">
        Copyright &copy; 2020 Shen. All rights reserved
        <a href="https://github.com/thatcatinsomnia/card-deal-csr">
          github link
        </a>
      </footer>
    </div>
  </div>
</template>

<script>
import GameOptions from "@/components/GameOptions";
import CallToAction from "@/components/CallToAction";
import Deck from "@/components/Deck";
import Player from "@/components/Player";
import { gsap } from "gsap";
import Desktop from "@/components/Desktop";

import { eventBus } from "@/main";
import sleep from "@/utils/sleep";

export default {
  name: "App",
  components: {
    GameOptions,
    CallToAction,
    Deck,
    Player,
    Desktop
  },
  data() {
    return {
      playersCount: 1,
      players: [{ id: 0, deck: [] }],
      rounds: [],
      currentRound: [],
      currentRoundPlayed: [],
      deck: [],
      isDeckEmpty: false,
      isGameStart: false
    };
  },
  watch: {
    playersCount(count) {
      this.players.length = count;

      // set each player id and empty deck
      for (let i = 0; i < this.players.length; i++) {
        this.players[i] = {
          id: i,
          deck: []
        };
      }
    },
    currentRound(round) {
      if (round.length === this.playersCount) {
        this.checkWinner();
      }
    }
  },
  methods: {
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

      // tell vue to update the dom after sort cards,
      // so we can trigger the animation
      this.$nextTick(() => {
        this.updateAnimation();
      });
    },
    async dealAllCards() {
      this.isGameStart = true;
      let currentPlayerIndex = 0;

      for (let i = this.deck.length; i > 0; i--) {
        // break the loop when user click the reset button
        // this.isGameStart will be set to false if user click the reset button
        // this means game is paused
        if (!this.isGameStart) {
          break;
        }

        this.players[currentPlayerIndex].deck.push(this.deck.pop());

        currentPlayerIndex++;

        if (currentPlayerIndex === this.playersCount) {
          currentPlayerIndex = 0;
        }

        await sleep(100);
      }

      // only empty the deck when game is start
      // when user click reset button, the deck will empty by the restResult function.
      // if empty deck early, the watch in deck will trigger the animate in Player,
      // this break the deal card function
      if (this.isGameStart) {
        this.isDeckEmpty = true;
      }
    },
    updateAnimation() {
      const cards = document.querySelectorAll(".card-container");
      cards.forEach((card, index) => {
        gsap
          .to(card, {
            rotate: gsap.utils.random(-180, 180),
            x: gsap.utils.random(-150, 150),
            y: gsap.utils.random(-150, 150),
            duration: 0.4,
            ease: "power2.out"
          })
          .then(() => {
            gsap.to(card, {
              rotate: 0,
              x: index * 0.2 * -1,
              y: index * 0.3 * -1,
              ease: "power2.out",
              duration: 0.4
            });
          });
      });
    },
    updateDeck(card) {
      this.deck.push(card);
    },
    playCard(card) {
      this.currentRoundPlayed.push(card.player);
      this.currentRound.push(card);
      this.rounds.push(card);
    },
    checkWinner() {
      const winnerIndex = this.findWinner(this.currentRound);

      this.$notify({
        title: `player ${this.currentRound[winnerIndex].player} win this round.`,
        type: "warn",
        duration: 3000
      });

      setTimeout(() => {
        this.currentRoundPlayed = [];
        this.currentRound = [];
      }, 3000);
    },
    findWinner(round) {
      // transform card suit to calculate point
      const suitsPoint = { club: 1, diamond: 2, heart: 3, spade: 4 };

      let maxCardNumber = 0;
      let maxCardSuit = "";
      let maxPlayerIndex = -1;

      round.forEach((player, index) => {
        // transform card number to calculate point
        const numberPoint = this.calculateCardPoint(player.index);

        // first compare the card number
        if (numberPoint > maxCardNumber) {
          maxCardNumber = numberPoint;
          maxCardSuit = player.suit;
          maxPlayerIndex = index;

          // if card number is equal, compare the suit
        } else if (numberPoint === maxCardNumber) {
          if (suitsPoint[player.suit] > suitsPoint[maxCardSuit]) {
            maxCardSuit = player.suit;
            maxPlayerIndex = index;
          }
        }
      });

      return maxPlayerIndex;
    },
    calculateCardPoint(cardIndex) {
      // +1 because card index start from 0,
      // J Q K will transform to 11 12 13
      // A will transform to 99
      // 2 is the smallest card, so can't do anything with it
      let cardPoint = (cardIndex + 1) % 13 === 0 ? 13 : (cardIndex + 1) % 13;

      // if card is A, set it to 99 point, means A is the largest card.
      if (parseInt(cardPoint) === 1) {
        return 99;
      }
      return cardPoint;
    },
    resetGame() {
      this.deck = [];
      this.isGameStart = false;

      this.isDeckEmpty = false;
      this.playersCount = 1;
      this.players = [{ id: 0, deck: [] }];
      this.rounds = [];
      this.currentRound = [];
      this.currentRoundPlayed = [];
    }
  },
  created() {
    eventBus.$on("resetGame", () => {
      this.resetGame();
    });
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

html {
  @include respond(tab-land) {
    font-size: 75%;
  }
}

body {
  background: $color-green;
}

.notifications {
  padding: 1.5rem 3rem;
  margin: 0.5rem;
  text-align: center;
  color: #fff;
  border: 1px solid #fff;
  border-radius: 2px;

  .notification-title {
    text-align: center;
  }

  &.warn {
    background: $color-yellow;
  }
}

.system-bar {
  padding: 0.5rem 2rem;
  margin: 0 auto;
  display: flex;
  justify-content: space-around;
  flex-wrap: wrap;
  width: 100%;
  z-index: 2;
  position: fixed;

  @include respond(tab-land) {
    width: 100%;
  }
}

.container {
  height: 100vh;
  overflow: hidden;
  position: relative;

  @include respond(tab-port) {
    padding: 2rem;
  }
}

.card-dealer {
  margin: 0 auto;
  width: 25rem;
  position: absolute;
  top: 20%;
  left: 50%;
  transform: translateX(-50%);
  user-select: none;

  @include respond(tab-land) {
    top: 28%;
  }

  @include respond(phone) {
    top: 30%;
  }
  img {
    pointer-events: none;
    display: block;
    width: 100%;
    height: auto;
  }
}

.footer {
  padding: 0.2rem 0;
  color: #fff;
  text-align: center;
  position: fixed;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
}
</style>
