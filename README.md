# K² Lab Website

This repository contains the first version of the K² Lab academic research lab website for GitHub Pages.

The site is intentionally simple: plain HTML, CSS, a small JavaScript file, and JSON files for lab member profiles. There are no build tools, paid services, or external image dependencies.

## Files

- `index.html` edits the main website sections and text.
- `styles.css` edits the layout, colors, typography, and responsive design.
- `script.js` loads and renders the Research, People, Lab Life, and funded project sections from JSON files.
- `research.json` stores Research section themes, thumbnail paths, and related work links.
- `people.json` is the primary data file for the People section.
- `projects.json` stores grants and funded project information.
- `people/index.json` controls the order and group placement of lab member profiles.
- `people/[person-name]/profile.json` stores each member's name, role, department, interests, bio, email field, and optional photo path.
- `people/[person-name]/` can also store that member's profile photo.
- `people/kangjin-kim/kangjin-kim.jpg` is the current PI profile photo used by the People section.
- `gallery.json` stores Lab Life gallery entries.
- `images/gallery/` stores Lab Life photos.
- `images/hero/` stores the homepage visual panel images and composed hero background.
- `images/research/` stores web-ready figure excerpts used in the Research section.
- `papers/` is a local source folder for manuscript PDFs and is ignored by Git.

## 1. How to Enable GitHub Pages

1. Open the repository on GitHub: `https://github.com/testksquared/testksquared.github.io`.
2. Go to **Settings**.
3. Open **Pages** in the left sidebar.
4. Under **Build and deployment**, choose **Deploy from a branch**.
5. Select the `main` branch and the `/ (root)` folder.
6. Save the settings.
7. After GitHub finishes deploying, the site should be available at:
   `https://testksquared.github.io`

For a repository named `testksquared.github.io`, GitHub Pages usually serves the site from the root of the `main` branch.

## 2. How to Edit the Main Website Text

Edit `index.html`.

Common sections to update:

- Home: edit the `#home` section.
- Research: edit `research.json` and replace thumbnails in `images/research/` or `images/hero/`.
- Funded Projects: edit `projects.json`.
- Publications: edit the `#publications` section.
- Lab Life: edit `gallery.json` and add photos to `images/gallery/`.
- For Students: edit the `#students` section.
- Contact: edit the `#contact` section.

The publication list is currently written directly in the `#publications` section of `index.html`. To add a new publication, add a new `<li>` item inside the relevant `citation-list`.

After editing, commit and push the changes to GitHub. GitHub Pages will update automatically after deployment finishes.

## 3. How to Edit Research Themes

The Research section is rendered from `research.json`.

To update a research theme:

1. Edit the theme object in `research.json`.
2. Keep `title` short, and add `titleKo` when a Korean topic label should appear below the English title.
3. Use 2-3 concise `description` sentences.
4. Add a thumbnail image path in `image`, usually from `images/research/` or `images/hero/`.
5. Use descriptive `alt` text for the thumbnail.
6. Optional: add `imageFit` as `cover` or `contain`, and `imagePosition` such as `center` or `center top`, when a thumbnail needs careful cropping.
7. Add short `relatedWork` labels. Add a `url` only when there is a reliable DOI, PubMed, Google Scholar, publication, or project link.

To replace a research thumbnail:

1. Add a clean, web-ready image to `images/research/` or `images/hero/`.
2. Use a lowercase filename with hyphens, such as `survival-modeling-panel.jpg`.
3. Update the matching `image` path in `research.json`.
4. Set `imageFit` to `contain` for method plots or figures where cropping would remove important information; use `cover` for photographic or imaging panels that crop well.
5. Prefer high-resolution, uncluttered figure excerpts from lab papers or lab-owned assets.

To add a new research theme:

1. Add a new object to `research.json`.
2. Include `title`, optional `titleKo`, `description`, `image`, `alt`, and `relatedWork`.
3. Keep the Research section concise; full citations belong in the Publications section.

Example related work item:

```json
{ "label": "Smart safety equipment certification criteria project", "url": "#projects" }
```

If no reliable URL is available, leave the item as plain text:

```json
{ "label": "TMAT" }
```

## 4. How to Edit Funded Projects

The Grants and Funded Projects section is rendered from `projects.json`.

To add a new project:

1. Add a new object to `projects.json`.
2. Include `title`, `fundingAgency`, `period`, `role`, and `description`.
3. Add `grantProgram`, `totalFunding`, and `koreanTitle` when useful and appropriate for public display.
4. Commit and push changes.
5. Do not include private administrative details, internal screenshots, phone numbers, birth dates, student IDs, non-public budget details, or other sensitive information. Only include funding amounts when they are intended for public display.

Example entry:

```json
{
  "title": "Project Title",
  "koreanTitle": "국문 과제명",
  "fundingAgency": "Funding Agency",
  "grantProgram": "Grant Program Name",
  "period": "2026.03 – 2029.02",
  "role": "Principal Investigator",
  "totalFunding": "Public funding amount, if appropriate",
  "description": "Short factual description of the funded work."
}
```

To hide the section temporarily, set `projects.json` to an empty array:

```json
[]
```

## 5. How to Replace Homepage Visual Panels

