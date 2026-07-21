public class MyProgram
{
    private List<string> Beers { get; } = new();
    public ISave SaveHandler { get; }

    public MyProgram(ISave saveHandler)
    {
        SaveHandler = saveHandler;
    }

    public void ShowMenu()
    {
        while (true)
        {
            Console.WriteLine("Menu:");
            Console.WriteLine("1.- Add beer");
            Console.WriteLine("2.- Save beers");
            Console.WriteLine("3.- Exit");
            Console.Write("Choose an option: ");

            var option = Console.ReadLine();

            if (!int.TryParse(option, out var selectedOption))
            {
                Console.WriteLine("Invalid option.");
                continue;
            }

            if (selectedOption == 3)
            {
                Console.WriteLine("Goodbye!");
                break;
            }

            ExecuteOption(selectedOption);
        }
    }

    private void ExecuteOption(int option)
    {
        switch (option)
        {
            case 1:
                AddBeer();
                break;
            case 2:
                SaveBeers();
                break;
            default:
                Console.WriteLine("Invalid option.");
                break;
        }
    }

    private void AddBeer()
    {
        Console.WriteLine("Write the name of your beer");
        var beerName = Console.ReadLine();

        if (!string.IsNullOrWhiteSpace(beerName))
        {
            Beers.Add(beerName);
            Console.WriteLine($"Beer added: {beerName}");
        }
        else
        {
            Console.WriteLine("The beer name cannot be empty.");
        }
    }

    private void SaveBeers()
    {
        SaveHandler.Save(Beers);
        Console.WriteLine("Beers saved.");
    }
}
