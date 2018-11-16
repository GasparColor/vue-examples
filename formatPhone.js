import { parseNumber, AsYouType } from 'libphonenumber-js'

export default function formatPhone(value) {
    if (!value) return '+'

    // Если у переданного значения нет знака `+`, добавляем его сами,
    // т.к. он необходим для успешного парсинга
    const formattedValue = value[0] === '+'
        ? value
        : `+${value}`

    // Определяем страну и форматируем номер
    return new AsYouType(
        parseNumber(formattedValue).country,
    )
        .input(formattedValue)
}
