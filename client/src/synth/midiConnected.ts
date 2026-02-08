import {SignalWatcher, watch, signal} from "@lit-labs/signals"

export class MidiConnected {
    /**
     *
     */
    constructor(midiAccess: MIDIAccess) {
        this._midiAccess = midiAccess
        this.setup()
    }
    _midiAccess: MIDIAccess

    devicesSignal = signal<Array<MidiInputDTO>>([])

    get devices() {
        const devices = Array.from(this._midiAccess.inputs.values())
        return devices
    }

    setup() {
        const listMidiInputs: Array<MidiInputDTO> = []
        for (const d of this.devices) {
            listMidiInputs.push(convertToDto(d))
        }
        this.devicesSignal.set(listMidiInputs)
    }
}

export interface MidiInputDTO {
    id: string
    manufacturer: string
    name: string
    type: MIDIPortType
    state: MIDIPortDeviceState
    version: string | null
}

function convertToDto(m: MIDIInput) {
    const { id, manufacturer, name, type, state, version } = m
    return { id, manufacturer, name, type, state, version } as MidiInputDTO
}