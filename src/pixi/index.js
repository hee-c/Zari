import * as PIXI from 'pixi.js';

let loader = PIXI.Loader.shared;

export function imageLoader(callback) {
  loader
    .add('background', '../images/background.png')
    .add('player', '../images/graduation.png')
    .add('bald', '../images/bald.png')
    .add('braided', '../images/braided.png')
    .add('business', '../images/business.png')
    .add('casual', '../images/casual.png')
    .add('dress', '../images/dress.png')
    .add('graduation', '../images/graduation.png')
    .add('grandfather', '../images/grandfather.png')
    .add('grandmother', '../images/grandmother.png')
    .add('staff', '../images/staff.png')
    .add('yangachi', '../images/yangachi.png')
    .load(callback);
}
