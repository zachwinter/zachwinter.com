export default class Toast {
  constructor() {
    this.duration = 5000;
    this.el = document.createElement('div');
    this.setStyles();
    document.querySelector('.logo').appendChild(this.el);
  }

  setStyles() {
    this.el.style.transition = 'opacity 1s ease-in-out';
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
      <img src="${track.artwork}" style="position: absolute; top: 0; left: 0; width: 100%; height: 100%;" />
      <h1 style="position: absolute; left: 100%; top: 50%; transform: translateY(-50%); font-family: Economica, sans-serif; text-transform: uppercase; color: #fff; line-height: 20px; font-size: 18px; padding-left: 15px;">
        ${track.title}<br/>
        <span style="font-size: .7em;">${track.artist}</span>
      </h1>
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