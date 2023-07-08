import * as ease from 'd3-ease';

export interface Animation {
  start?: DOMHighResTimeStamp;
  duration?: number;
  easing?: keyof ease;
  tick?: Function
}

export interface GlobalAnimation extends Animation {
  id?: string;
}
