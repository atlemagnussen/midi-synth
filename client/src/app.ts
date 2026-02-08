import {doImportWa} from "@ws/client/design/waLoader.js"
import { html, LitElement, nothing } from "lit"
import { customElement, state } from "lit/decorators.js"
import { checkPermission, askPermission } from "./synth/synth.js"
import { MidiConnected } from "./synth/midiConnected.js"
import "./synth/listDevices.js"

import {SignalWatcher} from "@lit-labs/signals"

doImportWa()

@customElement("app-shell")
export class AppShell extends SignalWatcher(LitElement) {

    @state()
    permissionGranted = false

    @state()
    midiDevicesConnected = 0

    @state()
    connected?: MidiConnected

    connectedCallback() {
        super.connectedCallback()
        this.checkAlreadyAccess()
    }

    async checkAlreadyAccess() {
        this.permissionGranted =  await checkPermission()
        if (this.permissionGranted)
            this.initSynth()
    }

    async initSynth() {
        const access = await askPermission()

        if (!access)
            return

        this.permissionGranted = true
        this.connected = new MidiConnected(access)
    }
    selectDevice = (e: CustomEvent) => {
        const id = e.detail.id as string
        console.log(id)

        
    }
    render() {
        return html`
            <h1>Midi</h1>

            ${
                this.permissionGranted ? html`<h2>connected</h2>` : html`
                    <wa-button @click=${this.initSynth}>Init synth</wa-button>
                `
            }

            ${this.connected ? html`
                <list-devices 
                    .devices=${this.connected.devicesSignal.get()}
                    @select-device=${this.selectDevice}>
                </list-devices>`
                :
                html`<p>Midi not connected`
            }
        `
    }
}