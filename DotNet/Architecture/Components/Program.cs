using System;

var xmlSave = new XMLSave("cervezas.xml");
var program = new MyProgram(xmlSave);
program.ShowMenu();
