<template>
  <div class="card">
    <div class="card__text">
      {{ cardText | blankSpace | breakString | specialCharacters }}
    </div>
    <div class="card__footer">
      Cards Against Vue
    </div>
  </div>
</template>

<script>
module.exports = {
  name: 'BlackCard',
  props: ['cardText'],
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
}
</script>

<style scoped lang='scss'>
  .card {
    display: inline-table;
    border: 3px solid;
    border-radius: 5px;
    color: #FFFFFF;
    text-align: left;
    width: 250px;
    height: 350px;
    padding: 1em;
    background: #000000;
    position: relative;
    &__text {
      font-size: 1.5em;
      font-weight: 600;
    }
    &__footer {
      position: absolute;
      font-weight: 600;
      padding-bottom: 1em;
      bottom: 10px;
    }
  }
</style>
