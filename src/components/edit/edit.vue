<template>
  <div class="container">
    <Header></Header>
    <div class="add-text">
      <div class="input-wrapper" v-for="(item, sub) in 3" :key="sub">
        <el-input v-model="info.title[sub].text" :placeholder="sub === 0 ? '添加标题' : (sub === 1 ? '添加二级标题' : '添加正文文字')" @focus="changeIndex(sub)"></el-input>
      </div>
    </div>
    <div class="content">
      <div class="preview">
        <div class="sub_wrapper">
          <div class="pic_style_wrapper" ref="coverImg">
            <div class="pic_style" :style="{transform: `scale(${scale / 100})`}">
              <img :src="url" alt="cover-img" class="cover-img" @load="getImgData">
              <div
                v-for="(item, sub) in 3"
                :key="sub"
                v-show="info.title[sub].text"
                ref="textBox"
                @mouseup="handlemouseup(sub, $event)"
                @mousedown="handlemousedown(sub, $event)"
                @mousemove="handlemousemove(sub, $event)"
                :style="{
                  left: `${info.title[sub].left}px`,
                  top: `${info.title[sub].top}px`,
                  zIndex: info.title[sub].zIndex,
                  fontSize: `${info.title[sub].fontSize}px`,
                  fontFamily: info.title[sub].fontFamily,
                  color: info.title[sub].color,
                  opacity: info.title[sub].opacity / 100,
                  transform: `rotate(${info.title[sub].rotate}deg)`,
                  fontStyle: info.title[sub].fontStyle,
                  fontWeight: info.title[sub].fontWeight,
                  textDecoration: info.title[sub].textDecoration,
                  textAlign: info.title[sub].textAlign,
                  letterSpacing: `${info.title[sub].letterSpacing}px`,
                }">
                {{info.title[sub].text}}
              </div>
            </div>
          </div>
          <div class="operation">
            <!-- <div>
              <img src="./icon/revoke.png">
              <span>撤销</span>
            </div> -->
            <div @click="rewrite">
              <img src="./icon/rewrite.png">
              <span>重做</span>
            </div>
            <div @click="createImg">
              <img src="./icon/preview.png">
              <span>预览</span>
            </div>
          </div>
        </div>
        <div class="size_scale_screen" v-if="img">
          <span>尺寸 {{`${img.width}x${img.height}px`}}</span>
          <span><span @click="changeSize(-5)">-</span> {{scale + '%'}} <span @click="changeSize(5)">+</span></span>
          <img src="./icon/full_screen.png" @click="previewImage">
        </div>
      </div>
      <div class="options-wrapper">
        <div class="options">
          <div class="title">文字编辑</div>
          <div class="setting">

            <div class="classify">
              <div class="text-setting">文本设置</div>
              <div class="font_wrapper">

                <div class="label">字体</div>

                <div class="font_family">
                  <el-select v-model="info.title[index].fontFamily" :disabled="lock[index]" size="small" class="one">
                    <el-option
                      v-for="item in options"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                      @change="changeFF">
                    </el-option>
                  </el-select>
                </div>

                <div class="font_color">
                  <el-color-picker :disabled="lock[index]" v-model="info.title[index].color" size="small"></el-color-picker>
                </div>
              </div>

              <div class="font_wrapper">

                <div class="label">大小</div>

                <div class="font_size">
                  <el-slider :disabled="lock[index]" v-model="info.title[index].fontSize" :max="40"></el-slider>
                </div>

                <div class="font_size_value">{{info.title[index].fontSize}}</div>
              </div>
              
              <div class="font_wrapper">

                <div class="label">透明</div>

                <div class="font_opacity">
                  <el-slider :disabled="lock[index]" v-model="info.title[index].opacity" :max="100"></el-slider>
                </div>

                <div class="font_opacity_value">{{info.title[index].opacity}}</div>
              </div>

              <div class="font_wrapper">

                <div class="label">旋转</div>

                <div class="font_rotate">
                  <el-slider :disabled="lock[index]" v-model="info.title[index].rotate" :max="360"></el-slider>
                </div>

                <div class="font_rotate_value">{{info.title[index].rotate}}</div>
              </div>
            </div>

            <div class="classify">
              <div class="text-setting">版式</div>

              <div class="font_wrapper">

                <div class="label">样式</div>

                <div class="font_style">
                  <span :class="info.title[index].fontWeight === 'bold' ? 'select_style' : ''" @click="changeStyle(0)">T</span>
                  <span :class="info.title[index].fontStyle === 'italic' ? 'select_style' : ''" @click="changeStyle(1)">T</span>
                  <span :class="info.title[index].textDecoration === 'underline' ? 'select_style' : ''" @click="changeStyle(2)">T</span>
                  <span :class="info.title[index].textDecoration === 'line-through' ? 'select_style' : ''" @click="changeStyle(3)">T</span>
                </div>

              </div>

              <div class="font_wrapper">

                <div class="label">对齐</div>

                <div class="font_text_align">
                  <div :class="info.title[index].textAlign === 'left' ? 'select_style' : ''" @click="changeAlign(0)">
                    <img src="./icon/left_align.png">
                  </div>
                  <div :class="info.title[index].textAlign === 'center' ? 'select_style' : ''" @click="changeAlign(1)">
                    <img src="./icon/middle.png">
                  </div>
                  <div :class="info.title[index].textAlign === 'right' ? 'select_style' : ''" @click="changeAlign(2)">
                    <img  src="./icon/right_align.png">
                  </div>
                </div>

              </div>

              <div class="font_wrapper spacing-wrapper">

                <div class="label">间距</div>

                <div class="spacing">
                  <div class="letter_spacing">
                    <img src="./icon/margin_2.png">
                    <div class="letter_spacing_wrapper">
                      <el-slider :disabled="lock[index]" v-model="info.title[index].letterSpacing" :max="50"></el-slider>
                    </div>
                    <div class="letter_spacing_value">{{info.title[index].letterSpacing}}</div>
                  </div>
                </div>

              </div>
            </div>

            <div class="classify">
              <div class="text-setting">操作</div>
              <div class="options-list">
                <div class="item" v-for="(item, sub) in operation" :key="sub" @click="setting(sub)">
                  <img :src="item.img">
                  <span>{{item.text}}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="download" @click="createImg">立即下载</div>
      </div>
    </div>

    <!-- 预览弹窗 -->
    <transition name="fade">
      <div class="download-popup" @mousewheel.prevent v-show="previewList.length > 0">
        <div class="popup">
          <i class="el-icon-circle-close-outline close" @click="previewList = []"></i>
          <div class="create_img" v-for="(item, sub) in previewList" :key="sub" :style="{backgroundImage: `url('${item.url}')`}" @mouseover="setIndex(sub)" @mouseout="removeIndex">
            <div v-if="sub === hoverIndex">
              <a :href="item.url" download="photo">立即下载</a>
            </div>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
