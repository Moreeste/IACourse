using System.Xml.Serialization;

public class XMLSave : ISave
{
    private readonly string _filePath;

    public XMLSave(string filePath)
    {
        _filePath = filePath;
    }

    public void Save(List<string> items)
    {
        var serializer = new XmlSerializer(typeof(List<string>));

        using var stream = new FileStream(_filePath, FileMode.Create, FileAccess.Write);
        serializer.Serialize(stream, items);
    }
}
