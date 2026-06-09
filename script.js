const peopleContainer = document.querySelector("#people-content");
const researchContainer = document.querySelector("#research-content");
const galleryContainer = document.querySelector("#gallery-content");
const projectsContainer = document.querySelector("#projects-content");
const dataVersion = "20260609-eunjae-han";

const defaultGroups = [
  { key: "principalInvestigator", title: "Principal Investigator" },
  { key: "graduateStudents", title: "Graduate Students" },
  { key: "undergraduateResearchers", title: "Undergraduate Researchers" }
];

const createElement = (tag, className, text) => {
  const element = document.createElement(tag);
  if (className) element.className = className;
  if (text) element.textContent = text;
  return element;
};

const initialsFor = (name = "") =>
  name
    .split(" ")
    .filter(Boolean)
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

const fetchJson = async (path) => {
  const controller = new AbortController();
  const timeout = window.setTimeout(() => controller.abort(), 8000);
  const separator = path.includes("?") ? "&" : "?";
  const cacheSafePath = `${path}${separator}v=${dataVersion}`;

  try {
    const response = await fetch(cacheSafePath, { cache: "no-cache", signal: controller.signal });
    if (!response.ok) throw new Error(`Could not load ${path}`);
    return response.json();
  } finally {
    window.clearTimeout(timeout);
  }
};

const createAvatar = (person) => {
  if (person.photo) {
    const image = document.createElement("img");
    image.className = "person-photo";
    image.src = person.photo;
    image.alt = `${person.name} portrait`;
    image.loading = "lazy";
    image.onerror = () => {
      const placeholder = createElement("div", "person-placeholder", initialsFor(person.name));
      image.replaceWith(placeholder);
    };
    return image;
  }

  return createElement("div", "person-placeholder", initialsFor(person.name));
};

const createPersonBackground = (items = []) => {
  const validItems = items.filter((item) => item?.label && item?.value);
  if (!validItems.length) return null;

  const background = createElement("div", "person-background");

  const list = createElement("dl", "person-background-list");
  validItems.forEach((item) => {
    const row = createElement("div", "person-background-row");
    row.appendChild(createElement("dt", "", item.label));
    row.appendChild(createElement("dd", "", item.value));
    list.appendChild(row);
  });

  background.appendChild(list);
  return background;
};

const createPersonLinks = (links = []) => {
  const validLinks = links.filter((link) => link?.label && link?.url);
  if (!validLinks.length) return null;

  const container = createElement("div", "person-links");
  container.append("Links: ");

  validLinks.forEach((link, index) => {
    if (index > 0) container.append(" · ");

    const anchor = createElement("a", "", link.label);
    anchor.href = link.url;
    anchor.target = "_blank";
    anchor.rel = "noopener";
    container.appendChild(anchor);
  });

  return container;
};

const createPersonCard = (person, groupKey) => {
  const isPrincipalInvestigator = groupKey === "principalInvestigator";
  const card = createElement(
    "article",
    `person-card ${isPrincipalInvestigator ? "person-card-pi" : "person-card-member"}`
  );
  const details = createElement("div", "person-details");

  details.appendChild(createElement("h4", "", person.name));

  if (person.koreanName) {
    details.appendChild(createElement("div", "person-korean-name", person.koreanName));
  }

  details.appendChild(createElement("p", "person-role", person.role));

  const meta = [person.title, person.department].filter(Boolean).join(" · ");
  if (meta) details.appendChild(createElement("div", "person-meta", meta));

  if (person.training) {
    details.appendChild(createElement("div", "person-training", person.training));
  }

  if (person.email) {
    const email = createElement("div", "person-email");
    const link = createElement("a", "", person.email);
    link.href = `mailto:${person.email}`;
    email.append("Email: ", link);
    details.appendChild(email);
  } else {
    details.appendChild(createElement("div", "person-email", "Email available upon request"));
  }

  const links = createPersonLinks(person.links || []);
  if (links) details.appendChild(links);

  if (person.researchInterests?.length) {
    details.appendChild(
      createElement("div", "person-interests", `Research interests: ${person.researchInterests.join(", ")}`)
    );
  }

  if (person.bio) {
    details.appendChild(createElement("p", "person-bio", person.bio));
  }

  const background = createPersonBackground(person.background || []);
  if (background) details.appendChild(background);

  card.appendChild(createAvatar(person));
  card.appendChild(details);
  return card;
};

