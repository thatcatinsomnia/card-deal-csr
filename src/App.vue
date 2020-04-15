<template>
  <div id="app">
    <notifications position="center" classes="notifications" />
    <div class="container">
      <div class="system">
        <GameRule
          @updatePlayersCount="playersCount = $event"
          :isGameStart="isGameStart"
          :isGameOver="isGameOver"
        >
        </GameRule>

        <CallToAction
          @shuffleDeck="shuffleDeck"
          @dealAllCards="dealAllCards"
          @resetGame="resetGame"
          :isGameStart="isGameStart"
        ></CallToAction>
      </div>
      <div class="card-dealer">
        <img
          class="card-dealer__img"
          :src="require('@/assets/images/girl.png')"
          alt="casino girl"
        />
      </div>

      <div class="deck-container">
        <DeckOfCards
          @updateDeck="updateDeck"
          @reset="reset"
          :deck="deck"
          :isGameOver="isGameOver"
        ></DeckOfCards>

        <CardPool
          :currentRound="currentRound"
          :playersCount="playersCount"
        ></CardPool>
      </div>

      <div class="desktop" :class="'desktop--' + playersCount">
        <GamePlayer
          v-for="(count, index) in playersCount"
          :key="'player-' + index"
          :id="index"
          :playerDeck="players[index].deck"
          :isAllCardDeal="isAllCardDeal"
          :currentRoundPlayed="currentRoundPlayed"
          @playCard="playCard"
        >
        </GamePlayer>
      </div>

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
import GameRule from "@/components/GameRule";
import CallToAction from "@/components/CallToAction";
import DeckOfCards from "@/components/DeckOfCards";
import GamePlayer from "@/components/GamePlayer";
import CardPool from "@/components/CardPool";
import sleep from "@/utils/sleep";

export default {
  name: "App",
  components: {
    GameRule,
    CallToAction,
    DeckOfCards,
    GamePlayer,
    CardPool
  },
  data() {
    return {
      playersCount: 1,
      players: [{ id: 0, deck: [] }],
      rounds: [],
      currentRound: [],
      currentRoundPlayed: [],
      deck: [],
      isAllCardDeal: false,
      isGameStart: false,
      isGameOver: false
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

        this.players[currentPlayerIndex].deck.push(this.deck.shift());

        currentPlayerIndex++;

        if (currentPlayerIndex === this.playersCount) {
          currentPlayerIndex = 0;
        }

        await sleep(100);
      }

      // only empty the deck when game is start
      // when user click reset reset button, the deck will empty by the restResult function.
      // if empty deck early, the watch in deck will trigger the animate in GamePlayer,
      // this break the deal card function
      if (this.isGameStart) {
        this.isAllCardDeal = true;
      }
    },
    updateDeck(deck) {
      this.deck = deck;
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
        type: "success",
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
      this.isGameOver = true;
      this.isGameStart = false;
    },
    reset() {
      this.isAllCardDeal = false;
      this.playersCount = 1;
      this.players = [{ id: 0, deck: [] }];
      this.rounds = [];
      this.currentRound = [];
      this.isGameOver = false;
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

html {
  @include respond(tab-land) {
    font-size: 75%;
  }
}

body {
  background: rgb(24, 145, 98);
}

.notifications {
  padding: 1.5rem 3rem;
  margin: 0.5rem;
  text-align: center;
  box-shadow: 0 0 0.6rem rgba(0, 0, 0, 0.3);
  color: #fff;
  border-radius: 4px;

  .notification-title {
    text-align: center;
  }

  &.success {
    background: rgb(75, 187, 135);
  }
}

.container {
  padding: 2rem 4rem;
  height: 100vh;
  display: flex;
  flex-direction: column;

  @include respond(tab-port) {
    padding: 2rem;
  }
}

.card-dealer {
  margin: 0 auto;
  width: 25rem;

  img {
    pointer-events: none;
    display: block;
    width: 100%;
    height: auto;
  }
}

.desktop {
  padding: 0 2rem;
  flex: 1;
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  grid-template-areas: "player0 player0 player0 player0";
  align-items: center;
  justify-items: center;
  row-gap: 2rem;

  @include respond(tab-port) {
    padding: 0;
  }

  &.desktop--2 {
    grid-template-areas: "player0 player0 player1 player1";
  }

  &.desktop--4 {
    grid-template-areas:
      "player0 player0 player1 player1"
      "player2 player2 player3 player3";
  }
}

.system {
  margin: 0 auto;
  display: flex;
  justify-content: space-around;
  flex-wrap: wrap;
  width: 80%;

  @include respond(tab-land) {
    width: 100%;
  }
}

.deck-container {
  height: 10vh;
  transform: translateY(-30%);

  @include respond(tab-port) {
    padding: 2rem 0;
    min-height: 8rem;
  }
}

.footer {
  color: #fff;
  text-align: center;
}
</style>
