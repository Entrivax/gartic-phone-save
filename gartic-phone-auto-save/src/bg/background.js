// let gameCount = 1
// let gameRunning = false
// let zip = null
// let currentDirectory = null
// let packets = []
let packetsReader = new GarticPhonePacketsReader()

chrome.runtime.onMessage.addListener(
    async function (request, sender, sendResponse) {
        switch (request.type) {
            case 'packet':
                // packets.push(request.packet)
                packetsReader.read([request.packet])
                break
            case 'get-state':
                sendResponse({
                    gamesCount: packetsReader.getGames().length
                    // gamesCount: packets.reduce((a, packet) => a + (packet[1] === 23 ? 1 : 0), 0)
                })
                break
            case 'end-session':
                // let zip = new JSZip()
                // zip.file(`${game}.json`, JSON.stringify(packets))
                // let blob = await zip.generateAsync({ type: 'blob' })
                let blob = new Blob([JSON.stringify(packetsReader.getGames())], {
                    type: 'application/json'
                })
                let url = URL.createObjectURL(blob)
                chrome.downloads.download({
                    url: url,
                    filename: `GarticPhone_${new Date().toISOString().slice(0, 16).replace(/T/g, '_').replace(/:/g, '-')}.json`
                }, () => {
                    URL.revokeObjectURL(url)
                })
                packetsReader = new GarticPhonePacketsReader()
                sendResponse()
                break
            // case 'game-reset':
            //     if (gameRunning) {
            //         gameRunning = false
            //         gameCount++
            //         currentDirectory = null
            //     }
            //     sendResponse()
            //     break
            // case 'round-info':
            //     gameRunning = true
            //     if (zip == null) {
            //         zip = new JSZip()
            //     }
            //     if (currentDirectory == null) {
            //         currentDirectory = zip.folder(`Game ${gameCount}`)
            //     }
            //     currentDirectory.file(`${request.round.name}.json`, JSON.stringify(request.round))
            //     sendResponse()
            //     break
            // case 'end-session':
            //     if (zip == null) {
            //         sendResponse()
            //         break
            //     }
            //     let blob = await zip.generateAsync({ type: 'blob' })
            //     zip = null
            //     gameRunning = false
            //     currentDirectory = null
            //     gameCount = 1
            //     let url = URL.createObjectURL(blob)
            //     chrome.downloads.download({
            //         url: url,
            //         filename: `GarticPhone_${new Date().toISOString().slice(0, 16).replace(/T/g, '_').replace(/:/g, '-')}.zip`
            //     }, () => {
            //         URL.revokeObjectURL(url)
            //     })
            //     sendResponse()
            //     break
            // case 'get-state':
            //     sendResponse({
            //         gameCount,
            //         gameRunning,
            //         sessionRunning: zip != null
            //     })
            //     break
        }
    }
);