const renderPeopleGroup = ({ key, title, people }) => {
  const section = createElement("section", "people-group");
  section.dataset.group = key;
  section.appendChild(createElement("h3", "", title));

  if (!people.length) {
    section.appendChild(createElement("p", "empty-note", "No members listed yet."));
    return section;
  }

  const grid = createElement("div", "people-grid");
  people.forEach((person) => grid.appendChild(createPersonCard(person, key)));
  section.appendChild(grid);
  return section;
};

const renderPeople = (groups) => {
  peopleContainer.innerHTML = "";
  groups.forEach((group) => {
    peopleContainer.appendChild(renderPeopleGroup(group));
  });
};

const loadPeopleFromManifest = async () => {
  const manifest = await fetchJson("./people/index.json");
  const groups = manifest.groups || [];

  return Promise.all(
    groups.map(async (group) => {
      const people = await Promise.all((group.profiles || []).map((path) => fetchJson(path)));
      return {
        key: group.key,
        title: group.title,
        people
      };
    })
  );
};

const loadPeopleFromPeopleJson = async () => {
  const data = await fetchJson("./people.json");
  if (!data || typeof data !== "object") {
    throw new Error("people.json is not a valid people data object");
  }

  return defaultGroups.map((group) => ({
    ...group,
    people: data[group.key] || []
  }));
};

const loadPeople = async () => {
  try {
    return await loadPeopleFromPeopleJson();
  } catch (peopleJsonError) {
    try {
      return await loadPeopleFromManifest();
    } catch (manifestError) {
      throw new Error(`${peopleJsonError.message}; ${manifestError.message}`);
    }
  }
};

const renderPeopleError = (error) => {
  const hasStaticFallback = peopleContainer.querySelector("[data-static-fallback]");
  const message = "Showing static people information because the live people data could not be loaded.";

  if (hasStaticFallback) {
    const fallbackNote = createElement("p", "empty-note", message);
    fallbackNote.dataset.peopleLoadError = error.message;
    peopleContainer.appendChild(fallbackNote);
    return;
  }

  peopleContainer.innerHTML = "";
  peopleContainer.appendChild(createElement("p", "empty-note", message));
};

if (peopleContainer) {
  loadPeople()
    .then(renderPeople)
    .catch(renderPeopleError);
}

const createResearchPlaceholder = (theme) => {
  const placeholder = createElement("div", "research-theme-placeholder");
  placeholder.setAttribute("role", "img");
  placeholder.setAttribute("aria-label", theme.alt || `${theme.title} visual placeholder`);
  placeholder.appendChild(createElement("span", "", theme.title || "Research"));
  return placeholder;
};

const createRelatedWork = (items = []) => {
  const validItems = items.filter((item) => item?.label);
  if (!validItems.length) return null;

  const related = createElement("div", "related-work");
  related.appendChild(createElement("h4", "", "Related work"));

  const list = createElement("ul", "");
  validItems.forEach((item) => {
    const listItem = document.createElement("li");
    if (item.url) {
      const link = createElement("a", "", item.label);
      link.href = item.url;
      listItem.appendChild(link);
    } else {
      listItem.textContent = item.label;
    }
    list.appendChild(listItem);
  });

  related.appendChild(list);
  return related;
};

const createResearchCard = (theme) => {
  const card = createElement("article", "research-theme-card");
  const media = createElement("div", "research-theme-media");
  const imageFit = theme.imageFit === "contain" ? "contain" : "cover";
  media.dataset.fit = imageFit;
  const placeholder = createResearchPlaceholder(theme);
  media.appendChild(placeholder);

  if (theme.image) {
    const image = document.createElement("img");
    image.className = "research-theme-image";
    image.alt = theme.alt || theme.title || "Research figure thumbnail";
    image.loading = "eager";
    image.style.objectFit = imageFit;
    if (theme.imagePosition) image.style.objectPosition = theme.imagePosition;
    image.onload = () => {
      if (image.naturalWidth > 0) {
        image.classList.add("is-loaded");
        if (placeholder.isConnected) placeholder.remove();
      }
    };
    image.onerror = () => image.remove();
    media.appendChild(image);
    image.src = theme.image;
  }

  const body = createElement("div", "research-theme-body");
  const titleGroup = createElement("div", "research-theme-title-group");
  titleGroup.appendChild(createElement("h3", "", theme.title || "Research Theme"));
  if (theme.titleKo) {
    titleGroup.appendChild(createElement("div", "research-theme-title-ko", theme.titleKo));
  }
  body.appendChild(titleGroup);

  const descriptions = Array.isArray(theme.description) ? theme.description : [theme.description];
  descriptions
    .filter(Boolean)
    .slice(0, 3)
    .forEach((description) => body.appendChild(createElement("p", "", description)));

  const related = createRelatedWork(theme.relatedWork || []);
  if (related) body.appendChild(related);

  card.appendChild(media);
  card.appendChild(body);
  return card;
};

