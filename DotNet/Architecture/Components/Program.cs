using System;

List<string> cervezas = new()
{
    "Heineken",
    "Budweiser",
    "Corona",
    "Modelo",
    "Stella Artois",
    "Pilsen",
    "Coors",
    "Mahou",
    "Amstel",
    "Cruzcampo"
};

void Save(ISave save)
{
    Console.WriteLine("Iniciando guardado");
    save.Save(cervezas);
    Console.WriteLine("Guardado realizado");
}

var jsonSave = new JsonSave("cervezas.json");
Save(jsonSave);
