import { writeFileSync as writeFile } from 'fs'

import downloadDeck from './download-deck'
import { DECKS_PATH } from './constants'

const decks: Record<string, {
	downloaded: boolean
	imported: boolean
	topics: string[]
}> = require(DECKS_PATH)

export default async () => {
	let i = 0
	
	for (const [deckId, deckData] of Object.entries(decks)) {
		if (deckData.downloaded)
			continue
		
		try {
			await downloadDeck(deckId)
		} catch (error) {
			if (error.message === 'missing-k-query-parameter') {
				delete decks[deckId]
				writeFile(DECKS_PATH, JSON.stringify(decks))
				
				continue
			}
			
			throw error
		}
		
		deckData.downloaded = true
		
		writeFile(DECKS_PATH, JSON.stringify(decks))
		
		console.log(`Downloaded deck with ID ${deckId} (${++i})`)
	}
}

if (require.main === module)
	exports.default().catch(console.error)
