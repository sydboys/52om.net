<template>
  <div class="container">
    <Header></Header>
    <div class="content">
      <div class="column" v-for="(items, column) in 5" :key="column">
        <div class="box" v-for="(item, index) in list" :key="index" v-if="(index - column) % 5 === 0" @mouseover="setIndex(index)" @mouseout="removeIndex">
          <img class="cover" :src="item" alt="cover-img">
          <transition name="fade">
            <div class="hover-box" v-if="index === hoverIndex">
              <div class="edit" @click="toEdit(item)">在线编辑</div>
              <a class="download" :href="item" download="photo">立即下载</a>
            </div>
          </transition>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Header from './common/header';
import { api, setHeader } from "@/assets/js/api";
export default {
  data() {
    return {
      start: 0,
      list: [],
      hoverIndex: -1,
    }
  },
  created() {
    this.getData();
  },
  mounted() {
    window.addEventListener('scroll', this.scrollBottom);
  },
  destroyed() {
    window.removeEventListener('scroll', this.scrollBottom);
  },
  components: {
    Header
  },
  methods: {
    // 加载更多
    scrollBottom() {
      function getScrollTop () {
        return document.documentElement.scrollTop || document.body.scrollTop;
      };
      if (document.documentElement.clientHeight + getScrollTop() >= document.body.clientHeight && getScrollTop() > 0) {
        this.start += 1;
        this.getData();
      };
    },
    toEdit(e) {
      // window.open();
      this.$router.push(`/edit?url=${e}&userid=${this.$route.query.userid}`);
    },
    removeIndex() {
      this.hoverIndex = -1;
    },
    setIndex(e) {
      this.hoverIndex = e;
    },
    getData() {
      const {userid, verifycode} = this.$route.query;
      setHeader(verifycode);
      api({
        url: '/cp/findImages',
        data: {
          start: this.start,
          userid
        },
        form: true
      }).then(res => {
        this.list = this.list.concat(res.list);
      }).catch(message => {
        this.$message.error({
          message
        });
      });
    }
  }
}
</script>

<style lang="scss" scoped>
  .container {
    min-height: 100vh;
    background-color: #f5f8fa;
    .content {
      width: 1500px;
      margin: 0 auto;
      padding-top: 90px;
      box-sizing: border-box;
      display: flex;
      justify-content: flex-start;
      align-items: flex-start;
      .column {
        width: 280px;
        .box {
          width: 280px;
          min-height: 140px;
          max-height: 450px;
          margin-bottom: 25px;
          overflow: hidden;
          border-radius: 4px;
          box-shadow: 0 2px 4px 0 rgba(152, 152, 152, .5);
          position: relative;
          .cover {
            width: 100%;
          }
          .hover-box {
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, .5);
            position: absolute;
            top: 0;
            left: 0;
            z-index: 1;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            .edit, .download {
              width: 180px;
              height: 46px;
              background: linear-gradient(135deg, rgba(255, 84, 84, 1), rgba(255, 111, 131, 1), rgba(255, 125, 156, 1));
              border-radius: 4px;
              line-height: 46px;
              text-align: center;
              font-size: 16px;
              color: #fff;
              text-decoration: none;
            }
            .edit {
              margin-bottom: 20px;
            }
          }
        }
      }
      .column+.column {
        margin-left: 25px;
      }
    }
    .download-popup {
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 0, .5);
      position: fixed;
      top: 0;
      left: 0;
      z-index: 11;
      display: flex;
      justify-content: center;
      align-items: center;
      .popup {
        width: 850px;
        height: 550px;
        padding: .1px 50px 0;
        box-sizing: border-box;
        background: #fff;
        border-radius: 10px;
        position: relative;
        .close {
          font-size: 40px;
          color: #fff;
          position: absolute;
          right: -50px;
          top: -20px;
          z-index: 12;
        }
        .type_size {
          margin-top: 40px;
          color: #333;
          .type {
            font-size: 18px;
            &::before {
              content: '曲风:';
              margin-right: 8px;
              color: #666;
            }
          }
          .size {
            margin-left: 25px;
            font-size: 18px;
            &::before {
              content: '尺寸:';
              margin-right: 8px;
              color: #666;
            }
          }
        }
        .setting {
          width: 100%;
          margin-top: 40px;
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          .cover-img {
            width: 400px;
            height: 400px;
            background: top / cover;
          }
          .options {

            .title {
              margin-bottom: 30px;
              font-size: 18px;
              color: #333;
            }
            &>div {
              width: 300px;
              margin-bottom: 15px;
              display: flex;
              justify-content: flex-start;
              align-items: center;
              .label {
                margin-right: 20px;
                font-size: 16px;
                color: #999;
              }
              .wrapper {
                flex: 1;
                .one {
                  width: 100%;
                }
              }
            }
            .font-style {
              .wrapper {
                display: flex;
                justify-content: space-between;
                align-items: center;
              }
            }
            .common-css {
              .wrapper {
                display: flex;
                justify-content: space-between;
                align-items: center;
                &>div:nth-child(1) {
                  flex: 1;
                }
                .preview_font_size, .preview_opacity, .preview_rotate {
                  width: 40px;
                  height: 28px;
                  padding-left: 5px;
                  margin-left: 15px;
                  border: 1px solid #ececec;
                  box-sizing: border-box;
                  line-height: 28px;
                  font-size: 14px;
                  color: #666;
                }
              }
            }
            .download_now {
              margin: 72px auto 0;
              width: 150px;
              height: 40px;
              justify-content: center;
              background: #e91d01;
              font-size: 16px;
              color: #fff;
            }
          }
        }
      }
    }
    .fade-enter-active, .fade-leave-active {
      transition: opacity .2s;
    }
    .fade-enter, .fade-leave-to {
      opacity: 0;
    }
    .download-btn {
      display: none;
    }
  }
</style>