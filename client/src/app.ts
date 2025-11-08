import "@ws/client/design/waLoader.js"
import { html, LitElement } from "lit"
import { customElement } from "lit/decorators.js"
import { askPermission } from "./synth.js"

@customElement("app-shell")
export class AppShell extends LitElement {


    async initSynth() {
        const access = await askPermission()
        console.log(access)
    }

    render() {
        return html`
            <h1>Midi</h1>

            <wa-button @click=${this.initSynth}>Init synth</wa-button>
        `
    }
}