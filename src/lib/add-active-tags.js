module.exports = function addActiveTags (card, activeDeckTags) {
  Object.keys(activeDeckTags).forEach((tagName) => {
    if (activeDeckTags[tagName] && card.tags.indexOf(tagName) === -1) {
      card.tags.push(tagName)
    }
  })
}
