// js/Environment.js
export class Environment {
  constructor() {
    this.temp   = 20;   // °C
    this.precip = 1200; // mm/an
    this.co2_atm= 415; // ppm
    this.water  = 100;  // % de disponibilité
  }
  set(prop, value) { this[prop] = value; }
}