const renderResearch = (themes) => {
  const visibleThemes = Array.isArray(themes) ? themes.filter((theme) => theme && theme.title) : [];

  researchContainer.innerHTML = "";
  if (!visibleThemes.length) {
    researchContainer.appendChild(createElement("p", "empty-note", "Research themes will be added soon."));
    return;
  }

  visibleThemes.forEach((theme) => researchContainer.appendChild(createResearchCard(theme)));
};

const renderResearchError = () => {
  researchContainer.innerHTML = "";
  researchContainer.appendChild(createElement("p", "empty-note", "Research themes could not be loaded."));
};

if (researchContainer) {
  fetchJson("./research.json")
    .then(renderResearch)
    .catch(renderResearchError);
}

const galleryState = {
  modal: null,
  event: null,
  photos: [],
  index: 0,
  previousFocus: null,
  elements: {}
};

const getGalleryPhotos = (item = {}) => {
  const photos = Array.isArray(item.photos) ? item.photos.filter((photo) => photo?.src) : [];
  if (photos.length) return photos;

  const fallbackSrc = item.cover || item.image;
  return fallbackSrc
    ? [{ src: fallbackSrc, alt: item.alt || item.title || "Lab activity photo" }]
    : [];
};

const getGalleryCover = (item = {}) => item.cover || getGalleryPhotos(item)[0]?.src || item.image || "";

const getGalleryCoverAlt = (item = {}) => {
  const cover = getGalleryCover(item);
  const coverPhoto = getGalleryPhotos(item).find((photo) => photo.src === cover);
  return coverPhoto?.alt || item.alt || item.title || "Lab activity photo";
};

const getPhotoCountLabel = (count) => `${count} photo${count === 1 ? "" : "s"}`;

const createGalleryPlaceholder = (item) => {
  const placeholder = createElement("div", "gallery-placeholder");
  placeholder.setAttribute("role", "img");
  placeholder.setAttribute("aria-label", getGalleryCoverAlt(item));
  placeholder.appendChild(createElement("span", "gallery-placeholder-label", item.title || "Lab Life"));
  return placeholder;
};

const showGalleryPhoto = (direction) => {
  if (!galleryState.photos.length) return;
  galleryState.index = (galleryState.index + direction + galleryState.photos.length) % galleryState.photos.length;
  updateGalleryModal();
};

const closeGalleryModal = () => {
  if (!galleryState.modal || galleryState.modal.hidden) return;

  galleryState.modal.hidden = true;
  document.body.classList.remove("gallery-modal-open");
  if (galleryState.previousFocus?.focus) galleryState.previousFocus.focus();
};

const updateGalleryModal = () => {
  const photo = galleryState.photos[galleryState.index];
  if (!photo) return;

  const { title, date, image, placeholder, caption, count, prevButton, nextButton, thumbnails } =
    galleryState.elements;
  const eventTitle = galleryState.event?.title || "Lab Life";

  title.textContent = eventTitle;
  date.textContent = galleryState.event?.date || "";
  image.alt = photo.alt || eventTitle;
  image.style.display = "none";
  placeholder.hidden = false;
  placeholder.textContent = eventTitle;
  image.src = photo.src;
  if (image.complete && image.naturalWidth > 0) {
    image.style.display = "";
    placeholder.hidden = true;
  }

  const captionText = photo.caption || photo.alt || galleryState.event?.caption || "";
  caption.textContent = captionText;
  caption.hidden = !captionText;
  count.textContent = `${galleryState.index + 1} / ${galleryState.photos.length}`;

  const hasMultiplePhotos = galleryState.photos.length > 1;
  prevButton.hidden = !hasMultiplePhotos;
  nextButton.hidden = !hasMultiplePhotos;

  thumbnails.innerHTML = "";
  thumbnails.hidden = !hasMultiplePhotos;
  if (hasMultiplePhotos) {
    galleryState.photos.forEach((item, index) => {
      const thumbnail = createElement("button", "gallery-modal-thumb");
      thumbnail.type = "button";
      thumbnail.setAttribute("aria-label", `View photo ${index + 1}`);
      if (index === galleryState.index) {
        thumbnail.classList.add("is-active");
        thumbnail.setAttribute("aria-current", "true");
      }

      const thumbnailImage = document.createElement("img");
      thumbnailImage.alt = "";
      thumbnailImage.loading = "lazy";
      thumbnailImage.onerror = () => {
        thumbnail.classList.add("is-missing");
        thumbnailImage.remove();
        thumbnail.textContent = String(index + 1);
      };
      thumbnailImage.src = item.src;
      thumbnail.appendChild(thumbnailImage);
      thumbnail.addEventListener("click", () => {
        galleryState.index = index;
        updateGalleryModal();
      });
      thumbnails.appendChild(thumbnail);
    });
  }
};

