export default class Toast {
  constructor() {
    this.duration = 5000;
    this.el = document.createElement('div');
    this.setStyles();
    document.body.appendChild(this.el);
  }

  setStyles() {
    this.el.style.transition = 'opacity 1s ease-in-out';
    this.el.style.position = 'fixed';
    this.el.style.left = '0';
    this.el.style.bottom = '30px';
    this.el.style.right = '0';
    this.el.style.opacity = 0;
  }

  notPlaying() {
    this.el.innerHTML = `
      <h1 style="color: #fff; float: left; line-height: 80px; font-size: 18px; padding: 0 30px;">No song currently playing.</h1>
    `;

    this.show();
  }

  nowPlaying(track) {
    this.el.innerHTML = `
      <div class="container" style="margin-bottom: 30px;">
        <img src="${track.artwork}" style="width: 100px; height: 100px; float: left;" />
        <h1 style="font-family: Economica, sans-serif; text-transform: uppercase; color: #fff; float: left; margin-top: 25px; line-height: 25px; font-size: 18px; padding: 0 20px;">
          ${track.title}<br/>
          <span style="font-size: .7em;">${track.artist}</span>
        </h1>
      </div>
    `;

    this.show();

    setTimeout(() => {
      this.hide();
    }, this.duration);
  }

  show() {
    setTimeout(() => {
      this.el.style.opacity = 1;
    }, 20);
  }

  hide() {
    setTimeout(() => {
      this.el.style.opacity = 0;
    }, 20);
  }
}