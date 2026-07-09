import os
import argparse

COMMON_EXTENSIONS = ["pdf", "xlsx", "jpg", "png", "txt", "csv"]


def clear_directory(directory: str) -> None:
    if not os.path.isdir(directory):
        return
    for entry in os.listdir(directory):
        path = os.path.join(directory, entry)
        if os.path.isdir(path):
            for root, dirs, files in os.walk(path, topdown=False):
                for name in files:
                    os.remove(os.path.join(root, name))
                for name in dirs:
                    os.rmdir(os.path.join(root, name))
            os.rmdir(path)
        else:
            os.remove(path)


def create_files(count: int, output_dir: str) -> None:
    os.makedirs(output_dir, exist_ok=True)
    clear_directory(output_dir)

    for i in range(1, count + 1):
        ext = COMMON_EXTENSIONS[(i - 1) % len(COMMON_EXTENSIONS)]
        filename = f"file_{i}.{ext}"
        path = os.path.join(output_dir, filename)
        suffix = 1
        while os.path.exists(path):
            filename = f"file_{i}_{suffix}.{ext}"
            path = os.path.join(output_dir, filename)
            suffix += 1

        with open(path, "wb") as f:
            if ext == "pdf":
                f.write(b"%PDF-1.4\n%EOF\n")
            elif ext == "xlsx":
                f.write(b"PK\x03\x04\x14\x00")
            elif ext in {"jpg", "png"}:
                f.write(b"\x00")
            else:
                f.write(b"Archivo de prueba.\n")

        print(f"Creado: {path}")


if __name__ == "__main__":
    parser = argparse.ArgumentParser(
        description="Genera archivos de prueba con extensiones comunes y no riesgosas."
    )
    parser.add_argument(
        "count",
        type=int,
        help="Cantidad de archivos a generar.",
    )
    parser.add_argument(
        "--output",
        type=str,
        default="files",
        help="Directorio donde se crearán los archivos."
    )
    args = parser.parse_args()
    create_files(args.count, args.output)