import Header from "../common/header";
import {api, setHeader} from "@/assets/js/api";
export default {
  data() {
    return {
      url: null,
      img: null,
      scale: 100,
      fullscreen: false,
      options: [
        {
          value: "Arial",
          label: "Arial"
        }, {
          value: "宋体",
          label: "宋体"
        }, {
          value: "Avenir",
          label: "Avenir"
        }, {
          value: "微软雅黑",
          label: "微软雅黑"
        }
      ],
      index: 0,
      info: {
        img: "", //背景图片
        userid: '',
        title: [
          //标题对象
          {
            text: "", //文字
            fontFamily: "Arial", //字体
            color: "#FFFFFF", //颜色
            fontSize: 20, //大小
            opacity: 100, //透明度
            rotate: 0, //旋转
            fontStyle: "normal", //字样式  italic斜体
            fontWeight: "normal", //加粗 bold加粗
            textDecoration: "none", //划线   underline下划线  line-through删除线
            textAlign: "center", //对齐  left左对齐  right右对齐
            letterSpacing: 0, //字间距
            left: 0, //左距离
            top: 10, //上距离
            zIndex: 1 //层级
          },
          {
            text: "",
            fontFamily: "Arial",
            color: "#FFFFFF",
            fontSize: 20,
            opacity: 100,
            rotate: 0,
            fontStyle: "normal",
            fontWeight: "normal",
            textDecoration: "none",
            textAlign: "center",
            letterSpacing: 0,
            left: "",
            top: 30,
            zIndex: 2
          },
          {
            text: "",
            fontFamily: "Arial",
            color: "#FFFFFF",
            fontSize: 20,
            opacity: 100,
            rotate: 0,
            fontStyle: "normal",
            fontWeight: "normal",
            textDecoration: "none",
            textAlign: "center",
            letterSpacing: 0,
            left: "",
            top: 50,
            zIndex: 3
          }
        ]
      },
      operation: [
        {
          img: require("./icon/to_top.png"),
          text: "上移一层"
        },
        {
          img: require("./icon/to_bottom.png"),
          text: "下移一层"
        },
        {
          img: require("./icon/set_top.png"),
          text: "置顶"
        },
        {
          img: require("./icon/set_bottom.png"),
          text: "置底"
        },
        {
          img: require("./icon/delete.png"),
          text: "删除"
        },
        {
          img: require("./icon/lock.png"),
          text: "锁定"
        }
      ],
      surpLeft: 0,
      surpTop: 0,
      canMove: 3,
      mouse: {
        top: 0,
        left: 0
      },
      reset: [],
      lock: [false, false, false],
      previewList: [],
      hoverIndex: -1
    };
  },
  components: {
    Header
  },
  created() {
    this.info.userid = this.$route.query.userid;
    this.url = this.info.img = this.$route.query.url;
    if (this.$route.query.index !== undefined) {
      this.info = this.$store.state.imgInfo;
      this.info.title.push({
        text: "",
        fontFamily: "Arial",
        color: "#FFFFFF",
        fontSize: 20,
        opacity: 100,
        rotate: 0,
        fontStyle: "normal",
        fontWeight: "normal",
        textDecoration: "none",
        textAlign: "center",
        letterSpacing: 0,
        left: "",
        top: 50,
        zIndex: 3
      });
      this.$store.state.imgInfo.title.forEach(item => {
        this.reset.push({...item});
      });
    } else {
      this.info.title.forEach(item => {
        this.reset.push({...item});
      });
    }
  },
  mounted() {
    const {userid, code, verifycode, return_code} = this.$route.query;
    const data = {
      userid,
      code,
      pay_status: return_code - 0
    };
    if (userid && code && verifycode && return_code) {
      setHeader(verifycode);
      api({url: '/cp/getImgsByCode', data, form: true}).then(res => {
        this.info = res.list[0];
        this.previewList = res.list;
      }).catch(err => {
        alert('网络错误，请稍后重试');
      });
    };
  },
  methods: {
    removeIndex() {
      this.hoverIndex = -1;
    },
    setIndex(e) {
      this.hoverIndex = e;
    },
    createImg() {
      this.info.title.forEach((item, index) => {
        if (!item.color.includes('rgb')) {
          let rgb = 'rgb(';
          for (let i = 1; i < item.color.length; i += 2){
            const str = item.color[i] + item.color[i + 1];
            if (i < 5){
              rgb += parseInt(str, 16) + ',';
            }else{
              rgb += parseInt(str, 16) + ')';
            };
          };
          this.info.title[index].color = rgb;
        };
      });
      api({url: '/cp/updateImgas', data: this.info, form: false}).then(res => {
        this.$alert('即将进入支付链接', '提示:', {
          confirmButtonText: '确定',
          callback: action => {
            if (action === 'confirm') {
              window.open(res.obj.url);
            };
          }
        });
      }).catch(err => {
        alert('网络错误，请稍后重试');
      });
    },
    rewrite() {
      this.info.title.forEach((item, index) => {
        this.$set(this.info.title, index, {...this.reset[index]});
        this.$set(this.lock, index, false);
        this.index = 0;
        this.scale = 100;
      });
    },
    handlemousemove(sub, { clientX, clientY }) {
      if (this.canMove === sub && !this.lock[sub]) {
        this.info.title[sub].left = clientX - this.surpLeft - this.mouse.left;
        this.info.title[sub].top = clientY - this.surpTop - this.mouse.top;
      };
    },
    handlemouseup(sub) {
      this.info.title[sub].zIndex = this.info.title[sub].zIndex - 300 > 0 ? this.info.title[sub].zIndex - 300 : 1;
      this.mouse.left = this.mouse.top = 3;
      this.canMove = 3;
    },
    handlemousedown(sub, { clientX, clientY }) {
      this.info.title[sub].zIndex += 300;
      if (!this.surpLeft) {
        this.surpLeft = this.$refs.textBox[sub].getBoundingClientRect().left;
      }
      if (!this.surpTop) {
        this.surpTop = this.$refs.textBox[sub].getBoundingClientRect().top;
      }
      this.mouse.left = clientX - this.surpLeft - this.info.title[sub].left;
      this.mouse.top = clientY - this.surpTop - this.info.title[sub].top;
      this.canMove = sub;
    },
    setting(e) {
      if (!this.lock[this.index]) {
        if (e === 0) {
          this.info.title[this.index].zIndex += 1;
        } else if (e === 1) {
          if (this.info.title[this.index].zIndex > 1) {
            this.info.title[this.index].zIndex -= 1;
          };
        } else if (e === 2) {
          this.info.title.forEach(item => {
            if (this.info.title[this.index].zIndex < item.zIndex) {
              this.info.title[this.index].zIndex = item.zIndex + 1;
            };
          });
        } else if (e === 3) {
          this.info.title.forEach(item => {
            if (this.info.title[this.index].zIndex > item.zIndex && item.zIndex - 1 !== 0) {
              this.info.title[this.index].zIndex = item.zIndex - 1;
            };
          });
        } else if (e === 4) {
          this.$set(this.info.title, this.index, {...this.reset[this.index]});
        } else {
          const bool = !this.lock[this.index];
          this.$set(this.lock, this.index, bool);
        };
      } else {
        if (e === 5) {
          const bool = !this.lock[this.index];
          this.$set(this.lock, this.index, bool);
        };
      };
    },
    changeAlign(e) {
      if (!this.lock[this.index]) {
        if (e === 0) {
          this.info.title[this.index].textAlign = 'left';
        } else if (e === 1) {
          this.info.title[this.index].textAlign = 'center';
        } else {
          this.info.title[this.index].textAlign = 'right';
        };
      };
    },
    changeStyle(e) {
      if (!this.lock[this.index]) {
        const {fontWeight, fontStyle, textDecoration} = this.info.title[this.index];
        if (e === 0) {
          if (fontWeight === 'normal') {
            this.info.title[this.index].fontWeight = 'bold';
          } else {
            this.info.title[this.index].fontWeight = 'normal';
          };
        } else if (e === 1) {
          if (fontStyle === 'normal') {
            this.info.title[this.index].fontStyle = 'italic';
          } else {
            this.info.title[this.index].fontStyle = 'normal';
          };
        } else if (e === 2) {
          if (textDecoration === 'none' || textDecoration === 'line-through') {
            this.info.title[this.index].textDecoration = 'underline';
          } else {
            this.info.title[this.index].textDecoration = 'none';
          };
        } else {
          if (textDecoration === 'none' || textDecoration === 'underline') {
            this.info.title[this.index].textDecoration = 'line-through';
          } else {
            this.info.title[this.index].textDecoration = 'none';
          };
        };
      };
    },
    changeIndex(e) {
      this.index = e;
    },
    changeFF(e) {
      console.log(e);
    },
    changeSize(e) {
      if (
        (this.scale === 5 && e > 0) ||
        (this.scale === 100 && e < 0) ||
        (this.scale < 100 && this.scale > 5)
      ) {
        this.scale += e;
      };
    },
    getImgData() {
      this.img = new Image();
      this.img.src = this.url;
    },
    downloadFn(url) {
      const alink = document.createElement('a');
      alink.href = url;
      alink.download = 'photo';
      alink.click();
    },
    previewImage() {
      const el = this.$refs.coverImg;
      if (this.fullscreen) {
        if (document.exitFullscreen) {
          document.exitFullscreen();
        } else if (document.webkitCancelFullScreen) {
          document.webkitCancelFullScreen();
        } else if (document.mozCancelFullScreen) {
          document.mozCancelFullScreen();
        } else {
          document.msExitFullscreen();
        };
      } else {
        if (el.requestFullscreen) {
          el.requestFullscreen();
        } else if (el.webkitRequestFullScreen) {
          el.webkitRequestFullScreen();
        } else if (el.mozRequestFullScreen) {
          el.mozRequestFullScreen();
        } else {
          el.msRequestFullscreen();
        };
      };
      this.fullscreen = !this.fullscreen;
    }
  }
};
</script>

