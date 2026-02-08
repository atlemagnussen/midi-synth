interface OscilatorAndGain {
    osc: OscillatorNode,
    gain: GainNode
}

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

        //console.log(`command: ${command}, note: ${note}, velocity: ${velocity}`)
        switch (command) {
            case 155:
                this.noteOn(note, velocity)
                break;
            case 139:
                this.noteOff(note)
                break;
        }
    }

    
    oscilators = new Map<number, OscilatorAndGain>()

    noteOn(note: number, velocity: number) {
        //console.log(`note ON: ${note}, velocity: ${velocity}`)
        const osc = this.audioContext.createOscillator()

        const gain = this.audioContext.createGain()
        gain.gain.value = this.velocityToGain(velocity)

        osc.type = "sine"
        osc.frequency.value = this.midiToFrequency(note)
        osc.connect(gain)
        gain.connect(this.audioContext.destination)
        osc.start()
        this.oscilators.set(note, {osc, gain})
    }

    noteOff(note: number) {
        //console.log(`note off: ${note}`)
        const noteData = this.oscilators.get(note)
        
        if (!noteData)
            return

        //noteData.gain.gain.setTargetAtTime(0, this.audioContext.currentTime, 0.01)
        noteData.gain.gain.setValueAtTime(noteData.gain.gain.value, this.audioContext.currentTime)
        noteData.gain.gain.exponentialRampToValueAtTime(0.0001, this.audioContext.currentTime + 0.3)
        //noteData.osc.stop()
        
        this.oscilators.delete(note)
    }

    base = 440
    midiToFrequency(midiNode: number) {
        return (this.base / 32) * ( 2 ** ((midiNode - 9 ) /12 ))
    }
    velocityToGain(velocity: number) {
        return velocity / 127
    }
}
