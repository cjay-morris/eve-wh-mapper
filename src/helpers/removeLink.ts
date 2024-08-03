export const removeLink = (links: { from: number, to: number }[], link: { from: number, to: number }): { from: number, to: number }[] => {
    return links.filter(l => l.from !== link.from && l.to !== link.to && l.from !== link.to && l.to !== link.from)
}
