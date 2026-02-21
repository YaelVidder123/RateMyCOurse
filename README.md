# 📝 RateMyCourse

## Overview

**RateMyCourse** is a web application that allows university students to rate and review courses and lecturers. Users can search for courses, read reviews, and add their own ratings, helping students make informed decisions about which courses to take.

---

## Problem

Choosing courses can be stressful and unclear. Students often lack reliable information about course difficulty, teaching quality, and workload. **RateMyCourse** provides transparency and helps students plan their studies better.

---

## Tech Stack

* **Frontend:** React + Vite + TailwindCSS
* **Backend:** Lovable Cloud Edge Functions
* **Database:** PostgreSQL (Lovable Cloud)
* **Deployment:** Lovable Cloud

---

## Features

* Course search by name or lecturer
* Course detail page with all reviews
* Add review form (rating 1–5 stars + comment)
* Automatic calculation of average rating
* Input validation (rating required, comment length limit)
* Responsive and modern UI with Dark Mode support
* Optional: Top-rated courses highlighted on homepage

---

## Architecture

```
Client (React)
↓
Edge Functions (Server-side logic)
↓
PostgreSQL Database
```

* Frontend handles all UI interactions
* Edge functions handle server-side validation, review creation, and average rating calculation
* Database stores courses and reviews

---

## Screenshots / Demo

[Live Demo](https://gradehaven-hub.lovable.app)

---

## Getting Started (Local Setup)

1. Clone the repository:

```bash
git clone https://github.com/YaelVidder123/gradehaven-hub.git
```

2. Install dependencies:

```bash
npm install
```

3. Start the development server:

```bash
npm run dev
```

4. Open `http://localhost:5173` in your browser (or the URL provided by Lovable Cloud for deployed apps)

---

## Notes / Future Improvements

* Add authentication to allow users to manage their own reviews
* Add filtering by difficulty or semester
* Show statistics or charts for average ratings over time
* Improve mobile UX with responsive animations

---

## License

MIT License
