const famousArtists = [
	'Leonid Afremov',
	'Jean-Michel Basquiat',
	'John Berkey',
	'Sandro Botticelli',
	'William-Adolphe Bouguereau',
	'Salvador Dali',
	'Otto Dix',
	'Gil Elvgren',
	'Kilian Eng',
	'Caspar David Friedrich',
	'Frida Kahlo',
	'Edmund Blair Leighton',
	'Piet Mondrian',
	'Alphonse Mucha',
	'Bruce Pennington',
	'Pablo Picasso',
	'Jackson Pollock',
	'Okuda San Miguel',
	'Amanda Sage',
	'Drew Struzan',
	'Vincent van Gogh',
	'Johannes Vermeer',
	'John William Waterhouse',
]

const catTypes = [
	'Siamese',
	'Persian',
	'Maine Coon',
	'Ragdoll',
	'Bengal',
	'Abyssinian',
	'Birman',
	'Oriental Shorthair',
	'Sphynx',
	'Devon Rex',
	'Himalayan',
	'American Shorthair',
]

export const useGeneratePrompt = async () => {
	const randomArtistIdx = parseInt(Math.random() * famousArtists.length)
	const randomCatTypeIdx = parseInt(Math.random() * catTypes.length)

	const choosenArtist = famousArtists[randomArtistIdx]
	const choosenCat = catTypes[randomCatTypeIdx]

	const prompt = `a ${choosenCat} cat, painting by ${choosenArtist}`
	const description = `This NFT represents a painting about a ${choosenCat} type cat, painted by ${choosenArtist}.`

	return {
		description,
		prompt,
	}
}
