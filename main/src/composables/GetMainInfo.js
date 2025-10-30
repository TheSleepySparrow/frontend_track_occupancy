export function getBuildingsInfo() {
    const buildings = [
        {
            id: 1,
            ru_RU: {
                locale: 'ru-RU',
                title: 'Мясницкая улица'
            },
            en_US: {
                locale: 'en-US',
                title: 'Myasniczka street'
            }
        }, {
            id: 2,
            ru_RU: {
                locale: 'ru-RU',
                title: 'Покровский бульвар'
            },
            en_US: {
                locale: 'en-US',
                title: 'Pokrovsky bulvar'
            }
        }, {
            id: 3,
            ru_RU: {
                locale: 'ru-RU',
                title: 'Таллинская улица'
            },
            en_US: {
                locale: 'en-US',
                title: 'Tallinn street'
            }
        }
    ]
    return buildings
}

export function getRoomsInfo() {
    const rooms = [
        {
            id: 1,
            'ru-RU': {
                locale: 'ru-RU',
                title: 'Комната 1',
                overline: 'Лекционная',
                description: '1 этаж / кабинет 10'
            },
            'en-US': {
                locale: 'en-US',
                title: 'Room 1',
                overline: 'Lecture room',
                description: '1 floor / cabinet 10'
            }
        }, {
            id: 2,
            'ru-RU': {
                locale: 'ru-RU',
                title: 'Комната 2',
                overline: 'Лекционная',
                description: '2 этаж / кабинет 20'
            },
            'en-US': {
                locale: 'en-US',
                title: 'Room 2',
                overline: 'Lecture room',
                description: '2 floor / cabinet 20'
            }
        }, {
            id: 3,
            'ru-RU': {
                locale: 'ru-RU',
                title: 'Комната 3',
                overline: 'Коворкинг',
                description: '1 этаж / кабинет 11'
            },
            'en-US': {
                locale: 'en-US',
                title: 'Room 3',
                overline: 'Coworking',
                description: '1 floor / cabinet 11'
            }
        }
    ]
    return rooms
}