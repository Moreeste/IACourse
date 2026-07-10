import csv
import json
from pathlib import Path


def export_json_to_csv(input_path: Path, output_path: Path) -> None:
    with input_path.open("r", encoding="utf-8") as file:
        beers = json.load(file)

    with output_path.open("w", encoding="utf-8", newline="") as file:
        writer = csv.DictWriter(
            file,
            fieldnames=["cerveza", "Precio"],
        )
        writer.writeheader()
        for beer in beers:
            writer.writerow(
                {
                    "cerveza": beer["marca"],
                    "Precio": beer["precioUsd"],
                }
            )


def main() -> None:
    base_dir = Path(__file__).resolve().parent
    input_candidates = [base_dir / "beers.json", base_dir / "beer.json"]
    input_path = next((path for path in input_candidates if path.exists()), None)

    if input_path is None:
        raise FileNotFoundError("No se encontró el archivo JSON. Se esperaba beers.json o beer.json")

    output_path = base_dir / "beer.csv"
    export_json_to_csv(input_path, output_path)
    print(f"Archivo exportado correctamente a: {output_path}")


if __name__ == "__main__":
    main()
