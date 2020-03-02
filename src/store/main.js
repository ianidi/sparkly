import { types, applySnapshot } from "mobx-state-tree";

export const MainStore = types
  .model("MainStore", {
    onboadringComplete: false, // Завершен ли онбординг (показывать ли его повторно)
    ChatNotificationsEnabled: true // Уведомления о новых сообщениях в чате включены
  })
  .actions(self => ({
    clear() {
      applySnapshot(self, {});
      self.onboadringComplete = true;
    },
    set(fieldName, value) {
      self[fieldName] = value;
    },
    toggle(fieldName) {
      self[fieldName] = !self[fieldName];
    }
  }));
