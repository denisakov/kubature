const handleContactSubmit = (e) => {
  e.preventDefault();
  const formEl = e.target;
  const formData = new FormData(formEl);

  const name = formData.get('name');
  const email = formData.get('email');
  const message = formData.get('message');
  if (!name || !email || !message) {
    document.querySelector('#alert').classList.remove('hidden');
    return false;
  }
  document.querySelector('#contact-submit').disabled = true;
  const url = 'https://script.google.com/macros/s/AKfycbzxq082-HQwvCdGDTUnxESz7NVRoYNofMxtfwhHuQ5b7KkABsnoyvhLEzTBDYUdDGPj/exec';
  const headers = new Headers();
  headers.append('Content-Type', 'application/json');

  const req = new Request(url, {
    method: 'POST',
    mode: 'no-cors',
    headers,
    body: JSON.stringify([new Date(), name, email, message]),
  });

  fetch(req)
    .then(() => {
      document.querySelector('#contact-form').classList.add('hidden');
      document.querySelector(
        '.message'
      ).innerText = `Your message was recorded successfully. I'll reply shortly.`;
    })
    .catch((err) => console.log(err));
};

const handleSelect = () => {
  const componentSelection = document.querySelector('#case-filter').value.toLowerCase();
  const industrySelection = document.querySelector('#type-filter').value.toLowerCase();
  const cards = document.querySelectorAll('project-card');

  cards.forEach((card) => {
    const cardTopics = card.getAttribute('data-topics') || '';
    const cardIndustry = (card.getAttribute('data-industry') || '').toLowerCase();

    const matchesComponent = componentSelection === 'all' || cardTopics.includes(componentSelection);
    const matchesIndustry = industrySelection === 'all' || cardIndustry === industrySelection;

    if (matchesComponent && matchesIndustry) {
      card.classList.remove('hidden');
    } else {
      card.classList.add('hidden');
    }
  });
};

// function showUrlsByTopic(topic) {
//   const allCards = document.querySelectorAll('project-card');
//   console.log(
//     '\u001b[' +
//       31 +
//       'm' +
//       `Remember to update sitemap.txt by running this function without an argument.` +
//       '\u001b[0m'
//   );
//   console.log(`Total case studies: ${allCards.length}`);
//   const cards = topic ? document.querySelectorAll(`project-card[data-topics*="${topic.toLowerCase()}"]`) : allCards;
//   if (cards.length === 0) {
//     console.log(`No cards found containing ${topic}`);
//     return;
//   }
//   cards.forEach((card) => {
//     const url = card.getAttribute('data-url');
//     // log to console w/o file/line no. on the right
//     // for easy copy/paste
//     setTimeout(console.log.bind(console, `https://${window.location.hostname}/${url}`));
//   });
// }

// this is for query param
const toggleSelect = (value) => {
  const caseFilter = document.querySelector('#case-filter');
  const isValidValue = Array.from(caseFilter.options)
    .filter((option) => option.attributes && option.attributes.value)
    .map((option) => option.attributes.value.nodeValue.toLowerCase())
    .some((option) => option.includes(value));
  if (!isValidValue) {
    return;
  }
  caseFilter.value = value;
  //M.FormSelect.init(caseFilter, {});
  // in some cases, this is also required:
  caseFilter.dispatchEvent(new Event('change'));
};
async function callDoc() {
  var output = [];
  var data = await fetch('https://script.google.com/macros/s/AKfycbyfhorMP1QyHKWleZcmgE4kxnn7pdARfKF_N1km--g4Ly30EX1i7l5JH4D_k3SNQgc41w/exec')
    .then((response) => response.json())
    .then((res) => {
      //console.log(res);
      var projects = res.data;
      projects.forEach((project) => {
        var row = {}
        var keys = Object.keys(project);
        for (var i = 0; i < keys.length; i++) {
          row[keys[i]] = project[keys[i]];
        }
        output.push(row);
      });
    })
    .catch((error) => {
      console.error(error);
    });
  //console.log(output);
  return output;
}
const ready = async () => {
  const dataJson = await callDoc();
  const cardList = document.getElementById("cardList");
  const industryFilter = document.getElementById("type-filter");
  const industries = new Set();

  cardList.innerHTML = '';

  for (let i = 0; i < dataJson.length; i++) {
    const card = document.createElement("project-card");
    const industry = dataJson[i]["industry"] || "Other";
    const topics = (dataJson[i]["technologies"] || "").toLowerCase();

    card.setAttribute("title", dataJson[i]["title"]);
    card.setAttribute("description", dataJson[i]["description"]);
    card.setAttribute("year", dataJson[i]["year"]);
    card.setAttribute("industry", industry);
    card.setAttribute("timePeriod", dataJson[i]["timePeriod"]);
    card.setAttribute("cost", dataJson[i]["cost"]);
    card.setAttribute("request", dataJson[i]["request"]);
    card.setAttribute("solution", dataJson[i]["solution"]);
    card.setAttribute("feedback", dataJson[i]["feedback"]);
    card.setAttribute("technologies", dataJson[i]["technologies"]);

    // Add filtering attributes
    card.setAttribute("data-industry", industry);
    card.setAttribute("data-topics", topics);

    card.className = "item pure-u-sm-22-24 pure-u-md-11-24 pure-u-lg-8-24 pure-u-xl-6-24";
    cardList.appendChild(card);

    if (industry) industries.add(industry);
  }

  // Populate Industry Filter
  const sortedIndustries = Array.from(industries).sort();
  sortedIndustries.forEach(industry => {
    const option = document.createElement("option");
    option.value = industry;
    option.innerText = industry;
    industryFilter.appendChild(option);
  });

  // Mobile sidenav
  const elems = document.querySelectorAll('.sidenav');
  //M.Sidenav.init(elems, {});
  // Contact form
  const contactForm = document.querySelector('#contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', handleContactSubmit);
  }
  // Portfolio filter
  const selectors = document.querySelectorAll('select');
  if (selectors) {
    //M.FormSelect.init(selectors, {});
    selectors.forEach((selector) =>
      selector.addEventListener('change', handleSelect)
    );
  }
  // Query param for portfolio filter
  const searchParams = new URLSearchParams(window.location.search);
  if (searchParams.has('p')) {
    toggleSelect(searchParams.get('p').toLowerCase());
  } else {
  }
};

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', ready);
} else {
  ready();
}
