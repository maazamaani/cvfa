# cvfa

قالب رزومه فارسی (RTL) با Next.js — برای ساخت رزومه شخصی خودتان کافی است یک فایل JSON را ویرایش کنید.

**نمونه زنده:** [mazamani.ir](https://mazamani.ir)  
**مخزن:** [github.com/maazamaani/cvfa](https://github.com/maazamaani/cvfa)

![پیش‌نمایش رزومه](public/screenshot.png)

## ویژگی‌ها

- رابط فارسی و راست‌به‌چپ
- تم روشن / تاریک
- واکنش‌گرا (موبایل و دسکتاپ)
- تمام محتوا از یک فایل JSON
- دانلود PDF با حفظ تم و جلوگیری از شکستن کارت‌ها در صفحات
- لینک «ویرایش این صفحه» برای ویرایش مستقیم `data/cv.json` در GitHub
- استقرار با npm یا Docker

## شروع سریع

### پیش‌نیاز

- Node.js 20+
- npm

یا

- Docker و Docker Compose

---

## روش ۱ — npm (توسعه و استقرار مستقیم)

### نصب و اجرا

```bash
git clone https://github.com/maazamaani/cvfa.git
cd cvfa
npm install
npm run dev
```

مرورگر: [http://localhost:3000](http://localhost:3000)

### استقرار production

```bash
npm run build
npm start
```

---

## روش ۲ — Docker Compose

با هر push به `main`، GitHub Actions تصویر Docker را می‌سازد و در Docker Hub منتشر می‌کند:

`maazamaani/cvfa:latest`

فایل `docker-compose.yml`:

```yaml
services:
  cvfa:
    image: ${CVFA_IMAGE:-maazamaani/cvfa:latest}
    pull_policy: always
    ports:
      - "3000:3000"
    volumes:
      - ./data/cv.json:/app/data/cv.json
    restart: unless-stopped
```

### اجرا

```bash
docker compose pull
docker compose up -d
```

مرورگر: [http://localhost:3000](http://localhost:3000)

### نکات Docker

- **`data/cv.json` پایدار است** — با volume به `./data/cv.json`، فایل روی میزبان نگه داشته می‌شود و با حذف کانتینر از بین نمی‌رود. پس از ویرایش محتوا: `docker compose pull && docker compose up -d`
- برای استفاده از تگ مشخص: `CVFA_IMAGE=maazamaani/cvfa:COMMIT_SHA docker compose up -d`
- رنگ اصلی در زمان build در GitHub Actions با `NEXT_PUBLIC_PRIMARY_COLOR` (repository variable) تنظیم می‌شود.
- برای CI، در GitHub → Settings → Secrets این موارد را اضافه کنید: `DOCKERHUB_USERNAME` و `DOCKERHUB_TOKEN`

### اجرای دستی بدون Compose

```bash
docker pull maazamaani/cvfa:latest
docker run -p 3000:3000 -v "$(pwd)/data/cv.json:/app/data/cv.json" maazamaani/cvfa:latest
```

---

## ویرایش محتوا

فایل [`data/cv.json`](data/cv.json) را ویرایش کنید. ساختار اصلی:

| کلید | توضیح |
|------|--------|
| `site` | عنوان صفحه، توضیحات SEO، رنگ اصلی (`primaryColor`) |
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

لینک «ویرایش این صفحه» به‌صورت ثابت به مخزن GitHub اشاره می‌کند:

`https://github.com/maazamaani/cvfa/edit/main/data/cv.json`

### رنگ اصلی

پیش‌فرض: `#007c6f`

دو روش تنظیم (اولویت با متغیر محیطی است):

1. در `data/cv.json`:
   ```json
   "primaryColor": "#007c6f"
   ```
2. در `.env.local` (یا build arg در Docker):
   ```bash
   NEXT_PUBLIC_PRIMARY_COLOR=#007c6f
   ```

## فناوری‌ها

- Next.js 16
- React 19
- Tailwind CSS v4
- TypeScript
- Lucide Icons

## مجوز

MIT — آزاد برای استفاده، تغییر و انتشار.
