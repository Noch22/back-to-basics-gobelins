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
      matrix: 1,
      both: 2,
      blank: 99,
    },
  });
}
