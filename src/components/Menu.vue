<template>
<div class="menu menu-bar">
  <template v-if="showMenu">
    <div class="menu--open">
      <div @click="toggleMenu" class="menu__toggle">
        <img class="menu__toggle-icon" src="../assets/x.svg">
      </div>
      <button class="button-primary" @click="emitNewGame()">New Game</button>
      <button class="button-primary" @click="emitSetCzar()">Choose Czar</button>
      <button class="button-primary" @click="emitSetPlayer()">Become Player</button>
    </div>
  </template>
  <template v-else> 
    <div @click="toggleMenu" class="menu__toggle">
      <img class="menu__toggle-icon" src="../assets/menu.svg">
    </div>
  </template>
</div>
</template>

<script>
module.exports = {
  name: 'Menu',
  data() {
    return {
      showMenu: true,
    }
  },
  methods: {
    emitSetCzar() {
      this.$emit('setCzar')
    },
    emitSetPlayer() {
      this.$emit('setPlayer')
    },
    emitNewGame() {
      this.$emit('setNewGame')
    },
    toggleMenu() {
      this.showMenu = !this.showMenu
    },
  },
}
</script>

<style scoped lang='scss'>
  .menu {
    width: 90%;
    position: fixed;
    z-index: 999;
    &-bar {
      padding: 1em;
    }
    &--open {
      padding: 2em;
      border-radius: 10px;
      box-shadow: 0 15px 30px 0 rgba(0,0,0,0.11),
                  0 5px 15px 0 rgba(0,0,0,0.08);
      background: #FFFFFF;
    }
    &__toggle {
      display: flex;
      justify-content: flex-end;
      align-items: flex-end;
      &-icon {
        transition: transform 0.3s ease-in-out;
        &:hover {
          transform: scale(1.2);
          cursor: pointer;
          color: #33C3F0;
        }
      }
    }
  }
</style>
