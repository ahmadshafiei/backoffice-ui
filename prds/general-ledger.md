میخوام یه منوی جدید اضافه بشه با عنوان گزارشات حسابداری که زیر حسابداری هستش
آیتم هاش هم فعلا یدونه داره با عنوان دفتر کل

توی دفتر کل اول یه صفحه برای انتخاب فیلتر ها میاد و هیچ جدول و دیتایی فعلا از api گرفته نمیشه فیلتر ها اینا هستن
    Guid AccountId,
    DateOnly StartDate,
    DateOnly EndDate,
    int? BranchId = null

که غیر از branchid بقیه همه required هستن، برای accountId هم فقط account هایی که level=general دارن لود میشن

بعد از انتخاب فیلتر ها و جستجو یه صفحه میاد که یه summary با یه سری detail داره
برای بخش summary از api زیر استفاده میشه
api/v1/ledgers/general/summary?AccountId=01a1d0f1-c44f-7358-bc21-2cabcfd8cce3&StartDate=2026-01-01&EndDate=2026-12-29&branchId=1
برای item ها هم از این api 
api/v1/ledgers/general/items?AccountId=01a1d0f1-c44f-7358-bc21-2cabcfd8cce3&StartDate=2026-01-01&EndDate=2026-12-29&branchId=1

ریسپانس summary اینه
{
  "openingDebit": 0.1,
  "openingCredit": 0.1,
  "periodDebit": 0.1,
  "periodCredit": 0.1,
  "closingDebit": 0.1,
  "closingCredit": 0.1
}
و item ها هم این ریسپانس رو دارن
{
  "totalCount": 2,
  "items": [
    {
      "date": "2026-12-08",
      "number": 4,
      "sequence": 1,
      "accountCode": "111002",
      "accountName": "صندوق ها",
      "description": "",
      "debit": 2000000,
      "credit": 0,
      "balance": 2000000,
      "journalId": "01a202ce-9227-7af3-ad5d-adc983dcbc34"
    },
    {
      "date": "2026-12-08",
      "number": 4,
      "sequence": 1,
      "accountCode": "111002",
      "accountName": "صندوق ها",
      "description": "",
      "debit": 2000000,
      "credit": 0,
      "balance": 4000000,
      "journalId": "01a202ce-9227-7af3-ad5d-adc983dcbc34"
    }
  ]
}
برای item ها بتونه رو شماره سند کلیک کنه و بره به صفحه ای که اطلاعات اون سند هستش که همون edit-journal میشه