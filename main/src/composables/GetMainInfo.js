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