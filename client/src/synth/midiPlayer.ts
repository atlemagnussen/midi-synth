export class MidiPlayer {
    
    /**
     * MidiPlayer for selected MIDI device and AudioContext
     */
    constructor(midiAccess: MIDIAccess, selectedId: string) {
        this.audioContext = new AudioContext()

        const devices = Array.from(midiAccess.inputs.values())
        const selected = devices.find(d => d.id == selectedId)
        if (!selected)
            throw new Error(`no device found by id ${selectedId}`)
        this._midiInput = selected

        this._midiInput.addEventListener("midimessage", this.handleInput)
    }

    audioContext: AudioContext

    _midiInput: MIDIInput

    handleInput = (ev: MIDIMessageEvent) => {
        if (!ev.data)
            return

        const command = ev.data[0]
        const note = ev.data[1]
        const velocity = ev.data[2]

        //console.log("command", command)
        switch (command) {
            case 155:
                if (velocity > 0)
                    this.noteOn(note, velocity)
                else
                    this.noteOff(note)
            case 139:
                this.noteOff(note)
        }
    }

    oscilators: Record<string, OscillatorNode> = {}

    noteOn(note: number, velocity: number) {
        //console.log(`note: ${note}, velocity: ${velocity}`)
        const osc = this.audioContext.createOscillator()

        this.oscilators[`${note}`] = osc

        const gain = this.audioContext.createGain()
        gain.gain.value = 0.33

        osc.type = "sine"
        osc.frequency.value = this.midiToFrequency(note)
        osc.connect(gain)
        gain.connect(this.audioContext.destination)
        osc.start()
    }

    noteOff(note: number) {
        console.log(`note off: ${note}`)
    }
    base = 440
    midiToFrequency(midiNode: number) {
        return (this.base / 32) * ( 2 ** ((midiNode - 9 ) /12 ))
    }
    // midiAccess.inputs.forEach(input => {
    //     input.addEventListener("midimessage", handleInput)  
    // })
}
