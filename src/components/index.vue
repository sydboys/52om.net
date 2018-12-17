<template>
  <div class="container" v-loading="loading" element-loading-text="拼命加载中">
    <Header></Header>
    <div class="chooseImg">
      <div class="style">
        <span class="style_label">曲风：</span>
        <span :class="['style_item', sing.tag === item ? 'current_item' : '']" v-for="(item, index) in styleList" :key="index" @click="chooseStyle(item)">{{item}}</span>
      </div>
      <div class="input_name_singer">
        <span class="name">歌曲名称：</span>
        <input class="input_name" type="text" v-model="sing.song_name">
        <span class="singer">歌手：</span>
        <input class="input_singer" type="text" v-model="sing.singer_name">
        <span class="generateImg" @click="generateImg">生成海报</span>
      </div>
    </div>
    <div class="content">
      <div class="content_wrapper" v-if="list.length > 0">
        <div class="box" v-for="(item, index) in list" :key="index" @mouseover="setIndex(index)" @mouseout="removeIndex">
          <img class="cover" :src="item.url" alt="cover-img">
          <transition name="fade">
            <div class="hover-box" v-if="index === hoverIndex">
              <div class="edit" @click="toEdit(item.img, index)">在线编辑</div>
              <a class="download" :href="item.url" download="photo">立即下载</a>
            </div>
          </transition>
        </div>
      </div>
      
      <div class="content_wrapper" v-else>
        <div class="box" v-for="(item, index) in 8" :key="index"></div>
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
      loading: false,
      list: [],
      hoverIndex: -1,
      styleList: ['流行', '摇滚', '民谣', '电子', '说唱', '轻音乐', '爵士', '乡村', 'R&B/soul', '古典', '民族', '英伦', '金属'],
      sing: {
        tag: '',
        userid: '',
        song_name: '',
        singer_name: '',
      },
    }
  },
  created() {
    const {userid, verifycode} = this.$route.query;
    this.sing.userid = userid;
    setHeader(verifycode);
  },
  components: {
    Header
  },
  methods: {
    generateImg() {
      if (this.sing.tag === '') {
        this.$message({
          message: '请选择曲风',
          type: 'warning'
        });
      } else if (!this.sing.song_name) {
        this.$message({
          message: '请填写歌曲名称',
          type: 'warning'
        });
      } else if (!this.sing.singer_name) {
        this.$message({
          message: '请填写歌手',
          type: 'warning'
        });
      } else {
        this.loading = true;
        api({url: '/cp/newAddImages', data: this.sing}).then(res => {
          this.list = res.list;
        }).catch(err => {
          this.$message({
            message: '网络错误，请稍后重试',
            type: 'warning',
          });
        }).finally(() => {
          this.loading = false;
        });
      }
    },
    chooseStyle(item) {
      if (this.sing.tag !== item) {
        this.sing.tag = item;
      }
    },
    toEdit(img, index) {
      this.$store.commit('setImgInfo', this.list[index]);
      this.$router.push(`/edit?url=${img}&userid=${this.$route.query.userid}&index=${index}`);
    },
    removeIndex() {
      this.hoverIndex = -1;
    },
    setIndex(e) {
      this.hoverIndex = e;
    },
    getData() {
      api({
        url: '/cp/findImages',
        params: {
          start: this.start,
          userid
        },
        method: 'get',
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
    .chooseImg {
      background-color: #fff;
      padding: 90px 0 20px 100px;
      .style {
        .style_label {
          color: #777;
          font-size: 14px;
          margin-right: 15px;
        }
        .style_item {
          color: #333;
          cursor: pointer;
          font-size: 14px;
          margin-right: 35px;
        }
        .current_item {
          color: #e91d01;
        }
      }
      .input_name_singer {
        display: flex;
        margin-top: 20px;
        align-items: center;
        justify-content: flex-start;
        .name, .singer {
          color: #777;
          font-size: 14px;
          margin-right: 15px;
        }
        .input_name, .input_singer {
          width: 200px;
          height: 30px;
          color: #333;
          outline: none;
          font-size: 14px;
          padding: 0 15px;
          margin-right: 30px;
          box-sizing: border-box;
          border: 1px solid #ececec;
        }
        .generateImg {
          width: 100px;
          height: 30px;
          color: #fff;
          font-size: 14px;
          line-height: 30px;
          text-align: center;
          background: #e91d01;
          cursor: pointer;
        }
      }
    }
    .content {
      width: 1500px;
      margin: 0 auto;
      padding-top: 25px;
      box-sizing: border-box;
      .content_wrapper {
        display: flex;
        flex-wrap: wrap;
        align-items: flex-start;
        justify-content: space-between;
        .box {
          width: 340px;
          overflow: hidden;
          min-height: 340px;
          border-radius: 4px;
          position: relative;
          margin-bottom: 25px;
          box-shadow: 0 2px 4px 0 rgba(152, 152, 152, .5);
          background: url('./icon/554f63040df677a5741417a86d90678.png') center / cover;
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