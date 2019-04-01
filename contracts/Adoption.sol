pragma solidity ^0.5.0;

contract Adoption {
    // Direcciones de Ethereum con tamaño 16 en la variable adopters
    address[16] public adopters;

    // Función para adoptar una mascota
    function adopt(uint petId) public returns (uint) {
        // Comprobamos que la id está dentro de nuestro rango
        require(petId >= 0 && petId <= 15);
        // Si está dentro la agregamos al array adopters a la 
        // la persona que llamó a la función (msg.sender)
        adopters[petId] = msg.sender;
        // Devolvemos la id que se ha añadido
        return petId;
    }

    // Función para recuperar a los adoptantes, con memory damos 
    // la ubicación de los datos del array, y con view no modificará
    // los datos
    function getAdopters() public view returns (address[16] memory) {
        return adopters;
    }
}