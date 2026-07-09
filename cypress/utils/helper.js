export const formatCalendarDate = date => {
    const m = date.toLocaleDateString('en-US', { month: 'short' })
    const d = String(date.getDate()).padStart(2, '0')
    const y = date.getFullYear()
    return `${m} ${d} ${y}`
}