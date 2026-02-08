export async function checkPermission() {
    const result = await navigator.permissions.query({ name: "midi" }) // optional: sysex: true
    if (result.state === "granted")
        return true
    //else if (result.state === "prompt") {
        // Using API will prompt for permission
    //}
    // Permission was denied by user prompt or permission policy
    return false
}
export async function askPermission() {
    if (!window.AudioContext)
        return false

    const access = await navigator.requestMIDIAccess()

    return access
}
