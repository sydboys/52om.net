<template>
  <div class="container">
    <Header></Header>
    <div class="content">
      <div class="column" v-for="(items, column) in 5" :key="column">
        <div class="upload" v-if="(0 - column) % 5 === 0">
          <!-- 
            :auto-upload="false" -->
          <el-upload
            class="upload-demo"
            drag
            action="https/cp/uploadImgByUsers"
            :data="imgData"
            :show-file-list="false"
            :on-error="handleError"
            :on-success="handleSuccess"
            :before-upload="handleUpload">
            <i class="el-icon-upload"></i>
            <div class="el-upload__text">只能上传jpg/png文件，且不超过<em>500kb</em></div>
          </el-upload>
        </div>
        <div class="box" v-for="(item, index) in list" :key="index" v-if="(index + 1 - column) % 5 === 0" @mouseover="setIndex(index)" @mouseout="removeIndex">
          <img class="cover" :src="item.url" alt="cover-img">
          <transition name="fade">
            <div class="hover-box" v-if="index === hoverIndex">
              <div class="edit" @click="toEdit(item.url)">在线编辑</div>
              <a class="download" :href="item.url" download="photo">立即下载</a>
            </div>
          </transition>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Header from '../common/header';
import { api } from "@/assets/js/api";
export default {
  data() {
    return {
      start: 0,
      list: [],
      hoverIndex: -1,
      imgData: {
        img:'',
        userid: ''
      }
    }
  },
  created() {
    this.getList();
    this.imgData.userid = this.$route.query.userid;
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
    handleUpload(file) {
      this.imgData.img = file;
    },
    handleSuccess(response, file, fileList) {
      this.$notify({
        title: '上传成功',
        message: '上传图片成功，即将自动刷新',
        type: 'success',
        duration: 2000
      });
      setTimeout(() => {
        this.start = 0;
        this.getList();
      }, 1500);
    },
    handleError(err, file, fileList) {
      this.$notify({
        title: '上传失败',
        message: '网络出错，请稍后重试',
        type: 'error',
        duration: 1500
      });
    },
    toEdit(e) {
      // window.open();
      this.$router.push(`/edit?url=${e}&userid=${this.$route.query.userid}`);
    },
    scrollBottom() {
      function getScrollTop () {
        return document.documentElement.scrollTop || document.body.scrollTop;
      };
      if (document.documentElement.clientHeight + getScrollTop() >= document.body.clientHeight && getScrollTop() > 0) {
        this.start += 1;
        this.getList();
      };
    },
    removeIndex() {
      this.hoverIndex = -1;
    },
    setIndex(e) {
      this.hoverIndex = e;
    },
    getList() {
      api({
        url: '/cp/findImgs',
        data: {
          userid: this.$route.query.userid,
          start: this.start
        },
        form: true
      }).then(res => {
        if (this.start === 0) {
          this.list = res.list;
        } else {
          this.list = [...this.list, ...res.list];
        };
      }).catch(err => {
        console.log(err);
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
        .upload {
          width: 280px;
          height: 180px;
          margin-bottom: 25px;
        }
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
    .fade-enter-active, .fade-leave-active {
      transition: opacity .2s;
    }
    .fade-enter, .fade-leave-to {
      opacity: 0;
    }
  }
</style>
