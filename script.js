const peopleContainer = document.querySelector("#people-content");

const groupTitles = {
  principalInvestigator: "Principal Investigator",
  graduateStudents: "Graduate Students",
  undergraduateResearchers: "Undergraduate Researchers",
  alumni: "Alumni"
};

const createElement = (tag, className, text) => {
  const element = document.createElement(tag);
  if (className) element.className = className;
  if (text) element.textContent = text;
  return element;
};

const initialsFor = (name) =>
  name
    .split(" ")
    .filter(Boolean)
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

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

const createPersonCard = (person) => {
  const card = createElement("article", "person-card");
  const details = createElement("div", "person-details");

  details.appendChild(createElement("h4", "", person.name));

  if (person.koreanName) {
    details.appendChild(createElement("div", "person-korean-name", person.koreanName));
  }

  details.appendChild(createElement("p", "person-role", person.role));

  const meta = [person.title, person.department].filter(Boolean).join(" · ");
  if (meta) details.appendChild(createElement("div", "person-meta", meta));

  if (person.email) {
    const email = createElement("div", "person-email");
    const link = createElement("a", "", person.email);
    link.href = `mailto:${person.email}`;
    email.append("Email: ", link);
    details.appendChild(email);
  } else {
    details.appendChild(createElement("div", "person-email", "Email available upon request"));
  }

  if (person.researchInterests?.length) {
    details.appendChild(
      createElement("div", "person-interests", `Research interests: ${person.researchInterests.join(", ")}`)
    );
  }

  if (person.bio) {
    details.appendChild(createElement("p", "person-bio", person.bio));
  }

  card.appendChild(createAvatar(person));
  card.appendChild(details);
  return card;
};

const renderPeopleGroup = (key, people) => {
  const section = createElement("section", "people-group");
  section.appendChild(createElement("h3", "", groupTitles[key] || key));

  if (!people.length) {
    section.appendChild(createElement("p", "empty-note", key === "alumni" ? "No alumni listed yet." : "No members listed yet."));
    return section;
  }

  const grid = createElement("div", "people-grid");
  people.forEach((person) => grid.appendChild(createPersonCard(person)));
  section.appendChild(grid);
  return section;
};

const renderPeople = (data) => {
  peopleContainer.innerHTML = "";
  Object.keys(groupTitles).forEach((key) => {
    peopleContainer.appendChild(renderPeopleGroup(key, data[key] || []));
  });
};

fetch("people.json")
  .then((response) => {
    if (!response.ok) throw new Error("Could not load people.json");
    return response.json();
  })
  .then(renderPeople)
  .catch((error) => {
    peopleContainer.innerHTML = "";
    peopleContainer.appendChild(
      createElement("p", "empty-note", `People information could not be loaded: ${error.message}`)
    );
  });
