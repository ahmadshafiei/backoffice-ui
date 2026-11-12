# برقراری ارتباط طبقه تفصیلی با سرور

## لیست api های سمت سرور
```
POST: /api/v1/detail-classes 
    request:
    {
    "name": "string",
    "detailClassCode": "string",
    "normalBalance": 0
    }
    response: 204

GET:/api/v1/detail-classes 
    queryParam: pageNumber,pageSize
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

DELETE: /api/v1/detail-classes/{detailClassId}
    response: 204

GET: /api/v1/detail-classes/{detailClassId}
    response: 
    {
    "id": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
    "name": "string",
    "detailClassCode": "string",
    "normalBalance": 0
    }
```

# پیاده سازی component جدید ارتباط معین با تفصیلی

این کامپوننت باید به ارتباط معین با طبقه تفصیلی تغییر نام پیدا کنه و برای اسم فایل ها از account-class استفاده بشه

## لیست api های سمت سرور مربوط به این بخش

```
POST: /api/v1/account-classes
    request:
    {
    "accountId": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
    "detailClassId": "3fa85f64-5717-4562-b3fc-2c963f66afa6"
    }
    response: 204
```

### برای ui این بخش چیزی که میخوام پیاده شه 
یه جدول داریم که سر ستون هاش هاش میشه اسم طبقه ها و اولین هر ردیف میشه اختصاص دادن معین ها با طبقه ی اون ستون و تو هر خونه ی این جدول یه check-box هست که اگه تیکش خورده بود یعنی ارتباط بین این 2 تا با هم برقرار هست که همون `api get (/api/v1/account-classes)` میشه که بالا آوردم

