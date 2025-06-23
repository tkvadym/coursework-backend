# API Документація - Система управління виставками

## Базова інформація

**Base URL:** `http://localhost:3000/api`  
**Формат відповіді:** JSON  
**Кодування:** UTF-8

## Ендпоінти API

### 🎨 Виставки (Exhibitions)

#### GET /exhibitions

Отримати список виставок з фільтрацією та пагінацією.

**Query параметри:**

```
page=1              # Номер сторінки (за замовчуванням: 1)
limit=10            # Кількість на сторінку (за замовчуванням: 10)
category=string     # Фільтр за категорією
search=string       # Пошук за назвою/описом
organizer=string    # Фільтр за організатором
status=string       # active | upcoming | past
sortBy=string       # Поле сортування (за замовчуванням: startDate)
sortOrder=string    # ASC | DESC (за замовчуванням: ASC)
```

**Приклад запиту:**

```http
GET /api/exhibitions?page=1&limit=5&category=Сучасне мистецтво&status=active
```

**Відповідь 200:**

```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "title": "Назва виставки",
      "description": "Опис виставки",
      "location": "Місце проведення",
      "startDate": "2024-01-01",
      "endDate": "2024-01-31",
      "image": "https://example.com/image.jpg",
      "category": "Сучасне мистецтво",
      "organizer": "Організатор"
    }
  ],
  "pagination": {
    "currentPage": 1,
    "totalPages": 5,
    "totalItems": 25,
    "itemsPerPage": 5,
    "hasNextPage": true,
    "hasPrevPage": false
  }
}
```

#### GET /exhibitions/:id

Отримати конкретну виставку за ID.

**Path параметри:**

- `id` (number) - ID виставки

**Query параметри:**

- `includeArtworks=true` - включити картини галереї

**Приклад запиту:**

```http
GET /api/exhibitions/1?includeArtworks=true
```

**Відповідь 200:**

```json
{
  "success": true,
  "data": {
    "id": 1,
    "title": "Назва виставки",
    "description": "Опис виставки",
    "location": "Місце проведення",
    "startDate": "2024-01-01",
    "endDate": "2024-01-31",
    "image": "https://example.com/image.jpg",
    "category": "Сучасне мистецтво",
    "organizer": "Організатор",
    "status": {
      "isActive": true,
      "isUpcoming": false,
      "isPast": false,
      "duration": 31
    },
    "artworks": [
      {
        "id": 1,
        "title": "Назва картини",
        "artist": "Художник",
        "description": "Опис картини",
        "imageUrl": "https://example.com/artwork.jpg"
      }
    ]
  }
}
```

**Відповідь 404:**

```json
{
  "success": false,
  "message": "Виставку не знайдено"
}
```

### 🖼️ Галерея (Gallery)

#### GET /gallery

Отримати список картин з фільтрацією та пагінацією.

**Query параметри:**

```
page=1              # Номер сторінки (за замовчуванням: 1)
limit=10            # Кількість на сторінку (за замовчуванням: 10)
search=string       # Пошук за назвою/автором
exhibitionId=number # Фільтр за виставкою
sortBy=string       # Поле сортування (за замовчуванням: createdAt)
sortOrder=string    # ASC | DESC (за замовчуванням: ASC)
```

**Приклад запиту:**

```http
GET /api/gallery?exhibitionId=1&search=Пікассо&page=1&limit=10
```

**Відповідь 200:**

```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "title": "Назва картини",
      "artist": "Художник",
      "description": "Опис картини",
      "imageUrl": "https://example.com/artwork.jpg",
      "exhibitionId": 1,
      "exhibition": {
        "id": 1,
        "title": "Назва виставки",
        "location": "Місце проведення"
      }
    }
  ],
  "pagination": {
    "currentPage": 1,
    "totalPages": 3,
    "totalItems": 15,
    "itemsPerPage": 10,
    "hasNextPage": true,
    "hasPrevPage": false
  }
}
```

## Структура даних

### Exhibition (Виставка)

```typescript
{
  id: number,                    // Унікальний ідентифікатор
  title: string,                 // Назва виставки (1-255 символів)
  description: string,           // Детальний опис
  location: string,              // Місце проведення (1-255 символів)
  startDate: string,             // Дата початку (YYYY-MM-DD)
  endDate: string,               // Дата закінчення (YYYY-MM-DD)
  image?: string,                // URL зображення (опціонально)
  category: string,              // Категорія виставки
  organizer: string,             // Організатор (1-255 символів)
  createdAt: string,             // Дата створення
  updatedAt: string              // Дата оновлення
}
```

**Доступні категорії:**

- Сучасне мистецтво
- Класичне мистецтво
- Фотографія
- Скульптура
- Живопис
- Графіка
- Інсталяція
- Мультимедіа
- Народне мистецтво
- Декоративне мистецтво

### Gallery (Картина)

```typescript
{
  id: number,                    // Унікальний ідентифікатор
  title: string,                 // Назва картини (1-255 символів)
  artist: string,                // Ім'я художника (1-255 символів)
  description?: string,          // Опис картини (опціонально)
  imageUrl: string,              // URL зображення картини
  exhibitionId: number,          // ID виставки (зовнішній ключ)
  createdAt: string,             // Дата створення
  updatedAt: string              // Дата оновлення
}
```

## Коди відповідей

| Код | Опис                      |
| --- | ------------------------- |
| 200 | Успішний запит            |
| 404 | Ресурс не знайдено        |
| 500 | Внутрішня помилка сервера |

## Формат помилок

```json
{
  "success": false,
  "message": "Опис помилки українською мовою"
}
```

## Приклади використання

### Отримати активні виставки сучасного мистецтва

```http
GET /api/exhibitions?status=active&category=Сучасне мистецтво&sortBy=startDate&sortOrder=DESC
```

### Пошук картин за автором

```http
GET /api/gallery?search=Пікассо&sortBy=title&sortOrder=ASC
```

### Отримати виставку з картинами

```http
GET /api/exhibitions/1?includeArtworks=true
```

### Отримати картини конкретної виставки

```http
GET /api/gallery?exhibitionId=1&sortBy=createdAt&sortOrder=ASC
```
