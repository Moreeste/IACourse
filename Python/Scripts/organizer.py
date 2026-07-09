import argparse
import os
import shutil

FILE_TYPE_MAP = {
    "images": {"jpg", "jpeg", "png", "gif", "bmp", "webp", "tif", "tiff"},
    "documents": {"pdf", "doc", "docx", "txt", "rtf", "md", "odt"},
    "spreadsheets": {"xls", "xlsx", "csv", "ods"},
    "presentations": {"ppt", "pptx", "key"},
    "archives": {"zip", "tar", "gz", "tgz", "rar", "7z", "xz"},
    "code": {"py", "js", "ts", "java", "c", "cpp", "h", "cs", "go", "rb", "php", "html", "css", "json", "xml", "yaml", "yml"},
    "audio": {"mp3", "wav", "ogg", "flac", "aac", "m4a"},
    "video": {"mp4", "mov", "avi", "mkv", "wmv", "flv"},
}

DEFAULT_SOURCE_DIRS = ["files", "file"]


def get_category(extension: str) -> str:
    if not extension:
        return "no_extension"
    ext = extension.lower().lstrip(".")
    for category, extensions in FILE_TYPE_MAP.items():
        if ext in extensions:
            return category
    return "others"


def unique_destination_path(destination: str) -> str:
    if not os.path.exists(destination):
        return destination

    base, extension = os.path.splitext(destination)
    suffix = 1
    while True:
        candidate = f"{base}_{suffix}{extension}"
        if not os.path.exists(candidate):
            return candidate
        suffix += 1


def organize_files(source_dir: str, target_dir: str) -> None:
    os.makedirs(target_dir, exist_ok=True)

    if not os.path.isdir(source_dir):
        raise FileNotFoundError(f"El directorio de origen no existe: {source_dir}")

    for entry in os.listdir(source_dir):
        source_path = os.path.join(source_dir, entry)
        if not os.path.isfile(source_path):
            continue

        _, extension = os.path.splitext(entry)
        category = get_category(extension)
        category_dir = os.path.join(target_dir, category)
        os.makedirs(category_dir, exist_ok=True)

        destination_path = unique_destination_path(os.path.join(category_dir, entry))
        shutil.move(source_path, destination_path)
        print(f"Movido: {entry} -> {os.path.relpath(destination_path, start=target_dir)}")


if __name__ == "__main__":
    parser = argparse.ArgumentParser(
        description="Organiza archivos en carpetas dentro de organized_files según su tipo."
    )
    parser.add_argument(
        "--source",
        type=str,
        default=None,
        help="Carpeta de origen con los archivos a organizar (por defecto busca 'files' o 'file').",
    )
    parser.add_argument(
        "--target",
        type=str,
        default="organized_files",
        help="Nombre de la carpeta destino donde se guardarán los archivos organizados.",
    )
    args = parser.parse_args()

    base_dir = os.path.dirname(os.path.abspath(__file__))
    source_dir = args.source or next((os.path.join(base_dir, d) for d in DEFAULT_SOURCE_DIRS if os.path.isdir(os.path.join(base_dir, d))), os.path.join(base_dir, "files"))
    if not os.path.isdir(source_dir):
        raise FileNotFoundError(
            f"No se encontró el directorio de origen. Asegúrate de tener una carpeta 'files' o 'file' en {base_dir}."
        )

    target_dir = os.path.join(base_dir, args.target)
    organize_files(source_dir, target_dir)
    print(f"Archivos organizados en: {target_dir}")
