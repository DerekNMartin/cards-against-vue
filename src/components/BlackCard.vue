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
    background: #181A24;
    border: 1px solid #E7E7E7;
    box-sizing: border-box;
    border-radius: 10px;
    font-weight: bold;
    line-height: normal;
    font-size: 1em;
    color: #FFFFFF;
    text-align: left;
    width: 250px;
    height: 350px;
    padding: 1em;
    margin: 0 auto;
    box-shadow: 2px 2px 10px rgba(24, 26, 36, 0.25);
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
