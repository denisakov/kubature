const template = document.createElement('template');
template.innerHTML = `
<style>
body {
  font-family: 'Merriweather', serif;
  font-size: 16px;
}
.title{
  font-family: 'Saira';
  font-size: 22px;
  margin-top: 5px;
  font-weight: 600;
  letter-spacing: -0.3px;
}
.item-in {
  background: #fcfcfc;
  margin: 5px 10px 5px 0px;
  padding: 7px;
  position: relative;

  &:hover:before {
    width: 100%;
  }

  &::before {
  content: "";
  position: absolute;
  bottom: 0px;
  height: 2px;
  width: 0%;
  background: #333333;
  right: 0px;
  -webkit-transition: width 0.4s;
  transition: width 0.4s;
  }
}
.description {
  color: #000;
  font-size: 0.8em;
  line-height: 1.25em;
  margin-bottom: 1em;
}
.item {
  position: relative;
  min-height: 1px;
  float: left;
  backface-visibility: hidden;
  -webkit-backface-visibility: hidden;
  -webkit-tap-highlight-color: transparent;
  -webkit-touch-callout: none;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
  a {
    font-family: 'Montserrat', sans-serif;
    font-size: 12px;
    text-transform: uppercase;
    color: #666666;
    margin-top: 10px;

    i {
      opacity: 0;
      padding-left: 0px;
      transition: 0.4s;
      font-size: 24px;
      display: inline-block;
      top: 5px;
      position: relative;
      }
    
    &:hover {
      text-decoration:none;
      i {
        padding-left: 10px;
        opacity: 1;
        font-weight: 300;
        }
      }
    }
  }
  .smallInfo {
    font-size: 0.7rem;
  }
  
  .tags {
    list-style: none;
    margin: 0;
    overflow: hidden; 
    padding: 0;
  }
  
  .tags li {
    float: left;
    font-size: 10px;
  }
  .tag {
    font-family: 'Saira';
    font-weight: 300;
    letter-spacing: 0.2px;
    background: #ddd;
    border-radius: 3px 0 0 3px;
    color: #000;
    display: inline-block;
    height: 16px;
    line-height: 16px;
    padding: 0 20px 0 7px;
    position: relative;
    
    text-decoration: none;
    -webkit-transition: color 0.2s;
  }
  
  .tag::before {
    background: #fff;
    border-radius: 10px;
    box-shadow: inset 0 1px rgba(0, 0, 0, 0.25);
    content: '';
    height: 6px;
    right: 8px;
    position: absolute;
    width: 6px;
    top: 4px;
  }
  .tag::after {
    background: #fcfcfc;
    border-bottom: 10px solid transparent;
    border-left: 6px solid #eee;
    border-top: 6.5px solid transparent;
    content: '';
    position: absolute;
    right: 0;
    top: 0;
  }
  .tag:hover {
    background-color: #5327c3;
    color: white;
  }
  .tag:hover::after {
     border-left-color: #5327c3; 
  }
}

div .separatorDate{
  font-size: 0.7rem;
}
.separatorDate::before,
.separatorDate::after {
  display: inline-block;
  content: "";
  border-top: .17rem solid #777;
  width: 5%;
  margin: 0 0.2rem;
  transform: translateY(-0.2rem);
}
#infoButton{
  float:right;
}

/* DETAILS */
.popupContent {
  display: none;
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  padding: 20px 20px 0 20px;
  background-color: #fff;
  box-shadow: 20px 16px 20px 20px rgba(0, 0, 0, 0.2);
  max-height: 80%; /* Set a maximum height */
  overflow-y: auto; /* Add this property for vertical scrollbar */
  z-index: 1000;
}
.popupBody {
  display: flex;
  justify-content: space-between;
  padding: 10px 0;
}
.popupHeader {
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid #ddd;
  padding-bottom: 10px;
}
.column {
  width: 48%;
  box-sizing: border-box;
  padding: 0 10px;
}
.popupFullLength{
  width: 100%;
  box-sizing: border-box;
  padding: 0 10px;
}
.popupFooter {
  width: 100%;
  position: relative;
  bottom: 0;
  left: 0;
  margin: 20px 20px 20px 0;
}
.subtitle{
  font-weight: 600;
  margin: unset;
}
.request, .solution, .technologies, .cost, .time, .feedback{
  margin-top: unset;
  font-size: 0.9em;
}
.feedback{
  font-style: italic;
}
.closeBtn {
  cursor: pointer;
}
.popupButtons {
  text-align: center;
}
.button-success,
.button-error,
.button-warning,
.button-secondary {
  color: white;
  border-radius: 4px;
  text-shadow: 0 1px 1px rgba(0, 0, 0, 0.2);
  padding: 5px 10px;
}
.button-large {
  font-size: 115%;
}
.button-success {
  background: rgb(28, 184, 65);
  /* this is a green */
}
/* END Details */

</style>
<div class="containment" data-tags="">
  <div class="item-in">
    <div class="title"></div>
    <div class="">
      <span class="separatorDate smallInfo"></span>
      <button id="infoButton" class="popup-trigger" data-popup-id=""></button>
    </div>
    <div class="description">
    </div>
    <ul class="tags"></ul>
  </div>
  <div class="popupContent">
    <div class="popupHeader">
      <span class="popupTitle"></span>
      <span class="closeBtn">&times;</span>
    </div>
    <div class="popupBody">
      <div class="column">
        <p class="subtitle">Request</p>
        <p class="request"></p>
      </div>
      <div class="column">
        <p class="subtitle">Solution</p>
        <p class="solution"></p>
      </div>
    </div>
    <div class="popupBody">
      <div class="column">
        <p class="subtitle">Time Required</p>
        <p class="time"></p>
      </div>
      <div class="column">
        <p class="subtitle">Estimated Cost</p>
        <p class="cost"></p>
      </div>
    </div>
    <div>
      <div class="popupFullLength">
        <p class="subtitle">Technologies</p>
        <p class="technologies"></p>
      </div>
    </div>
    <div>
      <div class="popupFullLength">
        <p class="subtitle">Feedback</p>
        <p class="feedback"></p>
      </div>
    </div>
    <div class="popupFooter">
      <div class="popupButtons">
          <button class="serviceRequest button-large button-success pure-button">I need something like this</button>
      </div>
    </div>
  </div>
</div>`;
function hasClass(ele, cls) {
  return !!ele.className.match(new RegExp('(\\s|^)' + cls + '(\\s|$)'));
}
function addClass(ele, cls) {
  if (!hasClass(ele, cls)) ele.className += ' ' + cls;
}
function removeClass(ele, cls) {
  if (hasClass(ele, cls)) {
    var reg = new RegExp('(\\s|^)' + cls + '(\\s|$)');
    ele.className = ele.className.replace(reg, ' ');
  }
}
const toggleClass = (ele, cls) => {
  return function () {
    if (hasClass(ele, cls)) {
      removeClass(ele, cls);
    } else {
      addClass(ele, cls);
    }
  };
};
class ProjectCard extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }
  connectedCallback() {
    //this.setAttribute('data-tags', this.getAttribute('tags'));
    //this.setAttribute('data-url', this.getAttribute('target'));
    this.shadowRoot.appendChild(template.content.cloneNode(true));
    
    //this.shadowRoot.querySelector('img').src = this.getAttribute('image');
    this.shadowRoot.querySelector('.title').innerText = this.getAttribute('title');
    this.shadowRoot.querySelector('.description').innerText = this.getAttribute('description');
    this.shadowRoot.querySelector('.tags').innerHTML = '<li><a href="#" class="tag" alt="">'+this.getAttribute('industry')+'</a></li>';
    this.shadowRoot.querySelector('.separatorDate').innerText = this.getAttribute('year');
    
    const now = new Date().getMilliseconds().toString();
    const id = this.getAttribute('title').replace(' ','').toLowerCase().substring(0,10) + now;

    this.shadowRoot.querySelector(".popupTitle").innerHTML = this.getAttribute('title');
    this.shadowRoot.querySelector(".request").innerHTML = this.getAttribute('request');
    this.shadowRoot.querySelector(".solution").innerHTML = this.getAttribute('solution');
    this.shadowRoot.querySelector(".technologies").innerHTML = this.getAttribute('technologies');
    this.shadowRoot.querySelector(".cost").innerHTML = this.getAttribute('cost');
    this.shadowRoot.querySelector(".time").innerHTML = this.getAttribute('timePeriod');
    this.shadowRoot.querySelector(".feedback").innerHTML = this.getAttribute('feedback');

    var triggerButton = this.shadowRoot.querySelector("#infoButton");
    var detailsContainer = this.shadowRoot.querySelector('.popupContent');
    
    triggerButton.innerHTML = 'Details';
      //'<svg xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 512 512"><style>svg{fill:#4d4d4d}</style><path d="M256 8C119.043 8 8 119.083 8 256c0 136.997 111.043 248 248 248s248-111.003 248-248C504 119.083 392.957 8 256 8zm0 448c-110.532 0-200-89.431-200-200 0-110.495 89.472-200 200-200 110.491 0 200 89.471 200 200 0 110.53-89.431 200-200 200zm107.244-255.2c0 67.052-72.421 68.084-72.421 92.863V300c0 6.627-5.373 12-12 12h-45.647c-6.627 0-12-5.373-12-12v-8.659c0-35.745 27.1-50.034 47.579-61.516 17.561-9.845 28.324-16.541 28.324-29.579 0-17.246-21.999-28.693-39.784-28.693-23.189 0-33.894 10.977-48.942 29.969-4.057 5.12-11.46 6.071-16.666 2.124l-27.824-21.098c-5.107-3.872-6.251-11.066-2.644-16.363C184.846 131.491 214.94 112 261.794 112c49.071 0 101.45 38.304 101.45 88.8zM298 368c0 23.159-18.841 42-42 42s-42-18.841-42-42 18.841-42 42-42 42 18.841 42 42z"/></svg>';
    triggerButton.setAttribute('data-popup-id',id);
    triggerButton.addEventListener("click", () => {
      detailsContainer.style.display = 'block';
    });
    detailsContainer.setAttribute('id',id);
    this.shadowRoot.querySelector('.closeBtn').addEventListener('click', () => {
      detailsContainer.style.display = 'none';
    });
    
    //this.shadowRoot.querySelector('.timePeriod').innerText = this.getAttribute('timePeriod');
    // const ta = this.shadowRoot.querySelector('tags');
    // const href = this.getAttribute('target');
    // as.forEach(function (a) {
    //   a.href = href;
    // });
  }
  // disconnectedCallback() {
  //   this.shadowRoot
  //     .querySelector('project-card')
  //     .removeEventListener('mouseover', toggleClass);
  //   this.shadowRoot
  //     .querySelector('project-card')
  //     .removeEventListener('mouseout', toggleClass);
  // }
}
window.customElements.define('project-card', ProjectCard);

