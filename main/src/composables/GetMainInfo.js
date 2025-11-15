export function getBuildingsInfo(cityId) {
    if (cityId !== 1) return []
    
    const buildings = [
        {
            id: 1,
            'ru-RU': {
                title: 'Мясницкая улица'
            },
            'en-US': {
                title: 'Myasniczka street'
            }
        }, {
            id: 2,
            'ru-RU': {
                title: 'Покровский бульвар'
            },
            'en-US': {
                title: 'Pokrovsky bulvar'
            }
        }, {
            id: 3,
            'ru-RU': {
                title: 'Таллинская улица'
            },
            'en-US': {
                title: 'Tallinn street'
            }
        }
    ]
    return buildings
}

export function getRoomsInfo(buildingId) {
    if (buildingId !== 1) return []
    const rooms = [
        {
            id: 1,
            'ru-RU': {
                title: 'Комната 1',
                type: 'Лекционная',
                description: 'кабинет 10'
            },
            'en-US': {
                title: 'Room 1',
                type: 'Lecture room',
                description: 'cabinet 10'
            },
            floor: 1,
            capacity: 20,
            image_url: ''
        }, {
            id: 2,
            'ru-RU': {
                title: 'Комната 2',
                type: 'Лекционная',
                description: 'кабинет 20'
            },
            'en-US': {
                title: 'Room 2',
                type: 'Lecture room',
                description: 'cabinet 20'
            },
            floor: 2,
            capacity: 10,
            image_url: ''
        }, {
            id: 3,
            'ru-RU': {
                title: 'Комната 3',
                type: 'Коворкинг',
                description: 'кабинет 11'
            },
            'en-US': {
                title: 'Room 3',
                type: 'Coworking',
                description: 'cabinet 11'
            },
            floor: 1,
            capacity: 25,
            image_url: ''
        }
    ]
    return rooms
}

export function getRoomTypesInfo() {
    const roomTypes = {
        'ru-RU': [
            {
                label: 'Лекционная',
                value: 'lecture room'
            }, {
                label: 'Коворкинг',
                value: 'coworking'
            }
        ],
        'en-US': [
            {
                label: 'Lecture room',
                value: 'lecture room'
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
            numberOfPeople: 10
        },
        {
            id: auditoryIdList[2],
            numberOfPeople: 5
        }
    ]
    return occupancy
}