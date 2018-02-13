/**
 * Pre-render text to an offscreen canvas, the technique is based on:
 * https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API/Tutorial/Optimizing_canvas
 */

export class TextAtlas {
  /**
   * create a TextAtlas
   * @param Object - parameters object with properties:
   * @param Array - words: an array of words of phrases to be rendered
   * @param Array - fonts: array of font definitions, default ['12px sans-serif']
   * @param Number - lineHeight: will default to 1.5 times the font size in pixels
   * @param Boolean - fill: whether to fill, or stroke (default true)
   */
  constructor({
                words,
                fonts = ['16px sans-serif'],
                fill = true,
              }) {
    this.words = words;
    this.fonts = fonts;
    this.fill = fill;
    this.atlases = {};
    this.words.sort((a, b) => a.length > b.length ? -1 : 1);
    this._initCanvases();
    this._prepareAtlases();
  }

  /**
   * create a data structure for each font -> { canvas, 2d context, etc.. }
   */
  _initCanvases() {
    this.fonts.forEach(font => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      ctx.font = font;
      // estimate height and width required for the canvas
      const lineHeight = Math.ceil(parseInt(font) * 1.5);
      // words were sorted by length in constructor
      const lineWidth = Math.ceil(ctx.measureText(this.words[0]).width);
      canvas.height = lineHeight * this.words.length;
      canvas.width = lineWidth;
      // setting the width and height resets the context, so set the font again.
      ctx.font = font;
      ctx.save();
      this.atlases[font] = {ctx, canvas, lineHeight, lineWidth};
    });
  }

  /**
   * draw all the words on each font -> atlas and build an index for retrieval
   */
  _prepareAtlases() {
    this.index = {};
    this.fonts.forEach(font => {
      const atlas = this.atlases[font];
      const lineHeight = atlas.lineHeight;
      const ctx = atlas.ctx;
      let cursor = lineHeight;
      ctx.font = font;
      this.words.forEach(word => {
        if (!this.index[word]) {
          this.index[word] = {};
        }
        const textWidth = Math.ceil(ctx.measureText(word).width);
        ctx.fillText(word, 0, cursor);
        this.index[word][font] = {x: 0, y: cursor, width: textWidth, height: lineHeight};
        cursor += lineHeight;
      });
    });
  }

  /**
   * draw some text using the offscreen canvas technique.
   * @param Object params - an object with the following properties:
   * @param String font - which font specification to use
   * @param String word - which word or phrase to draw
   * @param Object ctx - canvas context2d to draw into
   * @param Number x - the horizontal coordinate
   * @param Number y - ths vertical coordinate
   */
  draw({font, word, ctx, x, y}) {
    const srcBounds = this.index[word][font];
    const srcCanvas = this.atlases[font].canvas;
    ctx.drawImage(
      srcCanvas,
      srcBounds.x,
      srcBounds.y,
      srcBounds.width,
      srcBounds.height,
      x,
      y,
      srcBounds.width,
      srcBounds.height
    );
  }
}
