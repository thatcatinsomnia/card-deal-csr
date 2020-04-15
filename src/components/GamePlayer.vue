<template>
  <div class="player" :class="'player--' + id">
    <div class="player__header">
      <span class="player__name">player {{ id }}</span>
      <button
        class="player__view"
        @click="toggleView"
        v-if="this.showBackSide === true"
      >
        <img :src="require('@/assets/icons/icon-view-hide.svg')" />
      </button>
      <button class="player__view" @click="toggleView" v-else>
        <img :src="require('@/assets/icons/icon-view-show.svg')" />
      </button>
    </div>
    <div class="player__cards">
      <transition-group @enter="enter">
        <!-- 
          isStack used to set the card position stack to each other
          showBackSide will set the card backside until card is deal to player's hand
        -->
        <Card
          v-for="card in deck"
          ref="card"
          :key="'player-' + card.suit + card.number"
          :card="card"
          :isStack="true"
          :showBackSide="showBackSide"
          :data-owner="id"
          @playCard="playCard"
        >
        </Card>
      </transition-group>
    </div>
  </div>
</template>

<script>
import { eventBus } from "@/main";
import Card from "@/components/Card";
import { gsap, Power4 } from "gsap";
import "@/assets/icons/icon-view-hide.svg";
import "@/assets/icons/icon-view-show.svg";

export default {
  name: "GamePlayer",
  props: ["playerDeck", "id", "isAllCardDeal", "currentRoundPlayed"],
  components: {
    Card
  },
  data() {
    return {
      deck: [],
      showBackSide: true,
      positionX: 0,
      positionY: 0
    };
  },
  watch: {
    playerDeck(newDeck) {
      this.deck = newDeck;
    },
    isAllCardDeal() {
      // animation when all card is deal
      // SET DELAY PROPERTY LARGE OR EQUAL TO DEALING CARD ANIMATION TIME
      // OTHERWISE THE ANIMATION WILL STUCK
      // because the rotate animation is start when there is card flying to the user hand
      // then the card is flying will not trigger rotate
      this.$refs.card.forEach(card => {
        gsap
          .to(card.$el, {
            rotate: 0,
            x: 0,
            y: 0,
            duration: 0.2,
            delay: 0.5,
            clearProps: "transform,left"
          })
          .then(() => {
            gsap.from(card.$el, {
              left: 0,
              duration: 0.3,
              onComplete: () => {
                card.$el.children[0].classList.add("card-start");
              }
            });
          });
      });
      this.sortHandCards();
    }
  },
  methods: {
    toggleView() {
      this.showBackSide = !this.showBackSide;
    },
    enter(el) {
      let { left, top } = el.getBoundingClientRect();
      let translateX = left - this.x;
      let translateY = top - this.y;

      var timeline = gsap.timeline();
      timeline
        .fromTo(
          el,
          { x: -translateX, y: -translateY, ease: Power4.easeOut },
          { x: 0, y: 0, left: 0, duration: 0.4 }
        )
        .to(el, {
          rotation: gsap.utils.random(-90, 90),
          x: gsap.utils.random(1, 30),
          y: gsap.utils.random(1, 30),
          duration: 0.15,
          delay: -0.1
        });
    },
    sortHandCards() {
      //for transform suit to point
      let suitPoint = {
        club: 1,
        diamond: 2,
        heart: 3,
        spade: 4
      };

      this.deck.sort((a, b) => {
        // transform card number to point
        let pointA = (a.index + 1) % 13 === 0 ? 13 : (a.index + 1) % 13;
        let pointB = (b.index + 1) % 13 === 0 ? 13 : (b.index + 1) % 13;

        // compare number first, if point is equal then compare the suit point
        if (pointA > pointB) {
          return 1;
        } else if (pointA === pointB) {
          // the number point is equal, compare the suit number
          if (suitPoint[a.suit] > suitPoint[b.suit]) {
            return 1;
          } else {
            return -1;
          }
        } else {
          return -1;
        }
      });
    },
    playCard(card) {
      if (this.currentRoundPlayed.includes(this.id)) {
        return;
      }

      this.showBackSide = true;

      this.playerDeck.forEach((playerCard, index) => {
        if (
          playerCard.suit === card.suit &&
          playerCard.number === card.number
        ) {
          this.playerDeck.splice(index, 1);
          this.$emit("playCard", {
            player: this.id,
            number: card.number,
            suit: card.suit,
            index: card.index
          });
          return;
        }
      });
    }
  },
  created() {
    // listen eventBus for animation deal card from deck to user hand
    eventBus.$on("cardLocationFromDeck", coordinate => {
      this.x = coordinate.x;
      this.y = coordinate.y;
    });
  },
  mounted() {
    this.deck = this.playerDeck;
  }
};
</script>

<style lang="scss">
.player {
  max-width: 30rem;
  width: 100%;
  height: 10rem;
  position: relative;
  display: flex;
  flex-direction: column;

  &.player--0 {
    grid-area: player0;
  }

  &.player--1 {
    grid-area: player1;
  }

  &.player--2 {
    grid-area: player2;
  }

  &.player--3 {
    grid-area: player3;
  }

  &__header {
    display: flex;
    align-items: center;
  }

  &__name {
    font-size: 1.2rem;
    margin: 0 1rem;
    color: rgb(218, 191, 41);
  }

  &__view {
    padding: 0 0.2rem;
    display: flex;
    align-items: center;
    border: none;
    outline: none;
    background: transparent;
    cursor: pointer;

    img {
      pointer-events: none;
    }
  }

  &__cards {
    flex: 1;
  }
}
</style>
