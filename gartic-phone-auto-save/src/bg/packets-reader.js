class GarticPhonePacketsReader {
    _games
    _currentGameBooks
    _currentBook

    constructor () {
        this._games = []
        this._currentGameBooks = []
    }

    /**
     * @param {any[]} packets 
     */
    read (packets) {
        for (let i = 0; i < packets.length; i++) {
            this._read(packets[i])
        }
    }

    getGames () {
        const games = [].concat.apply([], [this._games])
        if (this._currentGameBooks.length > 0) {
            games.push(this._currentGameBooks)
        }
        return games
    }

    /**
     * @param {any[]} packet 
     */
    _read (packet) {
        switch(packet[1]) {
            case 24: { // switch to results screen packet
                this._resetGame()
                break
            }
            case 20: { // switch to settings screen packet
                this._resetGame()
                break
            }
            case 12: { // book switch packet
                this._currentBook = packet[2].bookNum
                const bookAuthor = packet[2].bookAuthor
                this._currentGameBooks[this._currentBook] = {
                    bookNum: packet[2].bookNum,
                    bookAuthor: {
                        avatar: bookAuthor.avatar,
                        id: bookAuthor.id,
                        nick: bookAuthor.nick,
                    },
                    timeline: packet[2].timeline
                        .map(this._getTimelineDataFormatted)
                        .filter(data => data !== undefined)
                }
                break
            }
            case 9: { // book entry packet
                const data = this._getTimelineDataFormatted(packet[2])
                if (!data || !data.data) {
                    break
                }
                this._currentGameBooks[this._currentBook].timeline[packet[2].id] = data
                break
            }
        }
    }

    _getTimelineDataFormatted (packetData) {
        return packetData?.id != null ? {
            id: packetData.id,
            data: packetData.data,
            type: packetData.type,
            user: {
                avatar: packetData.user.avatar,
                change: packetData.user.change,
                id: packetData.user.id,
                nick: packetData.user.nick,
                points: packetData.user.points,
            }
        } : undefined
    }

    _resetGame () {
        if (this._currentGameBooks.length > 0) {
            this._games.push(this._currentGameBooks)
        }
        this._currentGameBooks = []
    }
}