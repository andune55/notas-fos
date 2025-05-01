export function formatDate(dateStr : Date) : string {
    const dateObj = new Date(dateStr) //convertimos a objeto de tipo fecha
    const options : Intl.DateTimeFormatOptions = {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    }
    return new Intl.DateTimeFormat('es-ES', options).format(dateObj)
}

export function formatCurrency(amount: number){
    return new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR' }).format(amount)
}