<style lang="scss" scoped>
  .container {
    box-sizing: border-box;
    display: flex;
    justify-content: flex-start;
    align-items: flex-start;
    -moz-user-select: none;
    -webkit-user-select: none;
    -ms-user-select: none;
    user-select: none;
    .add-text {
      width: 360px;
      height: 100vh;
      padding: 70px 30px;
      box-sizing: border-box;
      box-shadow: 0 1px 5px #c4c4c4;
      .input-wrapper {
        margin-top: 30px;
      }
    }
    .content {
      height: 100vh;
      flex: 1;
      margin-left: 1px;
      padding-top: 70px;
      box-sizing: border-box;
      display: inherit;
      justify-content: flex-start;
      align-items: flex-start;
      background: #f5f8fa;
      .preview {
        flex: 1;
        display: inherit;
        justify-content: center;
        align-items: center;
        .sub_wrapper {
          margin-top: 100px;
          display: inherit;
          justify-content: flex-start;
          align-items: flex-start;
          .pic_style_wrapper {
            display: flex;
            align-items: center;
            justify-content: center;
            .pic_style {
              position: relative;
              overflow: hidden;
              .cover-img {
                max-width: 700px;
                max-height: 700px;
              }
              & > div {
                width: 400px; 
                height: 50px;
                padding: 0 15px;
                box-sizing: border-box;
                border: 1px dashed transparent;
                line-height: 1;
                position: absolute;
                left: 0;
                top: 0;
                z-index: 1;
                font-size: 20px;
                color: #fff;
                text-align: center;
                line-height: 50px;
                overflow: hidden;
                cursor: move;
                will-change: left, top, transform, z-index, opacity, font-family,
                  text-align, font-size, color, text-decoration, letter-spacing,
                  font-weight, font-style;
                &:hover {
                  border: 1px dashed #fff;
                }
              }
            }
          }
          .operation {
            margin: 40px 0 0 25px;
            & > div {
              width: 45px;
              height: 50px;
              background-color: #646a74;
              box-shadow: 0 0 1px #000;
              display: flex;
              flex-direction: column;
              justify-content: center;
              align-items: center;
              img {
                width: 18px;
              }
              span {
                margin-top: 5px;
                font-size: 12px;
                color: #fff;
              }
            }
          }
        }
        .size_scale_screen {
          width: 400px;
          height: 40px;
          margin-left: -200px;
          background-color: #646a74;
          border-radius: 20px;
          position: fixed;
          bottom: 50px;
          left: 50%;
          z-index: 2;
          display: flex;
          justify-content: space-around;
          align-items: center;
          letter-spacing: 1px;
          font-size: 16px;
          color: #fff;
          & > img {
            width: 18px;
          }
          & > span:nth-child(2) {
            span {
              cursor: pointer;
            }
          }
        }
      }
      .options-wrapper {
        width: 300px;
        height: 100%;
        margin-right: 25px;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        .options {
          width: 100%;
          .title {
            width: 100%;
            height: 40px;
            background-color: #646a74;
            text-align: center;
            line-height: 40px;
            font-size: 16px;
            color: #fff;
          }
          .setting {
            background-color: #fff;
            padding: 0.1px 15px 15px;
            border-width: 0 1px 1px 1px;
            border-style: solid;
            border-color: #ececec;
            .classify {
              margin-top: 25px;
              .text-setting {
                font-size: 16px;
                font-weight: bold;
                color: #666;
              }
              .font_wrapper {
                margin-top: 15px;
                display: flex;
                justify-content: flex-start;
                align-items: center;
                .label {
                  font-size: 14px;
                  color: #999;
                }
                .font_family,
                .font_size,
                .font_opacity,
                .font_rotate {
                  margin: 0 15px;
                  flex: 1;
                }
                .font_size_value,
                .font_opacity_value,
                .font_rotate_value {
                  width: 50px;
                  height: 32px;
                  border: 1px solid #dcdfe6;
                  box-sizing: border-box;
                  line-height: 32px;
                  text-align: center;
                  font-size: 14px;
                  color: #606266;
                }
                .font_style,
                .font_text_align {
                  flex: 1;
                  height: 32px;
                  box-sizing: border-box;
                  margin-left: 15px;
                  border: 1px solid #dcdfe6;
                  display: inherit;
                  justify-content: flex-start;
                  align-items: center;
                  .select_style {
                    background: #f1f3f7;
                  }
                  & > span {
                    flex: 1;
                    height: 100%;
                    text-align: center;
                    line-height: 30px;
                    font-size: 18px;
                    color: #666;
                    cursor: pointer;
                  }
                  & > span:nth-child(1) {
                    font-weight: bold;
                  }
                  & > span:nth-child(2) {
                    font-style: italic;
                  }
                  & > span:nth-child(3) {
                    text-decoration: underline;
                  }
                  & > span:nth-child(4) {
                    text-decoration: line-through;
                  }
                }
                .font_text_align {
                  justify-content: space-around;
                  & > div {
                    width: 33%;
                    height: 100%;
                    display: inherit;
                    justify-content: center;
                    align-items: center;
                    & > img {
                      width: 24px;
                    }
                  }
                }
                .spacing {
                  flex: 1;
                  margin-left: 10px;
                  .letter_spacing,
                  .line_height {
                    display: flex;
                    justify-content: flex-start;
                    align-items: center;
                    img {
                      width: 18px;
                    }
                    .letter_spacing_wrapper,
                    .line_height_wrapper {
                      flex: 1;
                      margin: 0 15px;
                    }
                    .letter_spacing_value,
                    .line_height_value {
                      width: 40px;
                      height: 32px;
                      border: 1px solid #dcdfe6;
                      box-sizing: border-box;
                      line-height: 32px;
                      text-align: center;
                      font-size: 14px;
                      color: #606266;
                    }
                  }
                }
              }
              .options-list {
                margin-top: 15px;
                display: flex;
                flex-wrap: wrap;
                justify-content: flex-start;
                align-items: center;
                .item {
                  width: 33%;
                  margin-bottom: 15px;
                  display: inherit;
                  flex-direction: column;
                  justify-content: center;
                  align-items: center;
                  img {
                    width: 20px;
                    height: 20px;
                  }
                  span {
                    margin-top: 5px;
                    font-size: 12px;
                    color: #333;
                  }
                }
              }
              .spacing-wrapper {
                align-items: flex-start;
                .label {
                  margin-top: 10px;
                }
              }
            }
          }
        }
        .download {
          width: 100%;
          height: 40px;
          margin-top: 15px;
          background-color: #d43b33;
          text-align: center;
          line-height: 40px;
          font-size: 16px;
          color: #fff;
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
      z-index: 2002;
      display: flex;
      justify-content: center;
      align-items: center;
      .popup {
        width: 1100px;
        height: 700px;
        box-sizing: border-box;
        background: #fff;
        border-radius: 10px;
        position: relative;
        display: flex;
        flex-wrap: wrap;
        justify-content: space-around;
        align-items: center;
        .close {
          font-size: 40px;
          color: #fff;
          position: absolute;
          right: -50px;
          top: -20px;
          z-index: 12;
        }
        .create_img {
          width: 300px;
          height: 300px;
          background: center / cover;
          transition: transform .3s;
          will-change: transform;
          position: relative;
          &>div {
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, .5);
            display: flex;
            justify-content: center;
            align-items: center;
            a {
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
          }
          &:hover {
            transform: scale(1.1);
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
  }
</style>