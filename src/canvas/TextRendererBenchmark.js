/**
 * A simple mithril component to benchmark drawing many texts directly onto
 * a visible canvas element. Rendering 1000 words takes approximately 30ms; the
 * timings vary greatly depending on which font is set in the drawing context,
 * and so several font results are averaged.

Drawing directly to canvas is not effected by large typefaces, e.g. > 14px

non-optimized canvas.fillText() of 1000 words using 18px monospace took 38 ms
non-optimized canvas.fillText() of 1000 words using 14px serif took 42 ms
non-optimized canvas.fillText() of 1000 words using 12px sans-serif took 41 ms
average ms 40

Using the offscreen drawing method with large typefaces results in a huge blowout
* presumably because of the increased pixel area used by drawImage

new TextAtlas() of 1000 words took 151 ms (one time)

optimized canvas.drawImage() of 1000 words using 18px monospace took 5627 ms*******
optimized canvas.drawImage() of 1000 words using 14px serif took 21 ms
optimized canvas.drawImage() of 1000 words using 12px sans-serif took 17 ms
average ms 1888

However, for small typefaces, i.e. < 14px, there is a nice speedup using the
offscreen drawing, which is more than 2X faster.

non-optimized canvas.fillText() of 1000 words using 10px monospace took 36 ms
non-optimized canvas.fillText() of 1000 words using 14px serif took 47 ms
non-optimized canvas.fillText() of 1000 words using 12px sans-serif took 50 ms
average ms 44

new TextAtlas() of 1000 words took 146 ms (one time)
optimized canvas.drawImage() of 1000 words using 10px monospace took 14 ms
optimized canvas.drawImage() of 1000 words using 14px serif took 19 ms
optimized canvas.drawImage() of 1000 words using 12px sans-serif took 18 ms
average ms 17
 */
import m from 'mithril';
import {TextAtlas} from './TextAtlas';

const fonts = [
  '10px monospace',
  '14px serif',
  '12px sans-serif'
];

export class TextRendererBenchmark {

  /**
   * create a TextRendererBenchmark
   * @param Object - parameters object with following properties:
   * @param Array - words, an array of words to rendered
   * @param Number - width, of canvas
   * @param Number - height, of canvas
   * @param Boolean - useOffscreenAtlas, offscreen drawing optimization
   */
  constructor({words, width, height, useOffscreenAtlas}) {
    this.words = words;
    this.width = width;
    this.height = height;
    this.useOffscreenAtlas = useOffscreenAtlas;
  }

  /**
   * mithril lifecycle method
   */
  oncreate(vnode) {
    this.canvas = vnode.dom;
    this.useOffscreenAtlas ? this._drawOffScreen() : this._drawOnScreen();
  }

  _drawOffScreen() {
    let elapsedTime = 0;
    let t0 = performance.now();
    const atlas = new TextAtlas({
      words: this.words,
      fonts: fonts
    });
    let t1 = performance.now();
    let delta =  Math.floor(t1 - t0);
    // eslint-disable-next-line no-console
    console.log(`new TextAtlas() of ${this.words.length} words took ${delta} ms (one time)`);
    const ctx = this.canvas.getContext('2d');
    elapsedTime = 0;
    fonts.forEach( font => {
      ctx.font = font;
      t0 = performance.now();
      this.words.forEach( word => {
        const x = Math.floor(this.width * Math.random() );
        const y = Math.floor(this.height * Math.random() );
        atlas.draw({
          ctx: ctx,
          word: word,
          font: font,
          x: x,
          y: y
        });
      });
      t1 = performance.now();
      delta =  Math.floor(t1 - t0);
      // eslint-disable-next-line no-console
      console.log(`optimized canvas.drawImage() of ${this.words.length} words using ${font} took ${delta} ms`);
      elapsedTime += delta;
    });
    const avg = Math.floor(elapsedTime / fonts.length);
    // eslint-disable-next-line no-console
    console.log('average ms', avg);
  }

  _drawOnScreen() {
    const ctx = this.canvas.getContext('2d');
    let elapsedTime = 0;
    fonts.forEach( font => {
      ctx.font = font;
      const t0 = performance.now();
      this.words.forEach( word => {
        const x = Math.floor(this.width * Math.random() );
        const y = Math.floor(this.height * Math.random() );
        ctx.fillText(word, x, y);
      });
      const t1 = performance.now();
      const delta =  Math.floor(t1 - t0);
      // eslint-disable-next-line no-console
      console.log(`non-optimized canvas.fillText() of ${this.words.length} words using ${font} took ${delta} ms`);
      elapsedTime += delta;
    });
    const avg = Math.floor(elapsedTime / fonts.length);
    // eslint-disable-next-line no-console
    console.log('average ms', avg);
  }

  /**
   * mithril render method
   */
  view() {
    return m('canvas', { width: this.width, height: this.height, 'moz-opaque' : ''} );
  }
}
