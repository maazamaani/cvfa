# cvfa

قالب رزومه فارسی (RTL) با Next.js — برای ساخت رزومه شخصی خودتان کافی است یک فایل JSON را ویرایش کنید.

نمونهٔ پیش‌فرض با اطلاعات رزومه محمد امین زمانی پر شده است.

## ویژگی‌ها

- رابط فارسی و راست‌به‌چپ
- تم روشن / تاریک
- واکنش‌گرا (موبایل و دسکتاپ)
- تمام محتوا از یک فایل JSON
- لینک «ویرایش این صفحه» برای ویرایش مستقیم در GitHub
- آمادهٔ Docker

## شروع سریع

### پیش‌نیاز

- Node.js 20+
- npm

### توسعه محلی

```bash
npm install
npm run dev
```

مرورگر: [http://localhost:3000](http://localhost:3000)

### ویرایش محتوا

فایل [`data/cv.json`](data/cv.json) را ویرایش کنید. ساختار اصلی:

| کلید | توضیح |
|------|--------|
| `site` | عنوان صفحه، توضیحات SEO، لینک ویرایش GitHub، رنگ اصلی (`primaryColor`) |
| `profile` | نام، عنوان، خلاصه، اطلاعات شخصی |
| `languages` | زبان‌ها و سطح |
| `contacts` | راه‌های تماس (مودال) |
| `experiences` | سوابق شغلی |
| `education` | تحصیلات |
| `volunteer` | فعالیت‌های داوطلبانه |
| `skills` | تخصص‌ها |
| `certifications` | گواهی‌ها |
| `toolGroups` | ابزارها |
| `navItems` | آیتم‌های ناوبری |

فیلدهای اختیاری را می‌توانید حذف کنید یا `null` بگذارید — برنامه با مقادیر پیش‌فرض امن کار می‌کند.

برای لینک «ویرایش این صفحه» در سایدبار، `site.githubEditUrl` را تنظیم کنید:

```json
"githubEditUrl": "https://github.com/YOUR_USER/cvfa/edit/main/data/cv.json"
```

برای غیرفعال کردن این لینک، مقدار را `""` بگذارید.

### رنگ اصلی

پیش‌فرض: `#007c6f`

دو روش تنظیم (اولویت با متغیر محیطی است):

1. در `data/cv.json`:
   ```json
   "primaryColor": "#007c6f"
   ```
2. در `.env.local` (یا Docker env):
   ```bash
   NEXT_PUBLIC_PRIMARY_COLOR=#007c6f
   ```

نمونه: `.env.example`

### Docker

```bash
docker compose up --build
```

یا:

```bash
docker build -t cvfa .
docker run -p 3000:3000 cvfa
```

## استقرار

```bash
npm run build
npm start
```

## فناوری‌ها

- Next.js 16
- React 19
- Tailwind CSS v4
- TypeScript
- Lucide Icons

## مجوز

MIT — آزاد برای استفاده، تغییر و انتشار.
