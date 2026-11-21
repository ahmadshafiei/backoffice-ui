# پیاده سازی تنظیم سال مالی 

اسم این منو به تنظیم دوره مالی تغییر پیدا کنه

### لیست api ها
```
POST: /api/v1/fiscal-periods
request:
    {
    "name": "string",
    "startDate": "2026-11-21",
    "endDate": "2026-11-21",
    "isClosed": true
    }

GET: /api/v1/fiscal-periods
queryParams: pageNumber, pageSize

response:
    {
    "totalCount": 0,
    "items": [
        {
        "id": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
        "name": "string",
        "startDate": "2026-11-21",
        "endDate": "2026-11-21",
        "isClosed": true
        }
    ]
    }

DELETE: /api/v1/fiscal-periods/{fiscalPeriodId}

GET: /api/v1/fiscal-periods/{fiscalPeriodId}
```

### نمایش جدول اصلی

اگه مقدار  isClose = false هستش یه آیکون داشته باشه که بشه فعالش close کرد اونو و برعکسشم هم باشه یعنی اگه isclose = true بود یه آیکون باشه که بشه فعالش کرد

در کل هم فقط یه دوره مالی میتونه فعال باشه 

این جدول فقط حذف رکورد داره و ویرایش نداره کلا