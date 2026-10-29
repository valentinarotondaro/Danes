// Wraps the Jitsi Meet External API (meet.jit.si, free public server).
// The rest of the app never touches Jitsi, so swapping providers only changes this file.

const JITSI_SCRIPT_SRC = 'https://meet.jit.si/external_api.js'
let scriptLoadingPromise = null

function loadJitsiScript() {
  if (window.JitsiMeetExternalAPI) return Promise.resolve()
  if (scriptLoadingPromise) return scriptLoadingPromise

  scriptLoadingPromise = new Promise((resolve, reject) => {
    const script = document.createElement('script')
    script.src = JITSI_SCRIPT_SRC
    script.async = true
    script.onload = resolve
    script.onerror = () => reject(new Error('Could not load the video service.'))
    document.head.appendChild(script)
  })
  return scriptLoadingPromise
}

// A stable, unlikely-to-collide room name derived from the liveClass ID —
// so the same class always resolves to the same Jitsi room.
export function roomNameForLiveClass(liveClassId) {
  return `danes-app-${liveClassId}`
}

export function useVideoRoom() {
  async function embed(containerEl, roomName, displayName) {
    await loadJitsiScript()
    return new window.JitsiMeetExternalAPI('meet.jit.si', {
      roomName,
      parentNode: containerEl,
      userInfo: { displayName },
      configOverwrite: { prejoinPageEnabled: false },
    })
  }

  return { embed }
}
