
export async function askPermission() {
    if (!window.AudioContext)
        return false

    const access = await navigator.requestMIDIAccess()

    return access
}

function linkUp(midiAccess: MIDIAccess) {

    midiAccess.inputs.forEach(input => {
        input.addEventListener("midimessage", handleInput)  
    })
}

function handleInput(ev: MIDIMessageEvent) {
    console.log(ev)

    if (!ev.data)
        return

    const command = ev.data[0]
    const note = ev.data[1]
    const velocity = ev.data[2]

    switch (command) {
        case 144:
            if (velocity > 0)
                noteOn(note, velocity)
            else
                noteOff(note)
        case 128:
            noteOff(note)
    }
}

function noteOn(note: number, velocity: number) {
    console.log(`note: ${note}, velocity: ${velocity}`)
}

function noteOff(note: number) {
    console.log(`note off: ${note}`)
}
