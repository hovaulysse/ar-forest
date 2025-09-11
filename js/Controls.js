// js/Controls.js
export class Controls {
  constructor(env, forest) {
    this.env = env;
    this.forest = forest;
    this._bindUI();
    this._updateStats();   // boucle affichage stats
  }

  _bindUI() {
    const map = {
      temp   : 'temp',
      precip : 'precip',
      co2    : 'co2_atm',
      water  : 'water'
    };
    Object.entries(map).forEach(([id, prop]) => {
      const el = document.getElementById(id);
      el.addEventListener('input', e => this.env.set(prop, Number(e.target.value)));
    });
    document.getElementById('reset').addEventListener('click', () => {
      this.env.temp    = 20;
      this.env.precip  = 1200;
      this.env.co2_atm = 415;
      this.env.water   = 100;
      // mettre à jour visuellement les sliders
      Object.entries(map).forEach(([id, prop]) => {
        document.getElementById(id).value = this.env[prop];
      });
    });
  }

  // Affiche les stats toutes les 300 ms (pas besoin de les rafraîchir à chaque frame)
  _updateStats() {
    const stats = this.forest.getStats();
    document.getElementById('alive').textContent = stats.alive;
    document.getElementById('total').textContent = stats.total;
    document.getElementById('co2cap').textContent = stats.co2Captured;
    document.getElementById('waterrec').textContent = stats.waterRecycled;
    requestAnimationFrame(() => this._updateStats());
  }
}
