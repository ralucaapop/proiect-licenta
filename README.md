# DentHelp
Aplicația propusă reprezintă o soluție pentru eficientizarea acestor activități prin implementarea a diverse funcționalități adresându-se atât medicilor stomatologi, cât și pacienților:
  - Manipularea electronică a datelor pacienților
  - Programări online și gestionarea vizitelor
  - Acces la istoricul vizitelor și al procedurilor efectuate

## Arhitectura Aplicatiei:
Aplicația este construită folosind arhitectura 3-layer (trei straturi), fiecare strat având o responsabilitate specifică:
  - **Presentation Layer**: în cadrul aplicației acest nivel îl reprezintă interfața cu utilizatorul (construită folosind framwork-ul React)
  - **Business Logic Layer**: responsabil pentru implementarea regulilor și proceselor care definesc modul în care funcționează sistemul (pentru aplicația “DentHelp” acest strat este implementat folosind limbajul 
 de programare Java împreună cu SpringBoot)
  - **Data Access Layer**: responsabil pentru interacțiunea cu baza de date (baza de date folosită în aplicație este de tip MySql)

## Cazuri de utilizare ## 
![diagrama uc](doc/diagramaClase.png)
