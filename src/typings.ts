declare global {
  //pixi overrides
  namespace GlobalMixins {
    interface DisplayObjectEvents {
      spin_play: [];
      spin_stop: [];
    }
  }
}
