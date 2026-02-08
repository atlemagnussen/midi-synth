import {doImportWa} from "@ws/client/design/waLoader.js"
import { css, html, LitElement } from "lit"
import { customElement, property } from "lit/decorators.js"
import { MidiInputDTO } from "./midiConnected.js"

doImportWa()

@customElement("list-devices")
export class ListDevices extends LitElement {

    static styles = css`
        :host {
            display: block;
            box-sizing: border-box;
        }
        div.list {
            display: flex;
            flex-direction: column;
            gap: 1rem;
        }
        div.device {
            display: block;
            width: fit-content;
            padding: 0.5rem;
            border: 2px solid white;
            border-radius: 4px;
        }
    `

    @property()
    devices: Array<MidiInputDTO> = []


    render() {
        return html`
            <h1>Devices</h1>
            <div class="list">
            ${this.devices.map(d => html`
                <div class="device">
                    <div>${d.id}</div>
                    <div>${d.manufacturer}</div>
                    <div>${d.name}</div>
                    <div>${d.state}</div>
                    <div>${d.type}</div>
                    <div>${d.version}</div>
                </div>
            </div>
            `
            )}
        `
    }
}