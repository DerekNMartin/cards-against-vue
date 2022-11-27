<script setup>
import { ref, computed } from 'vue'
import BlackCard from '../components/blackCard.vue'
import WhiteCard from '../components/whiteCard.vue'
import deck from '../assets/baseSet'

const isCzar = ref(false)
const blackCards = ref(deck.blackCards)
const currentBlackCard = ref()

function chooseBlackCard() {
  currentBlackCard.value = randomCard(blackCards.value)
}

const whiteCards = ref(deck.whiteCards)
const confirmedWhiteCards = ref([])

const chosenWhiteCards = ref([])
const playerHand = ref([])

function chooseHand() {
  if (currentBlackCard.value) {
    clearHand()
    chooseCards(10)
  } else {
    console.log('Woops! You need to pick a black card first!')
  }
}

function clearGame() {
  playerHand.value = []
  chosenWhiteCards.value = []
  currentBlackCard.value = null
  confirmedWhiteCards.value = []
}

function clearHand() {
  playerHand.value = []
}

function chooseCards(numberOfCards) {
  playerHand.value = []
  for (let i = 0; i < numberOfCards; i += 1) {
    playerHand.value.push(randomCard(whiteCards.value))
  }
}

function selectCard(card) {
  if (card.selected) {
    const indexOfCard = chosenWhiteCards.value.indexOf(card.text)
    chosenWhiteCards.value.splice(indexOfCard, 1)
  } else if (pickLimitReached.value) {
    console.log('CARD LIMIT REACHED')
  } else {
    chosenWhiteCards.value.push(card.text)
  }
}

// Select a random card from either the black or white deck (cardType)
function randomCard(cardType) {
  const randomNumber = Math.floor(Math.random() * Math.floor(cardType.length))
  return cardType[randomNumber]
}

const pickLimitReached = computed(() => {
  if (currentBlackCard.value) {
    return chosenWhiteCards.value.length >= currentBlackCard.value.pick
  }
  return false
})

</script>

<template>
  <main class="flex flex-col justify-between h-full">
    <header class="mb-6">
      <p v-if="isCzar">You are the Czar!</p>
      <h4 class="font-bold" v-if="currentBlackCard">{{ currentBlackCard.text }}</h4>
    </header>
    <section class="flex-1 flex items-center">
      <template v-if="isCzar">
        <template v-for="playerSelections in confirmedWhiteCards" :key="playerSelections.id">
          {{ playerSelections.id }}
          <div class="scrolling-wrapper flex flex-nowrap overflow-x-auto">
            <WhiteCard
              v-for="card in playerSelections.cards"
              :key="card"
              :cardText="card">
            </WhiteCard>
          </div>
        </template>
      </template>
      <template v-else>
        <template v-if="playerHand.length">
          <div class="scrolling-wrapper flex flex-nowrap overflow-x-auto space-x-2">
              <WhiteCard
                v-for="(card, index) in playerHand" :key="card"
                v-on:select-card="selectCard"
                :cardText="card"
                :cardIndex="index"
                :selectedCards="chosenWhiteCards">
              </WhiteCard>
          </div>
        </template>
      </template>
    </section>
    <footer class="mt-8 space-y-4">
      <button
        v-if="!currentBlackCard"
        class="border border-white border-solid bg-gray-900 px-4 py-2 rounded-md text-white w-full" @click="chooseBlackCard">
        Black Card
      </button>
      <button
        v-if="!playerHand.length"
        class="border border-black border-solid bg-white px-4 py-2 rounded-md text-black w-full"
        @click="chooseHand">
        White Cards
      </button>
      <button
        class="border border-black border-solid bg-white px-4 py-2 rounded-md text-black w-full"
        @click="clearGame">
        New Game
      </button>
      <button
        class="border border-black border-solid bg-white px-4 py-2 rounded-md text-black w-full"
        @click="confirmCards">
        Confirm Cards
      </button>
      <button
        class="border border-black border-solid bg-white px-4 py-2 rounded-md text-black w-full"
        @click="setCzar">
        Set Czar
      </button>
    </footer>
  </main>
</template>

<style>
.scrolling-wrapper::-webkit-scrollbar {
  display: none;
}
</style>
