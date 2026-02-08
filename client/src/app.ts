import {doImportWa} from "@ws/client/design/waLoader.js"
import { html, LitElement, nothing } from "lit"
import { customElement, state } from "lit/decorators.js"
import { askPermission } from "./synth/synth.js"
import { MidiConnected } from "./synth/midiConnected.js"
import "./synth/listDevices.js"

import {SignalWatcher, watch, signal} from "@lit-labs/signals"

doImportWa()

@customElement("app-shell")
export class AppShell extends SignalWatcher(LitElement) {

    @state()
    midiDevicesConnected = 0

    @state()
    connected?: MidiConnected

    connectedCallback() {
        super.connectedCallback()
        this.initSynth()
    }
    async initSynth() {
        const access = await askPermission()
        console.log(access)

        if (!access)
            return

        this.connected = new MidiConnected(access)
    }

    midiStateChange = (event: MIDIConnectionEvent) => {
        console.log(event.port)
    }

    render() {
        return html`
            <h1>Midi</h1>
            <wa-button @click=${this.initSynth}>Init synth</wa-button>

            ${this.connected ? html`
                <list-devices .devices=${this.connected.devicesSignal.get()}></list-devices>`
                :
                html`<p>Midi not connected`
            }
        `
    }
}