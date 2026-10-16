# Rainbow Hospital — static website

A responsive, dependency-free hospital website for Rainbow Hospital in Saidpur, Ghazipur, Uttar Pradesh. It is built with semantic HTML, CSS3, and vanilla JavaScript so it can be hosted on GitHub Pages, Netlify, Vercel, or any static web server.

## Project structure

```text
.
├── index.html
├── styles.css
├── script.js
├── README.md
└── assets/
    └── images/
        ├── doctor-manoj.png
        ├── doctor-manish.png
        ├── examination-room.jpg
        ├── hospital-entrance.jpg
        ├── hospital-exterior.jpg
        ├── patient-room.jpg
        ├── pediatric-care.jpg
        └── reception.jpg
```

The files used by the website live in `assets/images/` with descriptive names.

## Run locally

Because the page uses local images, serve the folder over HTTP rather than opening `index.html` directly:

```bash
python3 -m http.server 4173
```

Then open <http://localhost:4173>.

If Node.js is preferred, any static server works, for example:

```bash
npx serve .
```

There are no npm dependencies and no build step.

## Deploy

### GitHub Pages

1. Push the project to a repository.
2. Open **Settings → Pages**.
3. Select the deployment branch and the repository root (`/`).
4. Save. `index.html` is the entry point.

### Netlify or Vercel

Import the repository as a static project. Leave the build command blank and use `.` (the project root) as the publish/output directory.

## Included interactions

- Automatic hero carousel advancement every 3.6 seconds.
- Previous/next arrow buttons and keyboard arrow support.
- Slide indicator buttons with accessible labels.
- Touch/pointer swipe support on the carousel.
- Carousel pause on hover or focus, plus reduced-motion support.
- Responsive sticky navigation and working mobile hamburger menu.
- Click-to-call links for `8528695991` and `8090945179`.
- Emergency Call action wired to `tel:+918528695991`.
- Google Maps search/directions links generated from the supplied address; no precise location pin or fabricated listing is embedded.
- Scroll-aware navigation state, reveal motion, focus indicators, skip link, and a dynamically generated footer year.

## Content and trust notes

- Dr. Manoj Kumar Sonkar and Dr. Manish Sonkar's profiles use photographs supplied with the project. Dr. Neepu Chaurasiya's card uses a neutral profile illustration rather than unrelated stock photography.
- Doctor details are limited to the information supplied for this project.
- The Google Maps action intentionally uses the supplied address as a search/directions destination rather than claiming a verified listing.
- No ratings, reviews, coordinates, accreditations, bed counts, founding dates, facilities, or clinical outcomes have been added.
- The included hero and supporting images are relevant illustrative hospital-care photographs sourced through image search. They should be replaced with hospital-owned or properly licensed Rainbow Hospital photography before production publication, and the final team should retain the appropriate attribution/licence records for the chosen files.

## Image source references

The downloaded files are local so the preview and static deployment do not depend on external image servers. The source pages returned with the image search are listed here for review:

- `hospital-exterior.jpg`, `hospital-entrance.jpg`: image-search results for modern hospital entrance/exterior photography from Magnific's hospital entrance photo page: <https://magnific.com/free-photos-vectors/hospital-entrance-exterior>
- `reception.jpg`: Pexels hospital reception search: <https://www.pexels.com/search/hospital%20reception/>
- `examination-room.jpg`: Pexels medical center search: <https://www.pexels.com/search/medical%20center/>
- `patient-room.jpg`: Pexels hospital room search: <https://www.pexels.com/search/hospital%20room/>
- `pediatric-care.jpg`: Pexels child health care search: <https://www.pexels.com/search/child%20health%20care/>
- `doctor-manoj.png`: supplied by the project owner for Dr. Manoj Kumar Sonkar's profile.
- `doctor-manish.png`: supplied by the project owner for Dr. Manish Sonkar's profile.

Always confirm the final licence and usage terms for each selected file before a public launch. If Rainbow Hospital supplies its own building, reception, treatment-room, and pediatric-care photographs, replacing the files in `assets/images/` requires no code changes.
