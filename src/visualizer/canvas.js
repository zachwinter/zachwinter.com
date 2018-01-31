export default class Canvas {
  constructor(canvas) {
    this.isMobile = window.matchMedia('(max-width: 480px)').matches;
    this.hidpi = window.matchMedia('only screen and (-webkit-min-device-pixel-ratio: 1.3), not all, not all, only screen and (-webkit-min-device-pixel-ratio: 1.30208333333333), not all, only screen and (min-resolution: 125dpi), not all, only screen and (min-resolution: 1.3dppx)');
    this.node = document.getElementById(canvas);
    this.width = window.innerWidth;
    this.height = window.innerHeight;
    this.node.width = this.width;
    this.node.height = this.height;
    this.node.style.width = this.width + 'px';
    this.node.style.height = this.height + 'px';

    if (this.isMobile) {
      this.width = window.innerWidth * 2;
      this.height = window.innerHeight * 2;
      this.node.width = this.width;
      this.node.height = this.height;
      this.node.style.width = this.width/2 + 'px';
      this.node.style.height = this.height/2 + 'px';
    }

    this.ctx = this.node.getContext('2d');
    this.stars = [];
    this.background = {};
    this.raf;
    this.isInitialized = false;
    this.isPainting = false;
  }

  addStar(el) {
    this.stars.push(el);
  }

  addBackground(el) {
    this.background = el;
  }

  paint() {
    this.ctx.clearRect(0, 0, this.node.width, this.node.height);

    this.background.draw(this.ctx);

    this.stars.forEach((el) => {
      el.draw(this.ctx);
    });

    this.raf = requestAnimationFrame(this.paint.bind(this));
  }

  startPaint() {
    this.paint();
    this.isPainting = true;
  }

  stopPaint() {
    cancelAnimationFrame(this.raf);
    this.isPainting = false;
  }

  init() {
    if (this.isInitialized === false) {
      this.startPaint();
      this.isPainting = true;
      this.isInitialized = true;
    }
  }
}