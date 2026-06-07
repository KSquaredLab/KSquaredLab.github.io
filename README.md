# K² Lab Website

This repository contains the first version of the K² Lab academic research lab website for GitHub Pages.

The site is intentionally simple: plain HTML, CSS, a small JavaScript file, and JSON files for lab member profiles. There are no build tools, paid services, or external image dependencies.

## Files

- `index.html` edits the main website sections and text.
- `styles.css` edits the layout, colors, typography, and responsive design.
- `script.js` loads and renders the People section from the `people/` folder.
- `people/index.json` controls the order and group placement of lab member profiles.
- `people/[person-name]/profile.json` stores each member's name, role, department, interests, bio, email field, and optional photo path.
- `people/[person-name]/` can also store that member's profile photo.
- `people.json` is kept only as a legacy fallback file.
- `people/kangjin-kim/kangjin-kim.jpg` is the current PI profile photo used by the People section.

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

The publication list is currently written directly in the `#publications` section of `index.html`. To add a new publication, add a new `<li>` item inside the relevant `citation-list`.

After editing, commit and push the changes to GitHub. GitHub Pages will update automatically after deployment finishes.

## 3. How to Edit a Member Profile

Edit that member's folder under `people/`.

Examples:

- PI: `people/kangjin-kim/profile.json`
- Junjae Won: `people/junjae-won/profile.json`
- Jihyun Lee: `people/jihyun-lee/profile.json`
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

## 4. How to Add a New Student Folder

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

## 5. How to Add a Student Photo

1. Add the image file to that student's folder under `people/`.
2. Use a simple lowercase filename without spaces when possible.
3. Recommended examples:
   - `people/junjae-won/junjae-won.jpg`
   - `people/jihyun-lee/jihyun-lee.jpg`
   - `people/eunjae-han/eunjae-han.jpg`
   - `people/seoyoung-bae/seoyoung-bae.jpg`

## 6. How to Connect a Photo in `profile.json`

Set the `photo` field to the image path.

Example:

```json
"photo": "people/junjae-won/junjae-won.jpg"
```

If `photo` is empty or the image path is incorrect, the website will show a simple placeholder avatar instead of a broken image.

## 7. Information That Should Not Be Uploaded

Do not upload private personal information, including:

- Student ID numbers
- Birth dates
- Phone numbers
- Private addresses
- Personal identification numbers
- Private family information
- Sensitive health information
- Full CV files that contain references, private contact details, or other information that has not been checked for public sharing
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
