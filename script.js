const DOM = {
    muscles: document.getElementById('muscles'),
    search: document.getElementById('search'),
    dialog: document.querySelector('dialog'),
    fact: document.querySelector('.fact')
  };
  
  let muscles = [];
  const facts = [
    "Trebušne mišice delujejo kot naravni pas, ki podpira hrbtenico.",
    "Biceps je dejansko manj pomemben za moč roke kot triceps.",
    "Prsne mišice so edine, ki se lahko skrčijo do 60% svoje dolžine.",
    "Človeško telo ima več kot 600 mišic.",
    "Mečne mišice so najmočnejše glede na svojo velikost.",
    "Mišice rastejo med počitkom, ne med vadbo!"
  ];
  
  fetch('muscleData.json')
  .then(r => r.json())
  .then(data => {
    muscles = data;
    renderMuscles();
    document.querySelectorAll('nav button').forEach(btn =>
      btn.onclick = () => {
        document.querySelector('nav .active').classList.remove('active');
        btn.classList.add('active');
        renderMuscles();
      }
    );

    DOM.fact.textContent = facts[0]; // ✅ Dodaj sem
  });

  
  function renderMuscles() {
    const filter = document.querySelector('nav .active').dataset.filter;
    const search = DOM.search.value.toLowerCase();
  
    const filtered = muscles.filter(m =>
      (filter === 'vse' || m.group === filter) &&
      m.name.toLowerCase().includes(search)
    );
  
    DOM.muscles.innerHTML = filtered.length ?
      filtered.map(m => `
        <article>
          <img src="${m.image}" alt="${m.name}">
          <h3>${m.name}</h3>
          <p>${m.shortDescription}</p>
        </article>
      `).join('') : '<p>Ni mišic, ki ustrezajo iskalnim kriterijem</p>';
  
    DOM.muscles.querySelectorAll('article').forEach((el, i) =>
      el.onclick = () => showDetail(filtered[i])
    );
  }
  
  function showDetail(muscle) {
    DOM.dialog.querySelector('h2').textContent = muscle.name;
    DOM.dialog.querySelector('.latin').textContent = muscle.shortDescription;
    DOM.dialog.querySelector('.content').innerHTML = `
      <div class="description">
        <p>${muscle.longDescription}</p>
      </div>
      <h3>Vadba:</h3>
      ${muscle.exercises.map(ex => `
        <div class="exercise">
          <h4>${['🌟','💪','🔥'][['Začetnik','Srednji','Napredni'].indexOf(ex.level)]} ${ex.name}</h4>
          <p>${ex.description}</p>
        </div>
      `).join('')}
    `;
    DOM.dialog.showModal();
  }
  
  DOM.search.addEventListener('input', renderMuscles);
  
  document.getElementById('new-fact').onclick = () =>
    DOM.fact.textContent = facts[Math.floor(Math.random() * facts.length)];
  
  const quiz = {
    questions: [
      {
        question: "Katera mišična skupina omogoča upogib komolca?",
        answers: [
          { text: "Dvoglava nadlaktna mišica (biceps)", correct: true },
          { text: "Trologlava nadlaktna mišica (triceps)", correct: false },
          { text: "Prsne mišice", correct: false },
          { text: "Ramenske mišice", correct: false }
        ]
      },
      {
        question: "Kje se nahaja zadnja stegenska mišica?",
        answers: [
          { text: "Na zadnji strani stegna", correct: true },
          { text: "Na sprednji strani stegna", correct: false },
          { text: "V zgornjem delu roke", correct: false },
          { text: "V spodnjem delu noge", correct: false }
        ]
      },
      {
        question: "Katera mišična skupina spada v trup?",
        answers: [
          { text: "Trebušne mišice", correct: true },
          { text: "Dvoglava nadlaktna mišica", correct: false },
          { text: "Mečne mišice", correct: false },
          { text: "Prsne mišice", correct: false }
        ]
      },
      {
        question: "Katera mišica je glavna za potisne gibe?",
        answers: [
          { text: "Trologlava nadlaktna mišica (triceps)", correct: true },
          { text: "Dvoglava nadlaktna mišica (biceps)", correct: false },
          { text: "Mečne mišice", correct: false },
          { text: "Trebušne mišice", correct: false }
        ]
      },
      {
        question: "Katera mišica je ključna za stabilnost pri sedenju?",
        answers: [
          { text: "Sedalne mišice", correct: true },
          { text: "Ramenske mišice", correct: false },
          { text: "Prsne mišice", correct: false },
          { text: "Mečne mišice", correct: false }
        ]
      }
    ],
    current: 0,
    score: 0,
  
    init() {
      document.getElementById('start').onclick = () => this.start();
      document.getElementById('retry').onclick = () => this.start();
    },
  
    start() {
      this.current = 0;
      this.score = 0;
      document.getElementById('results').hidden = true;
      document.getElementById('start').hidden = true;
      this.questions = this.shuffleArray(this.questions); // shuffle order
      this.showQuestion();
    },
  
    showQuestion() {
      const q = this.questions[this.current];
      const qna = document.getElementById('qna');
      const shuffledAnswers = this.shuffleArray([...q.answers]);
  
      qna.innerHTML = `
        <p>${q.question}</p>
        <div class="answers">
          ${shuffledAnswers.map(a => `
            <button class="answer" data-correct="${a.correct}">${a.text}</button>
          `).join('')}
        </div>
        <button id="next" hidden>${this.current === this.questions.length - 1 ? 'Zaključi' : 'Naprej'}</button>
      `;
  
      qna.querySelectorAll('.answer').forEach(btn =>
        btn.onclick = () => this.select(btn)
      );
  
      document.getElementById('next').onclick = () => {
        this.current++;
        if (this.current < this.questions.length) this.showQuestion();
        else this.showResult();
      };
    },
  
    select(btn) {
      const correct = btn.dataset.correct === 'true';
      if (correct) this.score++;
  
      document.querySelectorAll('.answer').forEach(b => {
        const isCorrect = b.dataset.correct === 'true';
        b.classList.add(isCorrect ? 'correct' : 'incorrect');
        b.disabled = true;
      });
  
      document.getElementById('next').hidden = false;
    },
  
    showResult() {
      document.getElementById('qna').innerHTML = '';
      document.getElementById('results').hidden = false;
      document.getElementById('start').hidden = true; // skrij "Začni kviz"
      document.getElementById('score').textContent = this.score;
    },
  
    shuffleArray(array) {
      return array.sort(() => Math.random() - 0.5);
    }
  };
  
  quiz.init();
  
  
  