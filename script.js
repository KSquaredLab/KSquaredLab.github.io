const peopleContainer = document.querySelector("#people-content");
const researchContainer = document.querySelector("#research-content");
const galleryContainer = document.querySelector("#gallery-content");
const projectsContainer = document.querySelector("#projects-content");
const dataVersion = "20260608-seoyoung";

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

const createGalleryPlaceholder = (item) => {
  const placeholder = createElement("div", "gallery-placeholder");
  placeholder.setAttribute("role", "img");
  placeholder.setAttribute("aria-label", item.alt || item.title || "Gallery image placeholder");
  placeholder.appendChild(createElement("span", "gallery-placeholder-label", item.title || "Lab Life"));
  return placeholder;
};

const createGalleryCard = (item) => {
  const card = createElement("article", "gallery-card");
  const media = createElement("div", "gallery-media");

  const placeholder = createGalleryPlaceholder(item);
  media.appendChild(placeholder);

  if (item.image) {
    const image = document.createElement("img");
    image.alt = item.alt || item.title || "Lab activity photo";
    image.loading = "lazy";
    image.onload = () => {
      if (image.naturalWidth > 0 && placeholder.isConnected) {
        placeholder.replaceWith(image);
      }
    };
    image.src = item.image;
  }

  const body = createElement("div", "gallery-card-body");
  const meta = [item.date].filter(Boolean).join(" · ");

  body.appendChild(createElement("h3", "", item.title || "Lab Life"));
  if (meta) body.appendChild(createElement("div", "gallery-date", meta));
  if (item.caption) body.appendChild(createElement("p", "", item.caption));

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
