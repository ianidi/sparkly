import { types, flow, applySnapshot } from "mobx-state-tree";
import { api } from "../service/Api";
import * as NavigationService from "../service/Navigation";
import { message } from "../service/Message";
import ErrorHandler from "../service/ErrorHandler";

InterestModel = types
  .model({
    InterestID: types.identifierNumber,
    Title: "",
    Active: false
  })
  .actions(self => ({
    toggle() {
      self.Active = !self.Active;
    }
  }));

export const MemberStore = types
  .model("MemberStore", {
    loading: false, // Запрос к API в процессе, заблокироваать новые
    demoMode: false, // Пользователь пропустил регистрацию ("не сейчас")
    status: false, // Статус авторизации пользователя
    SignupComplete: false, // Завершена ли регистрация
    Synchronized: true, // Данные синхронизированы с сервером. false - Необходимо перезапросить инфо о пользователе с сервера. Пользователь редактировал свой профиль, но не сохранил настройки.
    Phone: types.maybe(types.string), // Номер мобильного телефона
    PhoneMasked: types.optional(types.string, "+7"), // Номер мобильного телефона в отформатированном виде (только для отображения на странице ввода кода из СМС)
    Name: types.maybe(types.string), // Имя
    Gender: types.maybe(types.string), // Пол (m/f)
    UniversityID: types.maybe(types.number), // ID университета, к которому относится пользователь
    UniversityTitle: types.maybe(types.string), // Название университета, к которому относится пользователь
    UniversityAbbr: types.maybe(types.string), // Аббревиатура университета, к которому относится пользователь
    Faculty: types.maybe(types.string), // Произвольное описание факультета пользователя
    AvatarURI: types.optional(types.string, ""), // URI адрес аватара пользователя
    Interests: types.array(InterestModel), // Интересы пользователя
    RoommateSearch: false, // Показывать в анкете статус "ищу соседа"
    ImageUploadLocalURI: types.maybeNull(types.string), // Путь к локальному файлу контента, который пользователь отснял последним. Используется для показа превью и загрузки на сервер в ленту
    ImageUploadRestrictUniversity: false, // Переключатель при загрузке контента в ленту: показывать контент только студентам из моего университета
    MemberFeedURI: types.maybeNull(types.string), // Путь к локальному файлу контента, который пользователь отснял последним и успешно загрузил на сервер
    MemberFeedRestrictUniversity: false // Переключатель при последней успешной загрузке контента в ленту: показывать контент только студентам из моего университета
  })
  .actions(self => ({
    clear() {
      applySnapshot(self, {});
    },
    set(fieldName, value) {
      self[fieldName] = value;
    },
    toggle(fieldName) {
      self[fieldName] = !self[fieldName];
    },
    RequestCode: flow(function*() {
      try {
        self.loading = true;

        const response = yield api.post("/auth/phone/request", {
          Phone: self.Phone
        });
        console.log(JSON.stringify(response));
        self.loading = false;

        if (response.ok) {
          if (response.data.status == true) {
            NavigationService.navigate("AuthSMSCode");
          }
        } else {
          ErrorHandler("RequestCode", response.data?.error);
          return false;
        }
      } catch (error) {
        self.loading = false;
        console.log("error", JSON.stringify(error));
      }
    }),
    Auth: flow(function*(Code) {
      try {
        self.loading = true;

        const response = yield api.post("/auth/phone", {
          Phone: self.Phone,
          Code: Code
        });
        console.log(JSON.stringify(response));
        self.loading = false;

        if (response.ok) {
          if (response.data?.status) {
            const response_2 = yield api.get("/profile");

            console.log(JSON.stringify(response_2), "response_2");

            if (response_2.ok && response_2.data?.status) {
              let result = response_2.data.result;

              // Завершил ли пользователь регистрацию
              self.SignupComplete = result.SignupComplete;

              self.Name = result.Name;
              self.Gender = result.Gender;
              self.Faculty = result.Faculty;

              if (result.SignupComplete) {
                self.UniversityID = result.University[0].UniversityID;
                self.UniversityTitle = result.University[0].Title;
                self.UniversityAbbr = result.University[0].Abbr;
                self.AvatarURI = result.AvatarURI;
                self.RoommateSearch = result.RoommateSearch;

                if (typeof result?.Feed[0] != "undefined") {
                  self.MemberFeedRestrictUniversity =
                    result.Feed[0].RestrictUniversity;
                  self.MemberFeedURI = result.Feed[0].URI;
                }
              }

              // Пользователь авторизован
              self.status = true;
            } else {
              ErrorHandler("Auth", "NETWORK_ERROR");
              return false;
            }
          }
        } else {
          ErrorHandler("Auth", response.data?.error);
          return false;
        }
      } catch (error) {
        self.loading = false;
        console.log("error", JSON.stringify(error));
        return false;
      }
    }),
    NameGender: flow(function*() {
      try {
        self.loading = true;

        const response = yield api.post("/profile/NameGender", {
          Name: self.Name,
          Gender: self.Gender
        });
        console.log(JSON.stringify(response));
        self.loading = false;

        if (response.ok) {
          if (response.data.status == true) {
            self.Synchronized = true;

            if (self.SignupComplete) {
              NavigationService.goBack();
            } else {
              NavigationService.navigate("Intro");
            }
          }
        } else {
          message("Неверный формат имени", "Введите ваше обычное имя");
        }
      } catch (error) {
        self.loading = false;
        console.log("error", JSON.stringify(error));
      }
    }),
    UniversitySelect: flow(function*() {
      try {
        self.loading = true;

        const response = yield api.post("/profile/university/select", {
          UniversityID: self.UniversityID
        });
        console.log(JSON.stringify(response));
        self.loading = false;

        if (response.ok && response.data.status == true) {
          self.Synchronized = true;

          if (self.SignupComplete) {
            NavigationService.goBack();
          } else {
            NavigationService.navigate("Faculty");
          }
        } else {
          message("Ошибка", "Не удалось выбрать институт");
        }
      } catch (error) {
        self.loading = false;
        console.log("error", JSON.stringify(error));
      }
    }),
    FacultySelect: flow(function*() {
      try {
        self.loading = true;

        const response = yield api.post("/profile/faculty", {
          Faculty: self.Faculty
        });
        console.log(JSON.stringify(response));
        self.loading = false;

        if (response.ok && response.data.status == true) {
          self.Synchronized = true;

          if (self.SignupComplete) {
            NavigationService.goBack();
          } else {
            self.SignupComplete = true;
          }
        } else {
          message("Ошибка", "Не удалось выбрать факультет");
        }
      } catch (error) {
        self.loading = false;
        console.log("error", JSON.stringify(error));
      }
    }),
    RoommateSearchToggle: flow(function*(value) {
      try {
        self.loading = true;

        const response = yield api.post("/profile/RoommateSearch", {
          RoommateSearch: value
        });
        console.log(JSON.stringify(response));
        self.loading = false;

        if (response.ok && response.data.status == true) {
          self.RoommateSearch = value;
        } else {
          message("Ошибка", "Не удалось изменить параметр");
        }
      } catch (error) {
        self.loading = false;
        console.log("error", JSON.stringify(error));
      }
    }),
    DeactivateAccount: flow(function*() {
      try {
        self.loading = true;

        const response = yield api.post("/deactivateAccount");

        console.log(JSON.stringify(response));
        self.loading = false;

        if (response.ok && response.data.status == true) {
          return true;
        }
        return false;
      } catch (error) {
        self.loading = false;
        console.log("error", JSON.stringify(error));
        return false;
      }
    }),
    InterestsUpdate: flow(function*(category, value) {
      try {
        self.loading = true;

        const response = yield api.post("/profile/interests", {
          Category: category,
          Interests: value
        });
        console.log(JSON.stringify(response));
        self.loading = false;

        if (response.ok && response.data.status == true) {
          return true;
        } else {
          message("Ошибка", "Не удалось обновить интересы");
        }
        return false;
      } catch (error) {
        self.loading = false;
        console.log("error", JSON.stringify(error));
        return false;
      }
    })
  }));
