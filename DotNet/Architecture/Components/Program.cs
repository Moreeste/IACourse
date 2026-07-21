using Microsoft.Extensions.DependencyInjection;

var services = new ServiceCollection();
services.AddSingleton<ISave>(new XMLSave("cervezas.xml"));
services.AddSingleton<MyProgram>();

using var serviceProvider = services.BuildServiceProvider();
var program = serviceProvider.GetRequiredService<MyProgram>();
program.ShowMenu();
