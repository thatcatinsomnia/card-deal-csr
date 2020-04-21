<template>
  <div class="player" :class="'player--' + id">
    <div class="player__header">
      <div class="player__info">
        <img
          :src="require('@/assets/images/user.png')"
          alt=""
          class="player__logo"
        />
        <span class="player__name">player {{ id }}</span>
      </div>
      <div class="player__action">
        <button
          class="player__view"
          @click="toggleView"
          v-if="this.showBackface === true"
        >
          <img :src="require('@/assets/icons/icon-view-hide.svg')" />
        </button>
        <button class="player__view" @click="toggleView" v-else>
          <img :src="require('@/assets/icons/icon-view-show.svg')" />
        </button>
      </div>
    </div>
    <div class="player__cards">
      <transition-group @enter="enter" tag="div">
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
          :showBackface="showBackface"
          :data-owner="id"
          :data-card="card.suit + ' ' + card.number"
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
import { gsap } from "gsap";
import "@/assets/icons/icon-view-hide.svg";
import "@/assets/icons/icon-view-show.svg";

export default {
  name: "Player",
  props: ["playerDeck", "id", "isDeckEmpty", "currentRoundPlayed"],
  components: {
    Card
  },
  data() {
    return {
      deck: [],
      showBackface: true,
      isAllCardsDeal: false,
      pos: {}
    };
  },
  watch: {
    playerDeck(newDeck) {
      this.deck = newDeck;
    },
    isDeckEmpty() {
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
            delay: 0.6,
            clearProps: "left"
          })
          .then(() => {
            this.sortHandCards();
          })
          .then(() => {
            gsap.from(card.$el, {
              left: 0,
              duration: 0.3,
              clearProps: "transform"
            });
          });
      });
    }
  },
  methods: {
    toggleView() {
      this.showBackface = !this.showBackface;
    },
    enter(el) {
      let { left, top } = el.getBoundingClientRect();
      let translateX = left - this.pos.x;
      let translateY = top - this.pos.y;

      gsap.fromTo(
        el,
        {
          x: -translateX,
          y: -translateY
        },
        {
          x: gsap.utils.random(1, 30),
          y: gsap.utils.random(1, 30),
          rotation: gsap.utils.random(-90, 90),
          left: 0,
          duration: 0.8,
          ease: "power3.out"
        }
      );
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

      this.showBackface = true;

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
      this.pos.x = coordinate.x;
      this.pos.y = coordinate.y;
    });
  },
  mounted() {
    this.deck = this.playerDeck;
  }
};
</script>

<style lang="scss">
.player {
  position: absolute;

  &.player--0 {
    top: 25%;
    left: 15%;

    @include respond(tab-land) {
      top: 10%;
      left: 5%;
    }
  }

  &.player--1 {
    top: 65%;
    left: 15%;

    @include respond(tab-land) {
      bottom: 85%;
      left: 5%;
    }
  }

  &.player--2 {
    top: 25%;
    right: 20%;

    @include respond(tab-land) {
      top: 10%;
    }
  }

  &.player--3 {
    top: 65%;
    right: 20%;

    @include respond(tab-land) {
      bottom: 85%;
    }
  }

  &__header {
    display: flex;
    align-items: center;
  }

  &__info {
    display: flex;
    flex-direction: column;
    justify-content: space-evenly;
    align-items: center;
  }

  &__logo {
    width: 4rem;
    height: 4rem;
  }

  &__name {
    font-size: 1.2rem;
    margin: 0 1rem;
    color: #fff;
  }

  &__action {
    align-self: flex-end;
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
      width: 1.5rem;
      height: 1.5rem;
      pointer-events: none;
    }
  }

  &__cards {
    flex: 1;
  }
}
</style>
