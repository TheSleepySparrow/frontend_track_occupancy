# Запросы на бек и что я хочу получить на фронте

## Запрос на получение информации о загруженности

Запрос на получение списка городов. Хочу получить:

```
/cities

TYPE: GET

[
    {
        id: Number,
        name_en: String,
        name_ru: String
    }
]
```

Запрос на получение списка корпусов для города. Отправляю по эндпойнту с id города. Хочу получить:

```
/cities/{city_id}/buildings

TYPE: GET

[
    {
        id: Number,
        address_en: String,
        address_ru: String,
        number_of_floors: Number
    }
]
```

Запрос на получение списка аудиторий. Отправляю по эндпойнту с id корпуса. Хочу получить:

```
/buildings/{building_id}/auditory

TYPE: GET

[
    {
        id: Number,
        ru: {
            name: String,
            type: String,
            auditory_number(description): String
        },
        en: {
            name: String,
            type: String,
            auditory_number(description): String
        },
        floor: Number,
        capacity: Number,
        url: String
    }
]
```

Запрос на получение списка загруженности аудиторий (последние по актуальности данные) по списку аудиторий.
Отправляю список id аудиторий. Хочу получить:


```
/auditory/occupancy

TYPE: POST

[
    {
        auditory_id: Number,
        number_of_people: Number,
        timestamp: TimeStampWithUTC
    }
]
```

