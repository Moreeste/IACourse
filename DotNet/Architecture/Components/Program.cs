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

var xmlSave = new XMLSave("cervezas.xml");
Save(xmlSave);
