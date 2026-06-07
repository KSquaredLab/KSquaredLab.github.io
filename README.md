# K² Lab Website

This repository contains the first version of the K² Lab academic research lab website for GitHub Pages.

The site is intentionally simple: plain HTML, CSS, a small JavaScript file, and a `people.json` file for lab member profiles. There are no build tools, paid services, or external image dependencies.

## Files

- `index.html` edits the main website sections and text.
- `styles.css` edits the layout, colors, typography, and responsive design.
- `script.js` loads and renders the People section from `people.json`.
- `people.json` stores lab member names, roles, departments, interests, bios, email fields, and optional photo paths.
- `images/people/` is prepared for future profile photos.

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
- Research: edit the `#research` section.
- Publications: edit the `#publications` section.
- Join Us: edit the `#join` section.
- News: edit the `#news` section.
- Contact: edit the `#contact` section.

After editing, commit and push the changes to GitHub. GitHub Pages will update automatically after deployment finishes.

## 3. How to Edit a Member Profile

Edit `people.json`.

Each person has fields like:

```json
{
  "name": "Junjae Won",
  "koreanName": "원준재",
  "role": "Master’s Student",
  "title": "",
  "department": "Department of Applied Statistics, Gachon University",
  "email": "",
  "photo": "",
  "researchInterests": [
    "Survival analysis",
    "Biomedical AI"
  ],
  "bio": "Short profile text."
}
```

To update a member, edit the relevant fields:

- `name`
- `koreanName`
- `role`
- `title`
- `department`
- `email`
- `photo`
- `researchInterests`
- `bio`

Do not remove the quotation marks or commas unless you are comfortable editing JSON. If the file is invalid JSON, the People section may not load.

## 4. How to Add a Student Photo

1. Add the image file to `images/people/`.
2. Use a simple lowercase filename without spaces when possible.
3. Recommended future filenames:
   - `kangjin-kim.jpg`
   - `junjae-won.jpg`
   - `jihyun-lee.jpg`
   - `eunjae-han.jpg`
   - `seoyoung-bae.jpg`

## 5. How to Connect a Photo in `people.json`

Set the `photo` field to the image path.

Example:

```json
"photo": "images/people/junjae-won.jpg"
```

If `photo` is empty or the image path is incorrect, the website will show a simple placeholder avatar instead of a broken image.

## 6. Information That Should Not Be Uploaded

Do not upload private personal information, including:

- Student ID numbers
- Birth dates
- Phone numbers
- Private addresses
- Personal identification numbers
- Private family information
- Sensitive health information
- Any private information that a student has not explicitly agreed to publish

For students, do not add email addresses unless the student has agreed to make the email public. It is fine to leave the `email` field blank.

## Local Preview

Because the People section loads `people.json`, preview the site with a local web server instead of opening `index.html` directly.

From the repository folder, run:

```bash
python3 -m http.server 8000
```

Then open:

```text
http://localhost:8000
```
