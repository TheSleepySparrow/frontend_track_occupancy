export function getReportTypes() {
    return [
        {
            labelName: 'statisticsFilters.day',
            value: 'day'
        },
        {
            labelName: 'statisticsFilters.week',
            value: 'week'
        },
        {
            labelName: 'statisticsFilters.month',
            value: 'month'
        },
        {
            labelName: 'statisticsFilters.year',
            value: 'year'
        }
    ]
}

export function getStatistics() {
    return [
        {
            time: '13:00 - 14:00',
            average: 75,
            min: 20,
            min_time: '13:25',
            max: 100,
            max_time: '13:50',
        },
        {
            time: '14:00 - 15:00',
            average: 60,
            min: 7,
            min_time: '14:10',
            max: 85,
            max_time: '14:36',
        },
        {
            time: '15:00 - 16:00',
            average: 50,
            min: 10,
            min_time: '15:15',
            max: 70,
            max_time: '15:45',
        },
        {
            time: '16:00 - 17:00',
            average: 10,
            min: 0,
            min_time: '16:50',
            max: 30,
            max_time: '16:30',
        }
    ]
}
