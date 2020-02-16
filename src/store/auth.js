import { types, flow, applySnapshot } from "mobx-state-tree";
import { api } from "../service/Api";
import * as NavigationService from "../service/NavigationService";
import { message } from "../service/Message";

export const AuthStore = types
  .model("AuthStore", {
    loading: false, // Запрос к API в процессе, заблокироваать новые
    demoMode: false, // Пользователь пропустил регистрацию ("не сейчас")
    status: false, // Статус авторизации пользователя
    SignupComplete: false, // Завершена ли регистрация
    Phone: types.maybe(types.string), // Номер мобильного телефона
    PhoneMasked: types.optional(types.string, "+7"), // Номер мобильного телефона в отформатированном виде (только для отображения на странице ввода кода из СМС)
    Name: types.maybe(types.string), // Имя
    Gender: types.maybe(types.string), // Пол (m/f)
    UniversityID: types.maybe(types.number), // ID университета, к которому относится пользователь
    UniversityTitle: types.maybe(types.string), // Название университета, к которому относится пользователь
    UniversityAbbr: types.maybe(types.string), // Аббревиатура университета, к которому относится пользователь
    Faculty: types.maybe(types.string) // Произвольное описание факультета пользователя
  })
  .actions(self => ({
    clear() {
      applySnapshot(self, {});
      self.onboadringComplete = true;
    },
    set(fieldName, value) {
      self[fieldName] = value;
    },
    RequestCode: flow(function*() {
      try {
        //if (self.loading) {
        //  return;
        //}

        self.loading = true;

        const response = yield api.post("/auth/phone/request", {
          Phone: self.Phone
        });
        console.log(response);

        if (response.data.status == true) {
          NavigationService.navigate("AuthSMSCode");
        } else {
          message("Ошибка", "Не удалось запросить код подтверждения");
        }

        self.loading = false;
      } catch (error) {
        self.loading = false;
        console.log("error", JSON.stringify(error));
      }
    }),
    Auth: flow(function*(Code) {
      try {
        //if (self.loading) {
        //  return;
        //}

        self.loading = true;

        const response = yield api.post("/auth/phone", {
          Phone: self.Phone,
          Code: Code
        });

        if (response.ok && response.data.status == true) {
          const response_2 = yield api.get("/profile");

          console.log(JSON.stringify(response_2), "response_2");

          if (response_2.ok && response_2.data.status == true) {
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
            }
          }

          // Пользователь авторизован
          self.status = true;
        } else {
          message("Ошибка", "Неверный код подтверждения");
        }

        self.loading = false;
      } catch (error) {
        self.loading = false;
        console.log("error", JSON.stringify(error));
      }
    }),
    NameGender: flow(function*() {
      try {
        //if (self.loading) {
        //  return;
        //}

        self.loading = true;

        const response = yield api.post("/signup/NameGender", {
          Name: self.Name,
          Gender: self.Gender
        });

        console.log("NameGender", JSON.stringify(response));

        if (response.ok && response.data.status == true) {
          NavigationService.navigate("Intro");
        } else {
          message("Ошибка", "Введите ваше имя");
        }

        self.loading = false;
      } catch (error) {
        self.loading = false;
        console.log("error", JSON.stringify(error));
      }
    }),
    UniversitySelect: flow(function*() {
      try {
        //if (self.loading) {
        //  return;
        //}

        self.loading = true;

        const response = yield api.post("/signup/university/select", {
          UniversityID: self.UniversityID
        });
        console.log(response);

        if (response.ok && response.data.status == true) {
          NavigationService.navigate("Faculty");
        } else {
          message("Ошибка", "Не получилось выбрать институт");
        }

        self.loading = false;
      } catch (error) {
        self.loading = false;
        console.log("error", JSON.stringify(error));
      }
    }),
    FacultySelect: flow(function*() {
      try {
        //if (self.loading) {
        //  return;
        //}

        self.loading = true;

        const response = yield api.post("/signup/faculty", {
          Faculty: self.Faculty
        });

        if (response.ok && response.data.status == true) {
          self.SignupComplete = true;
        } else {
          message("Ошибка", "Не получилось выбрать факультет");
        }

        self.loading = false;
      } catch (error) {
        self.loading = false;
        console.log("error", JSON.stringify(error));
      }
    })
  }));
