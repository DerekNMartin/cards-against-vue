<template>
  <div class="container">
    <p v-if="socket.connected">We're connected to the server!</p>
    <p v-if="isCzar">You are the Czar!</p>
    <template v-if="currentBlackCard">
      <h4>{{ currentBlackCard.text | blankSpace | breakString | specialCharacters}}</h4>
    </template>
    <template v-if="isCzar">
      <template v-for="playerSelections in confirmedWhiteCards">
        {{ playerSelections.id }}
        <div :key="playerSelections.id" class="scrolling-wrapper">
          <WhiteCard
            v-for="card in playerSelections.cards"
            :key="card"
            :cardText="card">
          </WhiteCard>
        </div>
      </template>
    </template>
    <template v-else>
      <template v-if="playerHand[0]">
      <div class="scrolling-wrapper">
        <template v-for="(card, index) in playerHand">
          <WhiteCard
            :key="card"
            v-on:select-card="selectCard"
            :cardText="card"
            :cardIndex="index"
            :selectedCards="chosenWhiteCards">
          </WhiteCard>
        </template>
        </div>
      </template>
      <div class="footer row">
        <button class="btn-black" @click="chooseBlackCard">Black Card</button>
        <button class="btn-white" @click="chooseHand">White Cards</button>
        <button class="button-primary" @click="socket.emit('newGame')">New Game</button>
        <button class="button-primary" @click="confirmCards()">Confirm Cards</button>
        <button class="button-primary" @click="setCzar()">Set Czar</button>
      </div>
    </template>
  </div>
</template>

<script>
/* eslint-disable no-console */
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
    this.listenForBlackCard()
    this.listenForNewGame()
    this.listenForConfirmedCards()
  },
  computed: {
    /* eslint-disable object-shorthand, func-names */
    pickLimitReached: function () {
      if (this.currentBlackCard) {
        return this.chosenWhiteCards.length >= this.currentBlackCard.pick
      }
      return false
    },
    /* eslint-enable object-shorthand, func-names */
  },
  data() {
    return {
      blackCards: deck.blackCards,
      whiteCards: deck.whiteCards,
      playerHand: [],
      currentBlackCard: null,
      chosenWhiteCards: [],
      isCzar: false,
      socket: io(LOCAL_ADDRESS),
      confirmedWhiteCards: [],
    }
  },
  methods: {
    // Reset game by setting to default and clearing hand
    clearGame() {
      this.playerHand = []
      this.chosenWhiteCards = []
      this.currentBlackCard = null
      this.confirmedWhiteCards = []
    },
    /*
     * On click event:
     * if the card has already been selected and player wants to deselect it
     * then remove it from the chosen pile
     * if the pick limit has been reached then we can't pick anymore cards
     * select the card if the other conditions are false
     */
    selectCard(card) {
      if (card.selected) {
        const indexOfCard = this.chosenWhiteCards.indexOf(card.text)
        this.chosenWhiteCards.splice(indexOfCard, 1)
      } else if (this.pickLimitReached) {
        console.log('CARD LIMIT REACHED')
      } else {
        this.chosenWhiteCards.push(card.text)
      }
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
    // TODO refactor to use map/reduce/filter
    chooseHand() {
      if (this.currentBlackCard) {
        this.clearHand()
        this.chooseCards(10)
      } else {
        console.log('Woops! You need to pick a black card first!')
      }
    },
    chooseCards(numberOfCards) {
      for (let i = 0; i < numberOfCards; i += 1) {
        this.playerHand.push(this.randomCard(this.whiteCards))
      }
    },
    // Choose a random black card
    chooseBlackCard() {
      this.currentBlackCard = this.randomCard(this.blackCards)
      this.socket.emit('currentBlackCard', this.currentBlackCard)
    },
    setCzar() {
      this.isCzar = !this.isCzar
    },
    confirmCards() {
      const _chosenCards = {
        id: this.socket.id,
        cards: this.chosenWhiteCards,
      }
      this.socket.emit('confirmSelection', _chosenCards)
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
    listenForConfirmedCards() {
      this.socket.on('confirmedWhiteCards', (data) => {
        this.confirmedWhiteCards = data
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
