import { types } from "mobx-state-tree";

export const MainStore = types
  .model("MainStore", {
    onboadringComplete: false // Завершен ли онбординг (показывать ли его повторно)
  })
  .actions(self => ({
    clear() {
      applySnapshot(self, {});
      self.onboadringComplete = true;
    },
    set(fieldName, value) {
      self[fieldName] = value;
    }
  }));
