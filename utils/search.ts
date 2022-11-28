import Fuse from 'fuse.js'
import levDistance from 'js-levenshtein'
import _ from 'lodash'

const options = {
    includeScore: false,
    threshold: 0.3,
    useExtendedSearch: true,
    // findAllMatches: true,
    // Search in `author` and in `tags` array
    keys: ['summoner.name', 'monsters.name'],
}

export const search = (teamComps: any, search: string[]) => {
    if (search.length) {
        const fuse = new Fuse(teamComps, options)
        return fuse.search({
            $and: search.map(se => ({
                $or: [
                    {
                        $path: 'summoner.name',
                        $val: _.lowerCase(_.escape(se)),
                    },
                    {
                        $path: 'monsters.name',
                        $val: _.lowerCase(_.escape(se)),
                    }
                ]
            }))
        }).map((team) => team.item)
    }
    return teamComps
}

const cardOptions = {
    includeScore: false,
    threshold: 0.3,
    useExtendedSearch: true,
    // findAllMatches: true,
    // Search in `author` and in `tags` array
    keys: ['name'],
}

export const searchCard = (cards: any, search: string[]) => {
    if (search.length) {
        const fuse = new Fuse(cards, cardOptions)
        return fuse.search({
            $or: search.map(se => ({
                $path: 'name',
                $val: _.lowerCase(_.escape(se)),
            }))
        }).map((card) => card.item)
    }
    return cards
}