const createGalleryModal = () => {
  const modal = createElement("div", "gallery-modal");
  modal.hidden = true;
  modal.setAttribute("role", "dialog");
  modal.setAttribute("aria-modal", "true");
  modal.setAttribute("aria-labelledby", "gallery-modal-title");

  const backdrop = createElement("div", "gallery-modal-backdrop");
  const dialog = createElement("div", "gallery-modal-dialog");

  const header = createElement("div", "gallery-modal-header");
  const heading = createElement("div", "gallery-modal-heading");
  const title = createElement("h3", "");
  title.id = "gallery-modal-title";
  const date = createElement("div", "gallery-modal-date");
  const closeButton = createElement("button", "gallery-modal-close", "Close");
  closeButton.type = "button";
  closeButton.setAttribute("aria-label", "Close gallery");

  heading.appendChild(title);
  heading.appendChild(date);
  header.appendChild(heading);
  header.appendChild(closeButton);

  const media = createElement("div", "gallery-modal-media");
  const prevButton = createElement("button", "gallery-modal-nav gallery-modal-prev", "Prev");
  const nextButton = createElement("button", "gallery-modal-nav gallery-modal-next", "Next");
  prevButton.type = "button";
  nextButton.type = "button";
  prevButton.setAttribute("aria-label", "Previous photo");
  nextButton.setAttribute("aria-label", "Next photo");

  const imageWrap = createElement("div", "gallery-modal-image-wrap");
  const image = document.createElement("img");
  const placeholder = createElement("div", "gallery-modal-placeholder", "Photo unavailable");
  image.onload = () => {
    if (image.naturalWidth > 0) {
      image.style.display = "";
      placeholder.hidden = true;
    }
  };
  image.onerror = () => {
    image.style.display = "none";
    placeholder.hidden = false;
  };
  imageWrap.appendChild(image);
  imageWrap.appendChild(placeholder);

  media.appendChild(prevButton);
  media.appendChild(imageWrap);
  media.appendChild(nextButton);

  const caption = createElement("p", "gallery-modal-caption");
  const footer = createElement("div", "gallery-modal-footer");
  const count = createElement("div", "gallery-modal-count");
  const thumbnails = createElement("div", "gallery-modal-thumbnails");
  footer.appendChild(count);
  footer.appendChild(thumbnails);

  dialog.appendChild(header);
  dialog.appendChild(media);
  dialog.appendChild(caption);
  dialog.appendChild(footer);
  modal.appendChild(backdrop);
  modal.appendChild(dialog);
  document.body.appendChild(modal);

  backdrop.addEventListener("click", closeGalleryModal);
  closeButton.addEventListener("click", closeGalleryModal);
  prevButton.addEventListener("click", () => showGalleryPhoto(-1));
  nextButton.addEventListener("click", () => showGalleryPhoto(1));

  galleryState.elements = {
    title,
    date,
    image,
    placeholder,
    caption,
    count,
    prevButton,
    nextButton,
    closeButton,
    thumbnails
  };
  galleryState.modal = modal;
};

const openGalleryModal = (item) => {
  const photos = getGalleryPhotos(item);
  if (!photos.length) return;

  if (!galleryState.modal) createGalleryModal();
  galleryState.event = item;
  galleryState.photos = photos;
  galleryState.index = 0;
  galleryState.previousFocus = document.activeElement;
  updateGalleryModal();

  galleryState.modal.hidden = false;
  document.body.classList.add("gallery-modal-open");
  galleryState.elements.closeButton.focus();
};

