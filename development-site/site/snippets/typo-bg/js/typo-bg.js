import Component from 'gia/Component';

export default class TypoBg extends Component {
  constructor(el, options) {
    super(el);

    this.ref = {
      video: null,
    };

    this.options = { ...options };
  }

  mount() {
    this.play();
  }

  // Safari sometimes ignores the muted/autoplay/playsinline HTML attributes
  // and shows a paused play-button overlay instead of autoplaying.
  play() {
    const video = this.ref.video;

    video.muted = true;
    video.playsInline = true;

    video.play()?.catch(() => {});
  }
}
