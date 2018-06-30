<template>
  <div class="container">
    <p v-if="isConnected">We're connected to the server!</p>
    <template v-if="currentBlackCard">
      <h4>{{ currentBlackCard.text | blankSpace | breakString | specialCharacters}}</h4>
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
    <template v-if="chosenCardPile[0]">
      <div class="col-2">
        <p>Chosen Card:</p>
      </div>
      <div class="row" :key="card" v-for="card in chosenCardPile">
        <h4>{{ card }}</h4>
      </div>
    </template>
    <div class="footer row">
      <button class="btn-black" @click="chooseBlackCard">Black Card</button>
      <button class="btn-white" @click="chooseHand">White Cards</button>
      <button class="button-primary" @click="socket.emit('newGame')">New Game</button>
    </div>
  </div>
</template>

<script>
import io from 'socket.io-client'
import deck from '../assets/baseSet'
import BlackCard from './BlackCard'
import WhiteCard from './WhiteCard'

const LOCAL_ADDRESS = '192.168.2.54:8000'

export default {
  name: 'CardsAgainstHumanity',
  components: { BlackCard, WhiteCard },
  filters: {
    blankSpace: (value) => {
      const blank = value.replace(/_/g, '________')
      return blank
    },
    breakString: (value) => {
      const breakString = value.replace(/<br>/g, '\n')
      return breakString
    },
    specialCharacters: (value) => {
      let formated = value
      formated = formated.replace(/&trade;/g, '™')
      formated = formated.replace(/&reg;/g, '®')
      formated = formated.replace(/&Uuml;/g, 'Ü')
      return formated
    },
  },
  mounted() {
    this.isServerConnected()
    this.listenForBlackCard()
    this.listenForNewGame()
  },
  data() {
    return {
      blackCards: deck.blackCards,
      whiteCards: deck.whiteCards,
      playerHand: [],
      currentBlackCard: null,
      chosenCardPile: [],
      chooseCardAmount: 0,
      isConnected: false,
      socket: io(LOCAL_ADDRESS),
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
      this.socket.emit('currentBlackCard', this.currentBlackCard)
    },
    listenForBlackCard() {
      this.socket.on('serverBlackCard', (data) => {
        this.currentBlackCard = data
      })
    },
    listenForNewGame() {
      this.socket.on('serverNewGame', () => {
        this.clearGame()
      })
    },
    isServerConnected() {
      this.socket.on('isConnected', (data) => {
        this.isConnected = data
      })
    },
  },
}
</script>

<style scoped lang="scss">
  body {
    font-weight: 600;
  }
  h4 {
    font-size: 1.5em;
    font-weight: 600;
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
  .footer {
    position: fixed;
    left: 0;
    bottom: 0;
    width: 100%;
    color: white;
    text-align: center;
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
