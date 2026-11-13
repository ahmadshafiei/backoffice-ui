# وصل کردن صفحه ارتباط معین با طبقه تفصیلی

## لیست api های سمت سرور
```
PUT:/api/v1/account-classes
request:
    {
    "accountId": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
    "detailClassesId": [
        "3fa85f64-5717-4562-b3fc-2c963f66afa6"
    ]
    }

response: 
    201

GET:/api/v1/account-classes
params: 
    pageNumber, pageSize

response:
    {
    "accountName": "string",
    "accountId": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
    "detailClassesId": [
        "3fa85f64-5717-4562-b3fc-2c963f66afa6"
    ]
    }
```

# پیاده سازی component جدید ارتباط معین با طبقه تفصیلی

 برای اسم فایل ها از account-class استفاده بشه


### برای ui این بخش چیزی که میخوام پیاده شه 
یه جدول داریم که سر ستون هاش هاش میشه اسم طبقه ها یا همون detail-class که اگه با pageSize = -1 صدا کنی api رو ، همه رو برمیگردونه. 

برای گرفتن ردیف ها از api-get که بالا اشاره شده بهش استفاده کن و تو هر ردیف قبل از اولین ستون AccountName رو بزار و تو هر خونه از جدول یه check-box بزار برای اختصاص دادن accountId مربوط به اون ردیف با detailClassId مربوط به اون ستون

یه دکمه ذخیره هم بزار وقتی تغییرات رو با عوض کردن checkbox ها اعمال کرد با زدن اون دکمه api put که بالا اورده شده صدا زده بشه