<template>
  <div class="main">
    <div class="row">
      <h1>Cards Against Vue</h1>
      <button class="btn-black" @click="chooseBlackCard">Deal Black Card</button>
      <button class="btn-white" @click="chooseHand">Deal White Cards</button>
      <button class="button-primary" @click="clearGame">Clear Game</button>
    </div>
    <div class="row">
      <button @click="previousCardInHand">Previous Card</button>
      <button @click="nextCardInHand">Next Card</button>
    </div>
    <template v-if="currentBlackCard">
      <BlackCard
        :cardText="currentBlackCard.text">
      </BlackCard>
    </template>
    <template v-if="playerHand[0]">
      <div class="scrolling-wrapper">
      <template v-for="(card, index) in playerHand">
        <WhiteCard
          :key="card"
          v-on:select-card="selectCard"
          :cardText="card"
          :cardIndex="index">
        </WhiteCard>
      </template>
      </div>
    </template>
    <template v-if="chosenCardPile">
      <div class="row" :key="card" v-for="card in chosenCardPile">
        <h3>Chosen Card: {{ card }}</h3>
      </div>
    </template>
  </div>
</template>

<script>
import deck from '../assets/baseSet'
import BlackCard from './BlackCard'
import WhiteCard from './WhiteCard'

export default {
  name: 'CardsAgainstHumanity',
  components: { BlackCard, WhiteCard },
  data() {
    return {
      blackCards: deck.blackCards,
      whiteCards: deck.whiteCards,
      playerHand: [],
      currentBlackCard: null,
      chosenCardPile: [],
      chooseCardAmount: 0,
    }
  },
  methods: {
    /*
     * TO DO:
     *   - Horizontal Scroll - COMPLETE
     *   - If no card amount is set - can't select a card
     *   - Undo white card selection (commit button? / swipe up)
     *   - Choosing multiple cards, able to re-order
     */

    // Reset game by setting to default and clearing hand
    clearGame() {
      this.playerHand = []
      this.chosenCardPile = []
      this.currentBlackCard = null
      this.chooseCardAmount = 0
    },
    // Determine number of cards to select based on Black Card
    setCardAmount() {
      const _selectionCount = this.currentBlackCard.text
        .split('')
        .filter(char => char === '_')
        .length
      this.chooseCardAmount = _selectionCount === 0 ? 1 : _selectionCount
    },
    /*
     * On click, put the current card in the selected pile
     * Remove it from the player's hand
     * Set the new current card
     * Limit player to selecting only 1 or 2 cards depending on black card
     */
    selectCard(card) {
      if (this.chooseCardAmount !== 0
        && this.chosenCardPile.length >= this.chooseCardAmount) {
        // Can't choose card! Message here
      } else {
        this.chosenCardPile.push(card.text)
        this.playerHand.splice(card.index, 1)
      }
    },
    // Set the Current Viewable card
    setCurrentCard() {
      this.currentWhiteCard = this.playerHand[this.currentCardIndex]
    },
    // Increase the current card index, and set the current card
    nextCardInHand() {
      if (this.currentCardIndex >= this.playerHand.length - 1) {
        this.currentCardIndex = 0
      } else {
        this.currentCardIndex += 1
      }
      this.setCurrentCard()
    },
    // Decrease the current card index, and set the current card
    previousCardInHand() {
      if (this.currentCardIndex <= 0) {
        this.currentCardIndex = this.playerHand.length - 1
      } else {
        this.currentCardIndex -= 1
      }
      this.setCurrentCard()
    },
    // Select a random card from either the black or white deck (cardType)
    randomCard(cardType) {
      const randomNumber = Math.floor(Math.random() * Math.floor(cardType.length))
      return cardType[randomNumber]
    },
    // Reset the player's hand
    clearHand() {
      this.playerHand = []
    },
    // Choose ten random cards from the white card deck, set the player's hand
    chooseHand() {
      if (this.currentBlackCard) {
        const numberOfCards = 10
        this.clearHand()
        for (let i = 0; i < numberOfCards; i += 1) {
          this.playerHand.push(this.randomCard(this.whiteCards))
        }
        this.setCurrentCard()
      } else {
        // Woops! You need to pick a black card first!
      }
    },
    // Choose a random black card
    chooseBlackCard() {
      this.currentBlackCard = this.randomCard(this.blackCards)
      this.setCardAmount()
    },
  },
}
</script>

<style scoped lang="scss">
  h1, h2 {
    font-weight: normal;
  }
  ul {
    list-style-type: none;
    padding: 0;
  }
  li {
    display: inline-block;
    margin: 0 10px;
  }
  a {
    color: #42b983;
  }

  .btn {
    &-white {
      color: #000000;
      background: #FFFFFF;
      &:hover {
        color: #FFFFFF;
        background: #000000;
      }
    }
    &-black {
      color: #FFFFFF;
      background: #000000;
      &:hover {
        color: #000000;
        background: #FFFFFF;
      }
    }
  }
  .scrolling-wrapper {
    display: flex;
    flex-wrap: nowrap;
    overflow-x: auto;
    -webkit-overflow-scrolling: touch;
    &::-webkit-scrollbar {
      display: none;
    }
  }

</style>