const createGalleryCard = (item) => {
  const card = createElement("article", "gallery-card");
  const photos = getGalleryPhotos(item);
  const cover = getGalleryCover(item);
  const media = createElement("div", "gallery-media");

  const placeholder = createGalleryPlaceholder(item);
  media.appendChild(placeholder);

  if (cover) {
    const image = document.createElement("img");
    image.alt = getGalleryCoverAlt(item);
    image.loading = "eager";
    image.style.display = "none";
    image.onload = () => {
      if (image.naturalWidth > 0 && placeholder.isConnected) {
        image.style.display = "";
        placeholder.replaceWith(image);
      }
    };
    image.onerror = () => {
      image.remove();
    };
    image.src = cover;
    media.appendChild(image);
  }

  const body = createElement("div", "gallery-card-body");
  const meta = [item.date].filter(Boolean).join(" · ");

  body.appendChild(createElement("h3", "", item.title || "Lab Life"));
  if (meta) body.appendChild(createElement("div", "gallery-date", meta));
  if (item.caption) body.appendChild(createElement("p", "", item.caption));

  const footer = createElement("div", "gallery-card-footer");
  footer.appendChild(createElement("span", "gallery-count", getPhotoCountLabel(photos.length)));
  if (photos.length) footer.appendChild(createElement("span", "gallery-action", "View photos"));
  body.appendChild(footer);

  if (photos.length) {
    card.tabIndex = 0;
    card.setAttribute("role", "button");
    card.setAttribute("aria-label", `${item.title || "Lab Life"}: view ${getPhotoCountLabel(photos.length)}`);
    card.addEventListener("click", () => openGalleryModal(item));
    card.addEventListener("keydown", (event) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        openGalleryModal(item);
      }
    });
  }

  card.appendChild(media);
  card.appendChild(body);
  return card;
};

const renderGallery = (items) => {
  const section = document.querySelector("#lab-life");
  const visibleItems = Array.isArray(items) ? items.filter((item) => item && item.title) : [];

  if (!visibleItems.length) {
    if (section) section.hidden = true;
    return;
  }

  galleryContainer.innerHTML = "";
  visibleItems.forEach((item) => galleryContainer.appendChild(createGalleryCard(item)));
};

const renderGalleryError = () => {
  const section = document.querySelector("#lab-life");
  if (section) section.hidden = true;
};

if (galleryContainer) {
  fetchJson("./gallery.json")
    .then(renderGallery)
    .catch(renderGalleryError);
}

document.addEventListener("keydown", (event) => {
  if (!galleryState.modal || galleryState.modal.hidden) return;

  if (event.key === "Escape") {
    closeGalleryModal();
  } else if (event.key === "ArrowLeft") {
    showGalleryPhoto(-1);
  } else if (event.key === "ArrowRight") {
    showGalleryPhoto(1);
  }
});

const createProjectCard = (project) => {
  const card = createElement("article", "project-card");

  card.appendChild(createElement("h3", "", project.title || "Funded Project"));

  if (project.koreanTitle) {
    card.appendChild(createElement("p", "project-title-korean", project.koreanTitle));
  }

  const facts = createElement("dl", "project-facts");
  [
    ["Funding agency", project.fundingAgency],
    ["Grant program", project.grantProgram || project.program],
    ["Period", project.period],
    ["Role", project.role],
    ["Total funding", project.totalFunding]
  ].forEach(([label, value]) => {
    if (!value) return;
    const row = createElement("div", "project-fact-row");
    row.appendChild(createElement("dt", "", label));
    row.appendChild(createElement("dd", "", value));
    facts.appendChild(row);
  });

  if (facts.children.length) {
    card.appendChild(facts);
  }

  if (project.description) {
    card.appendChild(createElement("p", "project-description", project.description));
  }

  return card;
};

const renderProjects = (projects) => {
  const section = document.querySelector("#projects");
  const visibleProjects = Array.isArray(projects) ? projects.filter((project) => project && project.title) : [];

  if (!visibleProjects.length) {
    if (section) section.hidden = true;
    return;
  }

  projectsContainer.innerHTML = "";
  visibleProjects.forEach((project) => projectsContainer.appendChild(createProjectCard(project)));
};

const renderProjectsError = () => {
  const section = document.querySelector("#projects");
  if (section) section.hidden = true;
};

if (projectsContainer) {
  fetchJson("./projects.json")
    .then(renderProjects)
    .catch(renderProjectsError);
}
