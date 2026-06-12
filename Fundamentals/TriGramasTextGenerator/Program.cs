var model = new Dictionary<string, Dictionary<string, int>>();

var texts = new[]
{
    "El gato negro salta sobre la mesa",
    "El gato negro salta sobre la computadora",
    "El gato negro salta sobre el otro gato",
    "El gato negro corre por el jardín",
    "El gato negro duerme en la cama",
    "El gato negro despierta en la cama",

    "Despierta en el sofá de Juan",
    "Juan corre en el parque",
    "El sofá es azul",
    "Juan duerme en la cama",
    "El perro duerme en el sofá",
    "Sobre el otro perro hay un gato",
    "La computadora es nueva",
    "La mesa tiene 4 patas",
    "El jardín es verde y tiene plantas",

    "El perro grande ladra en la noche",
    "El perro grande juega en el parque",
    "La casa blanca tiene ventanas grandes",
    "La casa blanca tiene puertas antiguas",
    "La casa blanca está en la colina",
    "Me gusta comer pizza los viernes",
    "Me gusta comer pasta los domingos",
    "Me gusta beber café por la mañana"
};


foreach (var text in texts)
{
    var tokens = text.Split(' ').Select(t => t.ToLowerInvariant()).ToArray();

    for (int i = 0; i < tokens.Length - 2; i++)
    {
        var current = $"{tokens[i]} {tokens[i + 1]}";
        var next = tokens[i + 2];

        if (!model.ContainsKey(current))
        {
            model[current] = new Dictionary<string, int>();
        }

        if (!model[current].ContainsKey(next))
        {
            model[current][next] = 0;
        }

        model[current][next]++;
    }
}

var random = new Random();

string Predict(string word1, string word2)
{
    var context = $"{word1.ToLowerInvariant()} {word2.ToLowerInvariant()}";

    if (!model.ContainsKey(context))
    {
        return "?";
    }

    var weightedList = new List<string>();
    foreach (var kv in model[context])
    {
        for (int i = 0; i < kv.Value; i++)
        {
            weightedList.Add(kv.Key);
        }
    }

    var rand = random.Next(weightedList.Count);
    return weightedList[rand];
}

string w1 = "El";
string w2 = "gato";
var result = new List<string> { w1, w2 };

for (int i = 0; i < 10; i++)
{
    var next = Predict(w1, w2);
    if (next == "?") break;
    result.Add(next);
    w1 = w2;
    w2 = next;
}

Console.WriteLine(string.Join(" ", result));