var model = new Dictionary<string, Dictionary<string, int>>();

var texts = new[]
{
    "El gato negro salta sobre la mesa",
    "El gato negro corre por el jardín",
    "El gato negro duerme en la cama",
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
    var tokens = text.Split(' ');

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

string Predict(string word1, string word2)
{
    var context = $"{word1} {word2}";

    if (!model.ContainsKey(context))
    {
        return "?";
    }

    string best = string.Empty;
    int max = 0;

    foreach (var kv in model[context])
    {
        if (kv.Value > max)
        {
            max = kv.Value;
            best = kv.Key;
        }
    }

    return best;
}

var nextWord = Predict("El", "gato");
Console.WriteLine(nextWord);

var nextWord2 = Predict("gato", "negro");
Console.WriteLine(nextWord2);

var nextWord3 = Predict("La", "casa");
Console.WriteLine(nextWord3);
