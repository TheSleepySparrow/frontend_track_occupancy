export function getLocalizedTypeLabel(type, locale) {
    const roomTypes = getRoomTypesInfo()
    let option = roomTypes[locale]?.find(opt => opt.value === type)
    if (!option) {
        option = roomTypes[locale]?.find(opt => opt.label === type)
        return option?.label || type
    }
    return option?.label || type
}

export function getRoomTypesInfo() {
    const roomTypes = {
        'ru-RU': [
            {
                label: 'Лекционная',
                value: 'lecture_hall'
            }, {
                label: 'Семинарская',
                value: 'classroom'
            }, {
                label: 'Коворкинг',
                value: 'coworking'
            }
        ],
        'en-US': [
            {
                label: 'Lecture room',
                value: 'lecture_hall'
            }, {
                label: 'Classroom',
                value: 'classroom'
            }, {
                label: 'Coworking',
                value: 'coworking'
            }
        ]
    }
    return roomTypes
}
