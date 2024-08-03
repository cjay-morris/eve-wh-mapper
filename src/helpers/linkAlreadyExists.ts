export const linkAlreadyExists = (
    links: { from: number, to: number }[],
    link: { from: number, to: number }
) => {
    return links.some(l => l.from == link.from && l.to == link.to || l.from == link.to && l.to == link.from)
}
