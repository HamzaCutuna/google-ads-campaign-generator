# AdsKit – Free Google Ads Campaign Generator

**AdsKit** is a free utility tool that generates structured Google Ads Search campaign starter kits for online businesses.

It analyzes a website description and produces ready-to-use campaign files in CSV format.

This project is built for learning, testing, and fast campaign prototyping.

---

## 🚀 What AdsKit Does

AdsKit helps you quickly generate:

- **Campaign & keyword structure (CSV)**
- **Responsive Search Ads (RSA) copy (CSV)**
- **Negative keyword baseline (CSV)**
- **Tracking setup guide**
- **7-day optimization checklist**

It reduces repetitive setup work so you can focus on strategy.

> ⚠️ Always review and validate outputs before launching real campaigns.

---

## 📦 Output Structure

Each generation returns a ZIP file containing:

- campaigns_keywords.csv  
- rsa_ads.csv  
- negatives.csv  
- tracking.md  
- optimization-7days.md  

---

## 📊 campaigns_keywords.csv

Columns:

- **Campaign**
- **Ad Group**
- **Keyword**
- **Match Type** (Phrase / Exact)

Structure includes:

- Separate Brand campaign
- Separate Non-Brand campaign
- Category-based ad groups
- Buyer-intent focused keywords

---

## ✍️ rsa_ads.csv

Columns:

- **Campaign**
- **Ad Group**
- **Final URL**
- **Headline 1–15**
- **Description 1–4**

Each ad group contains:

- 15 headlines (≤ 30 characters)
- 4 descriptions (≤ 90 characters)
- Category-specific messaging

---

## 🚫 negatives.csv

Columns:

- **Negative Keyword**
- **Match Type**
- **Level**

Includes baseline blocks for:

- Free / cheap intent
- DIY / tutorial intent
- Jobs / careers
- Marketplace queries
- Review / research queries
- Duplicate filtering

---

## 🧠 How It Works

1. User enters:
   - Website URL
   - Business description
   - Target country

2. The AI engine generates:
   - Campaign structure
   - Keyword clusters
   - RSA ad copy
   - Negative keyword list

3. Files are validated and exported as structured CSV.

4. A ZIP file is returned for download.

---

## 🛠 Tech Stack

- **Next.js (App Router)**
- **TypeScript**
- **Groq API (LLM generation)**
- **JSZip**
- **TailwindCSS**

---

## 🧩 Architecture Overview

- /app/api/generate-kit – Main generation endpoint  
- /lib/ai – AI provider layer  
- /lib/schema – Validation logic  
- /lib/zip – ZIP file builder  
- /components – UI components  

AI output is validated before export.  
If generation fails, a fallback dummy kit is returned to avoid runtime crashes.

---

## ⚙️ Installation

Clone the repository:

    git clone https://github.com/yourusername/adskit.git
    cd adskit

Install dependencies:

    npm install

Create a `.env.local` file:

    GROQ_API_KEY=your_api_key_here
    AI_PROVIDER=groq

Run locally:

    npm run dev

App runs on:

    http://localhost:3000

---

## 🧪 Usage

1. Open the app.
2. Enter your website URL.
3. Add a short business description.
4. Select target country.
5. Click **Generate Free Campaign Kit**.
6. Download the ZIP file.

Import CSV files into **Google Ads Editor** or use them as structured reference.

---

## 🔒 Disclaimer

AdsKit is provided **as-is**.

- It does not guarantee campaign performance.
- Outputs must be reviewed before launch.
- AI-generated content may require manual adjustment.

Use responsibly.

---

## 📄 License

This project is licensed under the **MIT License**.

You are free to use, modify, and distribute the software.

---

## 👨‍💻 Author

Built as an experimental free tool for structured Google Ads campaign generation.
