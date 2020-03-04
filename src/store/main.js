import { types, applySnapshot } from "mobx-state-tree";

export const MainStore = types
  .model("MainStore", {
    OnboadringComplete: false, // Завершен ли онбординг (показывать ли его повторно)
    ChatNotificationsEnabled: true, // Уведомления о новых сообщениях в чате включены
    ModalFeedOnboarding: false, // Была ли показана подсказка с жестами управления лентой
    ModalFeedSettingsTooltip: false, // Была ли показана подсказка с настройками фильтрации ленты
    ModalCameraContentTooltip: false // Была ли показана подсказка с правилами относительно запрещенного контента в камере
  })
  .actions(self => ({
    clear() {
      applySnapshot(self, {});
      self.OnboadringComplete = true;
    },
    set(fieldName, value) {
      self[fieldName] = value;
    },
    toggle(fieldName) {
      self[fieldName] = !self[fieldName];
    }
  }));
