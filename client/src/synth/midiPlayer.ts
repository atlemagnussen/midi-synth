export class MidiPlayer {
    
    /**
     *
     */
    constructor(midiAcces: MIDIAccess, midiInputId: string) {
        this._midiAccess = midiAcces

        
    }

    _midiAccess: MIDIAccess
    handleInput(ev: MIDIMessageEvent) {
        console.log(ev)

        if (!ev.data)
            return

        const command = ev.data[0]
        const note = ev.data[1]
        const velocity = ev.data[2]

        switch (command) {
            case 144:
                if (velocity > 0)
                    this.noteOn(note, velocity)
                else
                    this.noteOff(note)
            case 128:
                this.noteOff(note)
        }
    }

    noteOn(note: number, velocity: number) {
        console.log(`note: ${note}, velocity: ${velocity}`)
    }

    noteOff(note: number) {
        console.log(`note off: ${note}`)
    }
    // midiAccess.inputs.forEach(input => {
    //     input.addEventListener("midimessage", handleInput)  
    // })
}
