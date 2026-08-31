(() => {
  'use strict';

  // Replace this with the exact Venmo support URL used in Learn to Readle.
  const VENMO_URL = 'https://venmo.com/u/brianwbeard';
  const MELT_STAGES = 7;
  const STORAGE_KEY = 'snowman-v1-state';
  const LETTERS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

  if (!window.SNOWMAN_WORDS || !Array.isArray(window.SNOWMAN_WORDS)) {
    document.body.innerHTML = "<p style='font-family:sans-serif;padding:20px'>Word data failed to load. Please refresh the page.</p>";
    throw new Error('words.js did not load');
  }
  const words = window.SNOWMAN_WORDS;
  const byLength = Object.fromEntries(Array.from({length:5}, (_,i) => [i+4, words.filter(w => w.word.length === i+4)]));

  const state = loadState();
  let game = null;
  let mathAnswer = 0;
  let openModalId = null;

  const $ = (id) => document.getElementById(id);
  const els = {
    snowmanMount: $('snowmanMount'), reaction: $('reaction'), clueWrap: $('clueWrap'), clueText: $('clueText'),
    wordDisplay: $('wordDisplay'), message: $('message'), keyboard: $('keyboard'), newGameBtn: $('newGameBtn'),
    settingsBtn: $('settingsBtn'), statsBtn: $('statsBtn'), lengthButtons: $('lengthButtons'), clueToggle: $('clueToggle'),
    modalBackdrop: $('modalBackdrop'), settingsPanel: $('settingsPanel'), statsPanel: $('statsPanel'), statsGrid: $('statsGrid'), statsTotal: $('statsTotal'),
    mathQuestion: $('mathQuestion'), mathAnswer: $('mathAnswer'), mathSubmit: $('mathSubmit'), mathFeedback: $('mathFeedback'),
    venmoLink: $('venmoLink'), saveGuess: $('saveGuess'), saveSubmit: $('saveSubmit'), saveFeedback: $('saveFeedback'),
    winMessage: $('winMessage'), winWord: $('winWord'), winNextBtn: $('winNextBtn')
  };

  function loadState() {
    try {
      const raw = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
      return {
        length: Number(raw.length) >= 4 && Number(raw.length) <= 8 ? Number(raw.length) : 5,
        clues: raw.clues !== false,
        solved: raw.solved && typeof raw.solved === 'object' ? raw.solved : {},
        seen: raw.seen && typeof raw.seen === 'object' ? raw.seen : {}
      };
    } catch {
      return { length:5, clues:true, solved:{}, seen:{} };
    }
  }

  function saveState() { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); }

  function init() {
    updateLengthButtons();
    els.clueToggle.checked = state.clues;
    els.venmoLink.href = VENMO_URL;
    buildKeyboard();
    bindEvents();
    startGame();
  }


  function updateLengthButtons() {
    els.lengthButtons.querySelectorAll('[data-length]').forEach(btn => {
      const selected = Number(btn.dataset.length) === state.length;
      btn.classList.toggle('active', selected);
      btn.setAttribute('aria-pressed', String(selected));
    });
  }

  function bindEvents() {
    els.settingsBtn.addEventListener('click', () => {
      const willOpen = !els.settingsPanel.classList.contains('show');
      els.statsPanel.classList.remove('show');
      els.statsBtn.setAttribute('aria-expanded','false');
      els.settingsPanel.classList.toggle('show', willOpen);
      els.settingsBtn.setAttribute('aria-expanded', String(willOpen));
    });
    els.statsBtn.addEventListener('click', () => {
      const willOpen = !els.statsPanel.classList.contains('show');
      els.settingsPanel.classList.remove('show');
      els.settingsBtn.setAttribute('aria-expanded','false');
      if (willOpen) renderStats();
      els.statsPanel.classList.toggle('show', willOpen);
      els.statsBtn.setAttribute('aria-expanded', String(willOpen));
    });
    els.newGameBtn.addEventListener('click', startGame);
    els.lengthButtons.querySelectorAll('[data-length]').forEach(btn => btn.addEventListener('click', () => {
      state.length = Number(btn.dataset.length); saveState(); updateLengthButtons(); startGame();
    }));
    els.clueToggle.addEventListener('change', () => { state.clues = els.clueToggle.checked; saveState(); updateClue(); });
    els.modalBackdrop.addEventListener('click', closeModal);
    document.querySelectorAll('[data-close]').forEach(btn => btn.addEventListener('click', closeModal));
    document.querySelectorAll('[data-open]').forEach(btn => btn.addEventListener('click', () => {
      els.settingsPanel.classList.remove('show');
      els.settingsBtn.setAttribute('aria-expanded','false');
      openModal(btn.dataset.open);
    }));
    els.mathSubmit.addEventListener('click', checkMathGate);
    els.mathAnswer.addEventListener('keydown', e => { if (e.key === 'Enter') checkMathGate(); });
    els.saveSubmit.addEventListener('click', submitSaveGuess);
    els.winNextBtn.addEventListener('click', () => { closeModal(); startGame(); });
    els.saveGuess.addEventListener('keydown', e => { if (e.key === 'Enter') submitSaveGuess(); });
    document.addEventListener('keydown', handlePhysicalKeyboard);
  }

  function buildKeyboard() {
    els.keyboard.innerHTML='';
    LETTERS.forEach(letter => {
      const btn=document.createElement('button'); btn.className='key'; btn.textContent=letter; btn.dataset.letter=letter; btn.setAttribute('aria-label', `Guess ${letter}`);
      btn.addEventListener('click', () => guessLetter(letter)); els.keyboard.appendChild(btn);
    });
  }

  function handlePhysicalKeyboard(e) {
    if (openModalId) return;
    const key=e.key.toUpperCase();
    if (/^[A-Z]$/.test(key)) guessLetter(key);
  }

  function pickWord(length) {
    const pool=byLength[length] || [];
    if (!pool.length) return null;
    state.seen[length] ||= [];
    let unseen=pool.filter(x => !state.seen[length].includes(x.word));
    if (!unseen.length) { state.seen[length]=[]; unseen=pool.slice(); }
    const item=unseen[Math.floor(Math.random()*unseen.length)];
    state.seen[length].push(item.word); saveState(); return item;
  }

  function startGame() {
    const item=pickWord(state.length);
    if (!item) { setMessage('No words are available at this length yet.', 'bad'); return; }
    game={ item, guessed:new Set(), wrong:0, finished:false, saved:false, cosmetic:randomCosmetic() };
    renderSnowman(); renderWord(); resetKeyboard(); updateClue(); setMessage('Pick a letter!');
    els.newGameBtn.hidden=true;
  }

  function randomCosmetic() {
    const hats=['top','beanie','cap'];
    const scarves=['stripe','plain','dot'];
    const noses=['carrot','short','round'];
    const buttonCounts=[2,3,4];
    return { hat:hats[Math.floor(Math.random()*hats.length)], scarf:scarves[Math.floor(Math.random()*scarves.length)], nose:noses[Math.floor(Math.random()*noses.length)], buttons:buttonCounts[Math.floor(Math.random()*buttonCounts.length)] };
  }

  function guessLetter(letter) {
    if (!game || game.finished || game.guessed.has(letter)) return;
    game.guessed.add(letter);
    const correct=game.item.word.includes(letter);
    const key=els.keyboard.querySelector(`[data-letter="${letter}"]`);
    key.disabled=true; key.classList.add(correct?'good':'bad');

    if (correct) {
      setMessage(['Nice one!','Snow-tastic!','You found one!','Great guess!'][Math.floor(Math.random()*4)], 'good');
      react(['Woohoo!','Brrr-illiant!','Yes!','☃️✨'][Math.floor(Math.random()*4)]);
      animateSnowman('correct');
      renderWord(letter);
      if (isSolved()) finishWin(false);
    } else {
      game.wrong++;
      const remaining = MELT_STAGES - game.wrong;
      if (remaining === 1) {
        setMessage('⚠️ LAST GUESS — keep him from melting!', 'danger');
        react('ONE GUESS LEFT!');
      } else if (remaining === 0) {
        setMessage('Oh no — puddle time!', 'bad');
        react('MELTED! 💧');
      } else {
        setMessage(['Nope—he’s melting!','Brrr... too warm!','Drip, drip!','Uh-oh!'][Math.floor(Math.random()*4)], 'bad');
        react(['Too warm!','Drip!','I’m shrinking!','😅'][Math.floor(Math.random()*4)]);
      }
      animateMelt(() => {
        renderSnowman();
        if (game.wrong >= MELT_STAGES) beginSaveChance();
      });
    }
  }

  function isSolved() { return [...game.item.word].every(ch => game.guessed.has(ch)); }

  function finishWin(saved) {
    game.finished=true; game.saved=saved;
    markSolved(game.item.word);
    renderWord(null, true);
    disableKeyboard();
    if (saved) {
      game.wrong=0; renderSnowman(true); react('SAVED! ☃️'); setMessage('You saved the snowman!', 'good');
      els.winMessage.textContent='You saved the snowman and solved the word!';
    } else {
      react('Hooray! ❄️'); setMessage('You got it!', 'good');
      els.winMessage.textContent='You solved the word!';
    }
    els.winWord.textContent=game.item.word;
    els.newGameBtn.hidden=true;
    setTimeout(() => openModal('winModal', false), 450);
  }

  function beginSaveChance() {
    game.finished=true; disableKeyboard(); renderSnowman();
    setTimeout(() => { els.saveGuess.value=''; els.saveGuess.maxLength=game.item.word.length; els.saveFeedback.textContent=''; openModal('saveModal', false); setTimeout(()=>els.saveGuess.focus(),80); }, 420);
  }

  function submitSaveGuess() {
    const guess=els.saveGuess.value.trim().toUpperCase().replace(/[^A-Z]/g,'');
    if (!guess) { els.saveFeedback.textContent='Type the whole word first.'; return; }
    if (guess === game.item.word) {
      closeModal(); finishWin(true);
    } else {
      closeModal();
      renderWord(null, true);
      setMessage(`The word was ${game.item.word}. New snowman?`, 'bad');
      react('Puddle time! 💧');
      els.newGameBtn.hidden=false;
    }
  }

  function markSolved(word) {
    const len=word.length; state.solved[len] ||= [];
    if (!state.solved[len].includes(word)) state.solved[len].push(word);
    saveState();
  }

  function renderWord(justGuessed=null, reveal=false) {
    els.wordDisplay.innerHTML='';
    [...game.item.word].forEach(ch => {
      const slot=document.createElement('div'); slot.className='letter-slot';
      if (reveal || game.guessed.has(ch)) { slot.textContent=ch; if (justGuessed===ch) slot.classList.add('pop'); }
      els.wordDisplay.appendChild(slot);
    });
  }

  function resetKeyboard() { els.keyboard.querySelectorAll('.key').forEach(k => { k.disabled=false; k.classList.remove('good','bad'); }); }
  function disableKeyboard() { els.keyboard.querySelectorAll('.key').forEach(k => k.disabled=true); }
  function updateClue() { els.clueWrap.hidden=!state.clues; if (game) els.clueText.textContent=game.item.clue; }
  function setMessage(text, cls='') { els.message.textContent=text; els.message.className=`message ${cls}`.trim(); }
  function react(text) { els.reaction.textContent=text; els.reaction.classList.remove('show'); void els.reaction.offsetWidth; els.reaction.classList.add('show'); }
  function animateSnowman(cls) { const svg=els.snowmanMount.querySelector('svg'); if (!svg) return; svg.classList.remove('correct','wrong'); void svg.offsetWidth; svg.classList.add(cls); }
  function animateMelt(done) {
    const svg=els.snowmanMount.querySelector('svg');
    if (!svg) { done(); return; }
    svg.classList.remove('melt-pulse'); void svg.offsetWidth; svg.classList.add('melt-pulse');
    const drops=els.snowmanMount.querySelector('.melt-drops'); if (drops) { drops.classList.remove('dripping'); void drops.offsetWidth; drops.classList.add('dripping'); }
    setTimeout(done, 380);
  }

  function renderSnowman(restored=false) {
    const wrong=restored ? 0 : game.wrong;
    const c=game.cosmetic;
    const stage=Math.min(wrong, MELT_STAGES);
    const baseRy=[54,50,45,39,31,23,15,0][stage];
    const baseCy=[207,211,216,222,229,237,245,255][stage];
    const bodyRy=[43,40,36,31,25,18,10,0][stage];
    const bodyCy=[145,150,156,164,174,188,218,255][stage];
    const headR=[36,35,33,30,26,21,15,0][stage];
    const headCy=[83,87,93,101,113,132,184,255][stage];
    const bodyRx=Math.max(0, 43-stage*2.2);
    const baseRx=Math.max(0, 54-stage*2.4);
    const headY=headCy-83;
    const scarfY=headY + stage*2;
    const hatY=headY + stage*1.2;
    const armOpacity=stage<6 ? Math.max(.2,1-stage*.12) : 0;
    const accessoryOpacity=stage<7 ? Math.max(.25,1-stage*.1) : 0;
    const buttonOpacity=stage<7 ? Math.max(.15,1-stage*.13) : 0;
    const puddleRx=72 + stage*18;
    const puddleRy=10 + stage*2.2;
    const warning=stage===6;
    els.snowmanMount.classList.toggle('last-chance', warning);
    els.snowmanMount.innerHTML = `
      <svg class="snowman-svg stage-${stage}" viewBox="0 0 320 280" role="img" aria-label="Snowman with ${Math.max(0,MELT_STAGES-stage)} wrong guesses remaining">
        <ellipse class="puddle" cx="160" cy="258" rx="${puddleRx}" ry="${puddleRy}" fill="#77c9eb" opacity="${.18+stage*.1}"/>
        <g class="melt-drops" opacity="${stage ? .95 : 0}">
          <circle cx="122" cy="205" r="5" fill="#dff6ff"/><circle cx="201" cy="165" r="4" fill="#dff6ff"/><circle cx="174" cy="105" r="3.5" fill="#dff6ff"/>
        </g>
        ${stage<7 ? `<ellipse cx="160" cy="${baseCy}" rx="${baseRx}" ry="${baseRy}" fill="#fff" stroke="#b6d9ea" stroke-width="3"/>` : ''}
        ${stage<7 ? `<ellipse cx="160" cy="${bodyCy}" rx="${bodyRx}" ry="${bodyRy}" fill="#fff" stroke="#b6d9ea" stroke-width="3"/>` : ''}
        <g opacity="${armOpacity}">
          <path d="M122 ${143+stage*5} L82 ${118+stage*7} L64 ${121+stage*7}" stroke="#74533e" stroke-width="6" fill="none" stroke-linecap="round"/>
          <path d="M198 ${143+stage*5} L236 ${116+stage*7} L255 ${111+stage*7}" stroke="#74533e" stroke-width="6" fill="none" stroke-linecap="round"/>
        </g>
        ${stage<7 ? `<g transform="translate(0 ${headY})"><circle cx="160" cy="83" r="${headR}" fill="#fff" stroke="#b6d9ea" stroke-width="3"/>
          <circle cx="148" cy="76" r="${Math.max(2.4,4-stage*.18)}" fill="#223645"/><circle cx="173" cy="76" r="${Math.max(2.4,4-stage*.18)}" fill="#223645"/>
          <path d="M148 95 Q160 ${stage>=6?99:105} 174 94" stroke="#223645" stroke-width="3" fill="none" stroke-linecap="round"/>
          <g opacity="${accessoryOpacity}">${noseSvg(c.nose)}</g></g>` : ''}
        ${stage<7 ? `<g transform="translate(0 ${scarfY})" opacity="${accessoryOpacity}">${scarfSvg(c.scarf)}</g>` : ''}
        ${stage<7 ? `<g transform="translate(0 ${hatY})" opacity="${accessoryOpacity}">${hatSvg(c.hat)}</g>` : ''}
        ${stage<7 ? `<g transform="translate(0 ${stage*8})" opacity="${buttonOpacity}">${buttonsSvg(c.buttons, stage)}</g>` : ''}
        ${warning ? `<g class="last-guess-ring"><ellipse cx="160" cy="250" rx="92" ry="22" fill="none" stroke="#e85d4a" stroke-width="5" stroke-dasharray="9 7"/></g>` : ''}
      </svg>`;
  }

  function hatSvg(type) {
    if (type==='beanie') return `<path d="M130 53 Q160 23 190 53 L187 60 L133 60 Z" fill="#e65c66"/><circle cx="160" cy="26" r="8" fill="#fff"/><rect x="128" y="54" width="64" height="12" rx="6" fill="#c94752"/>`;
    if (type==='cap') return `<path d="M132 55 Q150 37 181 48 L187 58 L136 62 Z" fill="#5a75c8"/><path d="M177 57 Q198 57 208 64 Q189 67 175 64Z" fill="#455faf"/>`;
    return `<rect x="135" y="27" width="50" height="34" rx="5" fill="#303a46"/><rect x="122" y="57" width="76" height="10" rx="5" fill="#202832"/><rect x="135" y="49" width="50" height="7" fill="#e65c66"/>`;
  }
  function scarfSvg(type) {
    const base = type==='plain' ? '#ef7b45' : type==='dot' ? '#7b61c9' : '#2b9b7b';
    const detail = type==='stripe' ? `<path d="M128 112 L193 112" stroke="#f4d35e" stroke-width="5"/>` : type==='dot' ? `<circle cx="145" cy="110" r="3" fill="#fff"/><circle cx="169" cy="110" r="3" fill="#fff"/><circle cx="190" cy="110" r="3" fill="#fff"/>` : '';
    return `<path d="M126 105 Q160 116 195 104 L193 119 Q159 129 128 119Z" fill="${base}"/>${detail}<path d="M185 115 L207 156 L191 160 L174 119Z" fill="${base}"/>`;
  }
  function noseSvg(type) {
    if (type==='round') return `<circle cx="160" cy="87" r="7" fill="#f38b2e"/>`;
    if (type==='short') return `<path d="M158 84 L181 90 L158 94Z" fill="#f38b2e"/>`;
    return `<path d="M158 84 L197 90 L158 95Z" fill="#f38b2e"/>`;
  }
  function buttonsSvg(count, stage=0) {
    const ys = count===2 ? [139,169] : count===3 ? [131,154,178] : [128,147,167,188];
    const remain=Math.max(0, ys.length-Math.floor(stage/2));
    return ys.slice(0,remain).map(y => `<circle cx="160" cy="${y}" r="4.5" fill="#354452"/>`).join('');
  }

  function renderStats() {
    els.statsGrid.innerHTML='';
    let solvedTotal=0, bankTotal=0;
    for (let len=4; len<=8; len++) {
      const bank=byLength[len].length; const solved=(state.solved[len] || []).filter(w => byLength[len].some(x=>x.word===w)).length;
      solvedTotal+=solved; bankTotal+=bank;
      const row=document.createElement('div'); row.className='progress-row';
      const label=document.createElement('span'); label.className='progress-label'; label.textContent=`${len} letters`;
      const count=document.createElement('span'); count.className='progress-count'; count.textContent=`${solved} / ${bank}`;
      row.append(label,count); els.statsGrid.appendChild(row);
    }
    els.statsTotal.textContent=`${solvedTotal} / ${bankTotal}`;
  }

  function openModal(id, allowStack=true) {
    if (openModalId && allowStack) document.getElementById(openModalId).hidden=true;
    openModalId=id; document.getElementById(id).hidden=false; els.modalBackdrop.hidden=false;
    if (id==='grownupsGateModal') makeMathGate();
  }
  function closeModal() {
    document.querySelectorAll('.modal').forEach(m=>m.hidden=true); els.modalBackdrop.hidden=true; openModalId=null;
  }

  function makeMathGate() {
    const a=3+Math.floor(Math.random()*7), b=2+Math.floor(Math.random()*7); mathAnswer=a+b;
    els.mathQuestion.textContent=`${a} + ${b} =`; els.mathAnswer.value=''; els.mathFeedback.textContent=''; setTimeout(()=>els.mathAnswer.focus(),80);
  }
  function checkMathGate() {
    if (Number(els.mathAnswer.value) === mathAnswer) { document.getElementById('grownupsGateModal').hidden=true; openModalId='grownupsModal'; document.getElementById('grownupsModal').hidden=false; }
    else { els.mathFeedback.textContent='Not quite—try again!'; makeMathGate(); }
  }

  init();
})();
