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

export function getNumberOfFloorsInfo(){
    const number = [
        { label: '1', value: '1' },
        { label: '2', value: '2' },
        { label: '3', value: '3' },
        { label: '4', value: '4' },
        { label: '5', value: '5' },
        { label: '6', value: '6' },
        { label: '7', value: '7' },
        { label: '8', value: '8' },
        { label: '9', value: '9' },
        { label: '10', value: '10' },
    ]
    return number
}

export function getOccupancyForAuditories(auditoryIdList) {
    const occupancy = [
        {
            id: auditoryIdList[0],
            numberOfPeople: 1
        },
        {
            id: auditoryIdList[1],
            numberOfPeople: 1
        },
        {
            id: auditoryIdList[2],
            numberOfPeople: 1
        }
    ]
    return occupancy
}