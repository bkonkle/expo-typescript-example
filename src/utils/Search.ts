import Fuse, {FuseOptions} from 'fuse.js'

/**
 * Use the fuse.js library to implement fuzzy search
 */
export function getSuggestionsFromKeys<Item> (
  items: Item[],
  keys: FuseOptions<Item>['keys'],
  value: string
) {
  const fuse = new Fuse(items, {
    shouldSort: true,
    threshold: 0.4,
    location: 0,
    distance: 100,
    maxPatternLength: 32,
    minMatchCharLength: 2,
    keys
  })
  const search = (query: string) => fuse.search(query.trim().toLowerCase())

  return search(value)
}
