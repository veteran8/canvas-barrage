let data = [
  { value: "第一个弹幕", speed: 1, time: 0, color: "red", fontSize: 40 },
  { value: "第二个弹幕", speed: 2, time: 0 }
];
let $ = document.querySelector.bind(document);
let canvas = $("#canvas");
let video = $("#video");
class Barrage {
  constructor(obj, ctx) {
    this.value = obj.value;
    this.time = obj.time;
    this.obj = obj;
    this.ctx = ctx;
  }
  init() {
    this.opacity = this.obj.opacity || this.ctx.opacity;
    this.color = this.obj.color || this.ctx.color;
    this.fontSize = this.obj.fontSize || this.ctx.fontSize;
    this.speed = this.obj.speed || this.ctx.speed;
    //求弹幕自己的宽度,判读是否还需要绘制
    let span = document.createElement("span");
    span.innerText = this.value;
    span.style.font = this.fontSize + "px";
    span.style.position = "absolute";
    document.body.appendChild(span);
    this.width = span.clientWidth;
    document.body.removeChild(span);
    //弹幕出现的位置
    this.x = this.ctx.canvas.width;
    this.y = this.ctx.canvas.height * Math.random();
    if (this.y < this.fontSize) {
      this.y = this.fontSize;
    }
    if (this.y > this.ctx.canvas.height - this.fontSize) {
      this.y = this.ctx.canvas.height - this.fontSize;
    }
  }
  render() {
    this.ctx.context.font = this.fontSize + "px" + " Arial";
    this.ctx.context.fillStyle = this.color;
    this.ctx.context.fillText(this.value, this.x, this.y);
  }
}
class CanvasBarrage {
  constructor(canvas, video, options = {}) {
    if (!canvas || !video) {
      return;
    }
    this.canvas = canvas;
    this.video = video;
    this.context = canvas.getContext("2d");
    this.canvas.width = video.clientWidth;
    this.canvas.height = video.clientHeight;
    let defaultOptions = {
      fontSize: 20,
      color: "gold",
      speed: 2,
      opacity: 0.4,
      data: []
    };
    Object.assign(this, defaultOptions, options);
    this.isPaused = true;
    this.barrages = this.data.map(obj => {
      return new Barrage(obj, this);
    });
    // this.render();
  }
  render() {
    //先清空,没有暂停就渲染
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.renderBarrage();
    if (!this.isPaused) {
      requestAnimationFrame(this.render.bind(this));
    }
  }
  renderBarrage() {
    let time = this.video.currentTime;
    this.barrages.forEach(barrage => {
      if (!barrage.flag && time >= barrage.time) {
        //先去初始化,初始化后再绘制
        if (!barrage.isInited) {
          barrage.init();
          barrage.isInited = true;
        }
        barrage.x -= barrage.speed;
        barrage.render(); //渲染自己
        if (barrage.x <= barrage.width * -1) {
          barrage.flag = true; //停止渲染标记
        }
      }
    });
  }
  add(obj) {
    this.barrages.push(new Barrage(obj, this));
  }
  reset() {
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    let time = this.video.currentTime;
    this.barrages.forEach(barrage => {
      barrage.flag = false;
      if (time <= barrage.time) {
        barrage.isInited = false;
      } else {
        barrage.flag = true; //其他弹幕不再渲染
      }
    });
  }
}
let canvasBarrage = new CanvasBarrage(canvas, video, { data });
video.addEventListener("play", () => {
  canvasBarrage.isPaused = false;
  canvasBarrage.render();
});
video.addEventListener("pause", () => {
  canvasBarrage.isPaused = true;
});
video.addEventListener("seeked", () => {
  canvasBarrage.reset();
});
$("#add").addEventListener("click", () => {
  let value = $("#text").value;
  let time = video.currentTime;
  let color = $("#color").value;
  let fontSize = $("#range").value;
  let obj = { time, value, color, fontSize };
  canvasBarrage.add(obj);
});
