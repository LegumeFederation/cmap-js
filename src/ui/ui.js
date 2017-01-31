import Inferno from 'inferno/dist/inferno.js';
import Component from 'inferno-component';
import normalizeCss from './css/normalize.css-min';
import skeletonCss from './css/skeleton.css-min';
import cmapCss from './css/cmap.css-min';
import { Tools } from './tools';

export class UI extends Component {
  render() {
    return (
      <div class="container">
        <style scoped>
          { normalizeCss }
          { skeletonCss }
          { cmapCss }
        </style>
          <div class="row">
            <div class="twelve columns">
              <strong>CMAP-js</strong>
              <Tools/>
            </div>
          </div>
      </div>
    )
  }
}

Inferno.render(<UI/>, document.getElementById('cmap-ui'));
