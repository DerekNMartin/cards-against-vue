<template>
  <div @click="selectCard(card)"
  :class="isSelected ? 'card card--selected' : 'card'">
    <div class="card__text">
      {{ cardText | specialCharacters }}
    </div>
    <div class="card__footer">
      <div class="card__footer-title">
        Cards Against Vue
      </div>
      <div class="card__footer-index">
        {{ cardIndex }}
      </div>
    </div>
  </div>
</template>

<script>
module.exports = {
  name: 'WhiteCard',
  props: ['cardText', 'cardIndex', 'selectedCards'],
  filters: {
    specialCharacters: (value) => {
      let formated = value
      formated = formated.replace(/&trade;/g, '™')
      formated = formated.replace(/&reg;/g, '®')
      formated = formated.replace(/&Uuml;/g, 'Ü')
      return formated
    },
  },
  /* eslint-disable object-shorthand, func-names */
  computed: {
    card: function () {
      return {
        text: this.cardText,
        index: this.cardIndex,
        selected: this.isSelected,
      }
    },
    isSelected: function () {
      if (this.selectedCards) {
        return (this.selectedCards.indexOf(this.cardText) !== -1)
      }
      return false
    },
  },
  /* eslint-enable object-shorthand, func-names */
  methods: {
    selectCard(card) {
      this.$emit('select-card', card)
    },
  },
}
</script>

<style scoped lang='scss'>
  .card {
    background: #FFFFFF;
    border: 1px solid #E7E7E7;
    box-sizing: border-box;
    border-radius: 10px;
    font-weight: bold;
    line-height: normal;
    font-size: 1em;
    color: #181A24;
    flex: 0 0 auto;
    text-align: left;
    width: 250px;
    height: 350px;
    padding: 1em;
    margin: 1em;
    position: relative;
    box-shadow: 2px 2px 10px rgba(24, 26, 36, 0.25);
    transition: transform 0.2s ease-in-out, box-shadow 0.1s ease-in;
    &--selected {
      box-shadow: 2px 15px 30px rgba(24, 26, 36, 0.15);
      transform: scale(1.1)
    }
    &__text {
      font-size: 1.5em;
      font-weight: 600;
    }
    &__footer {
      width: 85%;
      font-weight: 600;
      padding-bottom: 1em;
      position: absolute;
      bottom: 10px;
      &-title {
        display: inline-block;
      }
      &-index {
        position: absolute;
        display: inline-block;
        right: 0;
      }
    }
  }
</style>
