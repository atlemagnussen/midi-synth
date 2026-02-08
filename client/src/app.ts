import {doImportWa} from "@ws/client/design/waLoader.js"
import { html, LitElement, nothing } from "lit"
import { customElement, state } from "lit/decorators.js"
import { askPermission } from "./synth.js"

doImportWa()

@customElement("app-shell")
export class AppShell extends LitElement {

    @state()
    midiDevicesConnected = 0

    @state()
    midiConnected = false

    async initSynth() {
        const access = await askPermission()
        console.log(access)

        if (!access)
            return

        this.midiConnected = true
        access.addEventListener("statechange", this.midiStateChange)

        this.midiDevicesConnected = access.inputs.size

        access.inputs.forEach(i => {
            console.log(i)
        })
    }

    midiStateChange = (event: MIDIConnectionEvent) => {
        console.log(event.port)
    }

    render() {
        return html`
            <h1>Midi</h1>
            <wa-button @click=${this.initSynth}>Init synth</wa-button>

            ${this.midiConnected ? html`
                <p>Connected devices ${this.midiDevicesConnected}` : nothing
            }
        `
    }
}