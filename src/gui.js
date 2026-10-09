import { Pane } from "tweakpane";

export function createGUI(parameters) {
  const pane = new Pane();
  pane.addBinding(parameters, "persistence", {
    label: "Persistence",
    min: 0,
    max: 1,
    step: 0.01,
  });
  pane.addBinding(parameters, "scene", {
    options: {
      thingus: 0,
      particles: 1,
      starPower: 2,
      line: 3,
      blank: 99,
    },
  });
}
