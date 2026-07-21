using System.Text.Json;

public class JsonSave : ISave
{
    private readonly string _filePath;

    public JsonSave(string filePath)
    {
        _filePath = filePath;
    }

    public void Save(List<string> items)
    {
        var json = JsonSerializer.Serialize(items, new JsonSerializerOptions { WriteIndented = true });
        File.WriteAllText(_filePath, json);
    }
}
