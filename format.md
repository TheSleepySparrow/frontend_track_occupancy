# Запросы на бек и что я хочу получить на фронте

## Запрос на получение информации о загруженности

### Запрос на получение списка городов.
Получаю:

**URL**: */cities*

**TYPE**: GET

**ResponceBody**:

```json
[
    {
        "id": "Number",
        "name": {
            "ru": "String",
            "en": "String"
        }
    }
]
```

### Запрос на получение списка корпусов для города.
Получаю:

**URL**: */cities/{city_id}/buildings*

**TYPE**: GET

**ResponceBody**:

```json
[
    {
        "id": "Number",
        "city_id": "Number",
        "address": {
            "ru": "String",
            "en": "String"
        },
        "floors_count": "Number"
    }
]
```

### Запрос на получение списка аудиторий.
Получаю:

**URL**: */buildings/{building_id}/auditory*

**TYPE**: GET

**ResponceBody**:

```json
[
    {
        "id": "Number",
        "building_id": "Number",
        "type": {
            "ru": "String",
            "en": "String"
        },
        "auditory_number": "String",
        "floor_number": "Number",
        "capacity": "Number",
        "image_url": "String"
    }
]
```

### Запрос на получение загруженности аудитории (последние по актуальности данные).
Получаю:

**URL**: */cities/{city_id}/buildings/{building_id}/occupancy/{auditory_id}*

**TYPE**: GET

**ResponceBody**:

```json
{
    "id": "Number",
    "person_count": "Number",
    "actual_timestamp": "TimeStampWithUTC",
    "is_fresh": "Boolean"
}
```

## Запросы на работу с аудиториями и камерами

### Вся информация об одной аудитории по ее id.
Получаю:

**URL**: */cities/{city_id}/buildings/{building_id}/auditory/{auditory_id}*

**TYPE**: GET

**ResponceBody**:

```json
{
    "id": "Number",
    "building_id": "Number",
    "type": {
        "ru": "String",
        "en": "String"
    },
    "auditory_number": "String",
    "floor_number": "Number",
    "capacity": "Number",
    "image_url": "String",
    "cameras": [
        {
            "id": "Number",
            "mac": "String"
        }
    ]
}

```

### Изменение информации об аудитории
Отправляю:

**URL**: */cities/{city_id}/buildings/{building_id}/auditory/{auditory_id}*

**TYPE**: PUT

**ResponceBody**:

```json
{
    "building_id": "Number",
    "type": {
        "ru": "String",
        "en": "String"
    },
    "auditory_number": "String",
    "floor_number": "Number",
    "capacity": "Number",
    "image_url": "String"
}
```
