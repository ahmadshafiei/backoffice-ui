# این بخش برای  پیاده سازی حساب های تفصیلی نوشته شده

# لیست api ها
```
POST: /api/v1/detail-classes
request
    {
    "name": "string",
    "detailClassCode": "string",
    "normalBalance": 0
    }
response:
    201, 400

GET: /api/v1/detail-classes
response: 
    {
    "totalCount": 0,
    "items": [
        {
        "id": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
        "name": "string",
        "detailClassCode": "string",
        "normalBalance": 0
        }
    ]
    }
queryParam: pageNumber, pageSize

DELETE: /api/v1/detail-classes/{detailClassId}

GET: /api/v1/detail-classes/{detailClassId}
response:
        {
        "id": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
        "name": "string",
        "detailClassCode": "string",
        "normalBalance": 0
        }
```

تو قسمت ui یه جدول وجود داره که لیست کلی رو نمایش میده . عملیات ویرایش و حذف ( با گرفتن تایید مجدد هنگام حذف) برای این جدول وجود داره 

برای نمایش اعضای دراپ دان detailClass هنگام ایجاد یا ویرایش از api زیر با pageSize = -1 استفاده بشه

`/api/v1/detail-classes?pageNumber=1&pageSize=-1`