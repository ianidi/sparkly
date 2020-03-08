import { message } from "./Message";

export default function ErrorHandler(module, code) {
  let error = { title: "Ошибка", message: "" };

  switch (code) {
    case "NETWORK_ERROR":
      error.message = "Ошибка сети. Проверьте подключение к интернет";
      break;
    case "SMS_DELIVERY_ERROR":
      error.message =
        "Не удалось отправить код подтверждения на указанный номер телефона";
      break;
    case "INVALID_PHONE":
      error.message = "Неверный формат номера телефона";
      break;
    case "NO_MEMBER_RECORD":
      error.message =
        "Пользователь с таким номером телефона не зарегистрирован";
      break;
    case "NO_VERIFY_RECORD":
      error.message = "Код подтверждения истек. Запросите код повторно";
      break;
    default:
      error.message = "Неизвестная ошибка";
  }

  message(error.title, error.message);
}
//message("Ошибка", "Не удалось запросить код подтверждения");
