var model = new Dictionary<string, Dictionary<string, int>>();

var texts = new[]
{
    "La ia aprende patrones",
    "La ia aprende rápido",
    "La ia predice texto",
    "La ia falla algunas veces"
};

foreach (var text in texts)
{
    var tokens = text.Split(' ');

    for (int i = 0; i < tokens.Length - 1; i++)
    {
        var current = tokens[i];
        var next = tokens[i + 1];

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

string Predict(string word)
{
    if (!model.ContainsKey(word))
    {
        return "?";
    }

    string best = string.Empty;
    int max = 0;

    foreach (var kv in model[word])
    {
        if (kv.Value > max)
        {
            max = kv.Value;
            best = kv.Key;
        }
    }

    return best;
}

var nextWord = Predict("ia");
Console.WriteLine(nextWord);

var nextWord2 = Predict("algunas");
Console.WriteLine(nextWord2);