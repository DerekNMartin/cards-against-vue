<template>
  <div @click="selectCard(card)" class="card">
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
  props: ['cardText', 'cardIndex'],
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
      }
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
    flex: 0 0 auto;
    border-radius: 5px;
    border: 3px solid;
    color: #000000;
    text-align: left;
    width: 250px;
    height: 350px;
    padding: 1em;
    background: #FFFFFF;
    position: relative;
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
