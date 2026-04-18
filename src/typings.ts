declare global {
    //pixi overrides
    namespace GlobalMixins {
        interface DisplayObjectEvents {
            start_spin: [];
            spin_ended: [];
            spin_play_sound: [];
            spin_stop_sound: [];
            resize: [{ width: number; height: number }];
        }
    }
}