Homepage visual images are stored in `images/hero/`.

To replace them:

1. Add or replace a homepage-ready image in `images/hero/`.
2. Use a descriptive lowercase filename with hyphens, such as `copd-imaging-panel.jpg`.
3. If replacing the composed hero background, update `images/hero/homepage-visual-panels.jpg`.
4. If changing the CSS path, update the `.hero` background image in `styles.css`.
5. Keep images clean, high-resolution, light enough for a homepage, and derived from lab publications or lab-owned assets.

The current homepage visual uses publication-derived panels for COPD imaging, omics analysis, microbiome composition, and statistical methods.

## 6. How to Edit a Member Profile

Edit that member's folder under `people/`.

Examples:

- PI: `people/kangjin-kim/profile.json`
- Junjae Won: `people/junjae-won/profile.json`
- Jihyeon Lee: `people/jihyun-lee/profile.json`
- Eunjae Han: `people/eunjae-han/profile.json`
- Seoyoung Bae: `people/seoyoung-bae/profile.json`

Each person has fields like:

```json
{
  "name": "Junjae Won",
  "koreanName": "원준재",
  "role": "Master’s Student",
  "title": "",
  "department": "Department of Applied Statistics, Gachon University",
  "training": "",
  "email": "",
  "photo": "",
  "researchInterests": [
    "Survival analysis",
    "Biomedical AI"
  ],
  "bio": "Short profile text.",
  "background": [
    {
      "label": "Education",
      "value": "Degree or training summary"
    }
  ]
}
```

To update a member, edit the relevant fields:

- `name`
- `koreanName`
- `role`
- `title`
- `department`
- `training`
- `email`
- `photo`
- `researchInterests`
- `bio`
- `background` for compact PI background items, such as current position, training, education, and research focus

Do not remove the quotation marks or commas unless you are comfortable editing JSON. If the file is invalid JSON, the People section may not load.

## 7. How to Add a New Student Folder

1. Create a new folder under `people/`.
2. Use a lowercase folder name without spaces, such as `people/new-student-name/`.
3. Add a `profile.json` file inside the folder.
4. Add that profile path to the correct group in `people/index.json`.

Example entry in `people/index.json`:

```json
"profiles": [
  "people/junjae-won/profile.json",
  "people/new-student-name/profile.json"
]
```

GitHub Pages cannot automatically list folders, so a new folder will not appear on the website until its `profile.json` path is added to `people/index.json`.

## 8. How to Add a Student Photo

1. Add the image file to that student's folder under `people/`.
2. Use a simple lowercase filename without spaces when possible.
3. Recommended examples:
   - `people/junjae-won/junjae-won.jpg`
   - `people/jihyun-lee/jihyun-lee.jpg`
   - `people/eunjae-han/eunjae-han.jpg`
   - `people/seoyoung-bae/seoyoung-bae.jpg`

## 9. How to Connect a Photo in `profile.json`

Set the `photo` field to the image path.

Example:

```json
"photo": "people/junjae-won/junjae-won.jpg"
```

If `photo` is empty or the image path is incorrect, the website will show a simple placeholder avatar instead of a broken image.

## 10. How to Add Lab Life Photos

The Lab Life section is rendered from `gallery.json`. To add a new photo:

1. Add a photo file to `images/gallery/`.
2. Use a simple lowercase filename with hyphens, such as `conference-presentation-2026.jpg`.
3. Add a new entry to `gallery.json` with `title`, `date`, `caption`, `image`, and `alt`.
4. Commit and push changes.
5. Avoid uploading private, embarrassing, or low-quality photos.
6. Confirm that people in the photo are comfortable with the photo being posted on the public lab website.

Example `gallery.json` entry:

```json
{
  "title": "Conference Presentation",
  "date": "2026",
  "caption": "Lab members presenting research at an academic conference.",
  "image": "images/gallery/conference-presentation-2026.jpg",
  "alt": "Lab member presenting research at a conference"
}
```

If the image path is missing or incorrect, the website shows a simple placeholder card instead of a broken image. To hide the Lab Life section temporarily, set `gallery.json` to an empty array:

```json
[]
```

## 11. Information That Should Not Be Uploaded

Do not upload private personal information, including:

- Student ID numbers
- Birth dates
- Phone numbers
- Private addresses
- Personal identification numbers
- Private family information
- Sensitive health information
- Full CV files that contain references, private contact details, or other information that has not been checked for public sharing
- Full manuscript PDFs in `papers/`, unless copyright and public sharing rights have been checked
- Private, embarrassing, low-quality, or unapproved gallery photos
- Any private information that a student has not explicitly agreed to publish

For students, do not add email addresses unless the student has agreed to make the email public. It is fine to leave the `email` field blank.

Before uploading photos of students or collaborators, confirm that the people shown are comfortable with the photo being posted publicly on the lab website. Do not upload student ID cards, private documents, phone numbers, birth dates, or sensitive personal information.

## Local Preview

Because the People, Lab Life, and funded project sections load JSON files, preview the site with a local web server instead of opening `index.html` directly.

From the repository folder, run:

```bash
python3 -m http.server 8000
```

Then open:

```text
http://localhost:8000
```
