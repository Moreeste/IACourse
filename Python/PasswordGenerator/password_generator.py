import random
import string


def password_generator(length: int) -> str:
    if length <= 0:
        raise ValueError("La longitud debe ser mayor que 0")

    characters = string.ascii_letters + string.digits + string.punctuation
    return "".join(random.choice(characters) for _ in range(length))


if __name__ == "__main__":
    while True:
        try:
            length = int(input("Ingrese la longitud de la contraseña: ").strip())
            if length > 0:
                break
            print("La longitud debe ser un número mayor a 0.")
        except ValueError:
            print("Ingrese un número válido.")

    password = password_generator(length)
    print(password)
