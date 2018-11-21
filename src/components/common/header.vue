<template>
  <div class="header">
    <img class="logo" src="../icon/logo.png" alt="logo">
    <div class="nav_wrapper">
      <div class="search">
        <el-input
          placeholder="请输入搜索内容"
          v-model="inputVal"
          clearable>
        </el-input>
        <el-button :round="false" type="primary" icon="el-icon-search" @click="search"></el-button>
      </div>
      <div class="album" v-show="!$route.path.includes('album')">
        <el-button :round="false" type="danger" @click="toAlbum">相册</el-button>
      </div>
    </div>

  </div>
</template>

<script>
export default {
  data() {
    return {
      inputVal: ''
    }
  },
  methods: {
    search() {
      // done
    },
    toAlbum() {
      // window.open(`album?userid=${this.$route.query.userid}`);
      this.$router.push(`/album?userid=${this.$route.query.userid}`);
    }
  }
}
</script>


<style lang="scss" scoped>
  .header {
    width: 100%;
    min-width: 1500px;
    height: 70px;
    padding: 0 100px;
    box-sizing: border-box;
    box-shadow: 0 1px 4px hsla(0 , 0%, 88.2%, .5);
    background-color: #fff;
    display: flex;
    justify-content: space-between;
    align-items: center;
    position: fixed;
    top: 0;
    left: 0;
    z-index: 10;
    .logo {
      width: 108px;
    }
    .nav_wrapper  {
      display: flex;
      justify-content: flex-start;
      align-items: center;
      .search {
        display: inherit;
        justify-content: flex-start;
        align-items: center;
      }
      .album {
        margin-left: 30px;
      }
    }
  }
</style>
